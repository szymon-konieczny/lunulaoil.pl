FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build Medusa backend + admin dashboard
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

EXPOSE 9000

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
