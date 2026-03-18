FROM node:22-alpine AS base

WORKDIR /app

# Install ALL dependencies (including devDeps needed for build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build Medusa API + admin dashboard
# Limit Node memory to avoid OOM on Railway's build servers
ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN npm run build

# Prune devDependencies after build
RUN npm prune --omit=dev

# Production — slim final image
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=base /app /app

ENV NODE_OPTIONS="--max-old-space-size=1024"

EXPOSE 9000

# Run migrations then start server
CMD ["sh", "-c", "npx medusa db:migrate 2>&1 && npx medusa start"]
