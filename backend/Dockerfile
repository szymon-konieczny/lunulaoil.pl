# Stage 1: Build (full deps + compile Medusa server + admin UI)
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# NODE_ENV must be development during build so admin panel is included
# DATABASE_URL dummy needed for config loader
ARG CACHEBUST=1
RUN NODE_ENV=development \
    DATABASE_URL="postgres://dummy:dummy@localhost:5432/dummy" \
    NODE_OPTIONS="--max-old-space-size=1536" \
    npm run build \
    && test -f .medusa/server/public/admin/index.html \
    && echo "=== Admin build verified OK ===" \
    || (echo "FATAL: Admin index.html not found!" && exit 1) \
    && cp -r .medusa/server/public ./public

# Stage 2: Runtime (prod deps + built artifacts only)
FROM node:22-alpine AS runtime
WORKDIR /app

# Copy installed deps + built artifacts from builder
# (full node_modules incl. ts-node, which Medusa CLI requires at runtime)
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/public ./public

# Medusa loads config + resolves module paths at runtime
COPY --from=builder /app/medusa-config.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src ./src

EXPOSE 9000
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"
CMD ["sh", "-c", "npx medusa start --port ${PORT:-9000}"]
