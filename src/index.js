const express = require('express');
const puppeteer = require('puppeteer');
const { marked } = require('marked');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

const app = express();
app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// PDF generation endpoint
app.post('/pdf', async (req, res) => {
  logger.info('Received PDF generation request');
  
  try {
    const { html, options = {} } = req.body;
    
    if (!html) {
      logger.error('Missing required html parameter');
      return res.status(400).json({ error: 'Missing required html parameter' });
    }

    // Merge query parameters with options
    const pdfOptions = {
      ...options,
      ...req.query
    };

    // Convert markdown to HTML if needed
    const content = html.includes('```') ? marked(html) : html;

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(content, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      ...pdfOptions
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
    res.send(pdf);

    logger.info('PDF generated successfully');
  } catch (error) {
    logger.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
}); 