const createNextIntlPlugin = require("next-intl/plugin")
const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * Parse Medusa backend hostname from MEDUSA_BACKEND_URL so its /static/*
 * images are accepted by next/image without hardcoding the Railway URL.
 */
const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
let MEDUSA_BACKEND_HOSTNAME = null
if (MEDUSA_BACKEND_URL) {
  try {
    MEDUSA_BACKEND_HOSTNAME = new URL(MEDUSA_BACKEND_URL).hostname
  } catch {
    // ignore invalid URL — fallback to wildcard patterns below
  }
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "lunulaoil.pl",
      },
      {
        protocol: "https",
        hostname: "www.lunulaoil.pl",
      },
      // Railway deployments (backend serving /static/* assets)
      {
        protocol: "https",
        hostname: "**.up.railway.app",
      },
      // Cloudflare R2 public buckets (default pub-*.r2.dev hostnames)
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      // Specific backend host if MEDUSA_BACKEND_URL is set at build time
      ...(MEDUSA_BACKEND_HOSTNAME
        ? [
            {
              protocol: "https",
              hostname: MEDUSA_BACKEND_HOSTNAME,
            },
          ]
        : []),
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
}

module.exports = withNextIntl(nextConfig)
