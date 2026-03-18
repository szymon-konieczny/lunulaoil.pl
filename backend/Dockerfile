FROM node:22-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN npm run build

# Production — only prod deps + built output
FROM node:22-alpine AS production

WORKDIR /app

# Prod-only node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Built source + config from build stage
COPY --from=build /app/.medusa ./.medusa
COPY --from=build /app/src ./src
COPY --from=build /app/package.json /app/medusa-config.ts /app/tsconfig.json ./

ENV NODE_OPTIONS="--max-old-space-size=1024"
EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate 2>&1 && npx medusa start"]
