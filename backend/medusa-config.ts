import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const databaseUrl = process.env.DATABASE_URL

// Railway internal Postgres doesn't need SSL
// Public Railway Postgres URLs do need SSL
const needsSsl = databaseUrl?.includes("railway") && !databaseUrl?.includes(".railway.internal")

const databaseDriverOptions = needsSsl
  ? { connection: { ssl: { rejectUnauthorized: false } } }
  : undefined

module.exports = defineConfig({
  admin: {
    disable: process.env.DISABLE_ADMIN === "true",
  },
  projectConfig: {
    databaseUrl,
    databaseDriverOptions,
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
