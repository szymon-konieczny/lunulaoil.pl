FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
COPY patches/ ./patches/
RUN npm ci

# Copy source
COPY . .

# Build arguments (needed at build time for Next.js)
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_DEFAULT_REGION=pl
# InPost Geowidget token — must be inlined at build time for the checkout map
ARG NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN

# MEDUSA_BACKEND_URL is used by server-side code (SDK, middleware)
# Fall back to NEXT_PUBLIC_MEDUSA_BACKEND_URL if MEDUSA_BACKEND_URL is not set
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL:-$NEXT_PUBLIC_MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_DEFAULT_REGION=$NEXT_PUBLIC_DEFAULT_REGION
ENV NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN=$NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN

# Build Next.js — `output: "standalone"` in next.config.js makes this emit
# .next/standalone with a self-contained server.js and only the node_modules
# files the server actually traces (no devDependencies, no build tooling)
RUN npm run build

# Production
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
# The standalone server reads its port and bind address from the environment,
# there is no CLI flag like in `next start -p 8000`
ENV PORT=8000
ENV HOSTNAME=0.0.0.0

# Copy only what the standalone server needs: it brings its own package.json,
# server.js and a minimal node_modules. `public` and `.next/static` are not
# part of the standalone bundle and have to be copied separately.
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

EXPOSE 8000

CMD ["node", "server.js"]
