# Puppeteer HTTP API

A Node.js application that provides an HTTP API wrapper for Puppeteer PDF generation.

## Features

- Convert HTML or Markdown to PDF
- Customizable PDF options
- Health check endpoint
- Logging support

## API Endpoints

### POST /pdf

Generates a PDF from HTML or Markdown content.

**Request Body:**
```json
{
  "html": "<html>Your content here</html>",
  "options": {
    "format": "A4",
    "printBackground": true
  }
}
```

**Query Parameters:**
- Any valid Puppeteer PDF options can be passed as query parameters
- Query parameters will be merged with options from the request body

### GET /healthz

Health check endpoint that returns `{ "status": "ok" }` when the service is running.

## Building and Running

```bash
# Build the Docker image
docker build -t puppeteer-http .

# Run the container
docker run -p 3000:3000 puppeteer-http
```

## Example Usage

```bash
# Generate PDF from HTML
curl -X POST http://localhost:3000/pdf \
  -H "Content-Type: application/json" \
  -d '{"html": "<h1>Hello World</h1>"}' \
  --output document.pdf

# Generate PDF with options
curl -X POST http://localhost:3000/pdf \
  -H "Content-Type: application/json" \
  -d '{"html": "<h1>Hello World</h1>", "options": {"format": "A4", "landscape": true}}' \
  --output document.pdf
```
