FROM ghcr.io/puppeteer/puppeteer:24.8.0

LABEL Name="puppeteer-http" \
      Version="1.0.0"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

