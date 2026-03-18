FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Build Medusa
RUN npm run build

# Production
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=base /app /app

EXPOSE 9000

# Run migrations then start the server
CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]
