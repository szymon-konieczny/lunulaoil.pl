FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN npm run build

EXPOSE 9000

ENV NODE_OPTIONS="--max-old-space-size=1024"
CMD ["sh", "-c", "npx medusa db:migrate 2>&1 && npx medusa start"]
