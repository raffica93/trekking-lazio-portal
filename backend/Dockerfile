FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server.js scraper.js ./
COPY scripts ./scripts
COPY data ./data

USER node
EXPOSE 3000
CMD ["node", "server.js"]
