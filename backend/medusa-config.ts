import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const databaseUrl = process.env.DATABASE_URL || "postgres://localhost:5432/medusa"

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
  },
  modules: [
    ...(process.env.R2_ACCESS_KEY_ID ? [{
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-s3",
            id: "s3",
            options: {
              file_url: process.env.R2_PUBLIC_URL,
              access_key_id: process.env.R2_ACCESS_KEY_ID,
              secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
              region: "auto",
              bucket: process.env.R2_BUCKET_NAME || "lunula-assets",
              endpoint: process.env.R2_ENDPOINT,
              additional_config: {
                forcePathStyle: true,
              },
            },
          },
        ],
      },
    }] : []),
    {
      resolve: "./src/modules/ingredients",
    },
    {
      resolve: "./src/modules/instagram_bot",
    },
  ],
})
