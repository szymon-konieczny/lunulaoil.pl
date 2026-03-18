FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies (cached layer)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Build Medusa (API + admin dashboard)
RUN npm run build

# Production — slim final image
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=base /app /app

EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]
