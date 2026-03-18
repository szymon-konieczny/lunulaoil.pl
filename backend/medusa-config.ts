import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Railway Postgres uses internal networking — no SSL needed for private URLs
// For public URLs, SSL is required
const databaseUrl = process.env.DATABASE_URL
const databaseExtra: Record<string, unknown> = {}

// Only enable SSL for public Railway Postgres URLs (not internal .railway.internal)
if (process.env.DATABASE_URL?.includes("railway") && !process.env.DATABASE_URL?.includes(".railway.internal")) {
  databaseExtra.ssl = { rejectUnauthorized: false }
}

module.exports = defineConfig({
  admin: {
    disable: process.env.DISABLE_ADMIN === "true",
  },
  projectConfig: {
    databaseUrl,
    databaseExtra,
    databaseLogging: false,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  }
})
