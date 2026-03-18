FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=1536"
# Provide dummy DATABASE_URL for medusa build (config loader requires it)
ENV DATABASE_URL="postgres://dummy:dummy@localhost:5432/dummy"
RUN npm run build
ENV DATABASE_URL=""

EXPOSE 9000

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"
CMD ["sh", "-c", "echo 'Starting migrations...' && npx medusa db:migrate && echo 'Migrations done. Starting server...' && npx medusa start"]
