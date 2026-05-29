import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const databaseUrl = process.env.DATABASE_URL || "postgres://localhost:5432/medusa"

// Railway internal Postgres doesn't need SSL
// Public Railway Postgres URLs do need SSL
const needsSsl = databaseUrl?.includes("railway") && !databaseUrl?.includes(".railway.internal")

const databaseDriverOptions = needsSsl
  ? { connection: { ssl: { rejectUnauthorized: false } } }
  : undefined

const adminAllowedHosts = (process.env.ADMIN_ALLOWED_HOSTS || ".railway.app")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean)

module.exports = defineConfig({
  admin: {
    disable: process.env.DISABLE_ADMIN === "true",
    vite: () => ({
      server: {
        allowedHosts: adminAllowedHosts,
      },
    }),
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
    // Paynow.pl payment provider — only registered when credentials are present,
    // so local dev / Docker build (no keys) boot with the default system provider.
    ...(process.env.PAYNOW_API_KEY
      ? [
          {
            resolve: "@medusajs/medusa/payment",
            options: {
              providers: [
                {
                  resolve: "./src/modules/paynow",
                  id: "paynow",
                  options: {
                    apiKey: process.env.PAYNOW_API_KEY,
                    signatureKey: process.env.PAYNOW_SIGNATURE_KEY,
                    // https://api.paynow.pl (prod) or https://api.sandbox.paynow.pl
                    apiUrl: process.env.PAYNOW_API_URL,
                    // Storefront base used to build the buyer return (continueUrl).
                    storefrontUrl:
                      process.env.PAYNOW_STOREFRONT_URL ||
                      process.env.STORE_CORS?.split(",")[0],
                  },
                },
              ],
            },
          },
        ]
      : []),
    // SMTP email notifications — only registered when SMTP_HOST is set, so local
    // dev / builds without mail config boot fine.
    ...(process.env.SMTP_HOST
      ? [
          {
            resolve: "@medusajs/medusa/notification",
            options: {
              providers: [
                {
                  resolve: "./src/modules/smtp-notification",
                  id: "smtp",
                  options: {
                    channels: ["email"],
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT || 465),
                    secure: (process.env.SMTP_SECURE || "true") === "true",
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                    from:
                      process.env.SMTP_FROM ||
                      process.env.SMTP_USER ||
                      "kontakt@lunulaoil.pl",
                  },
                },
              ],
            },
          },
        ]
      : []),
  ],
})
