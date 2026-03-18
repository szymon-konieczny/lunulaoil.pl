FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=1536"
# Provide dummy DATABASE_URL for medusa build (config loader requires it)
# NODE_ENV must NOT be production during build or admin gets skipped
ENV DATABASE_URL="postgres://dummy:dummy@localhost:5432/dummy"
ENV NODE_ENV=development
RUN npm run build \
    && ls -la .medusa/server/public/admin/index.html \
    && echo "Admin build verified OK" \
    || (echo "FATAL: Admin index.html not found! Build failed." && exit 1)
ENV DATABASE_URL=""

EXPOSE 9000

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"
CMD ["sh", "-c", "echo 'Starting migrations...' && npx medusa db:migrate && echo 'Migrations done. Starting server...' && npx medusa start"]
