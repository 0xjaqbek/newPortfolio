/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    AI_PROVIDER_API_KEY: process.env.AI_PROVIDER_API_KEY,
    AI_PROVIDER_BASE_URL: process.env.AI_PROVIDER_BASE_URL,
    AI_PROVIDER_MODEL: process.env.AI_PROVIDER_MODEL,
  },
}

module.exports = nextConfig
