/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AI_PROVIDER_API_KEY: process.env.AI_PROVIDER_API_KEY,
    AI_PROVIDER_BASE_URL: process.env.AI_PROVIDER_BASE_URL,
    AI_PROVIDER_MODEL: process.env.AI_PROVIDER_MODEL,
    NEXT_PUBLIC_CONSOLE_DELAY_MS: process.env.CONSOLE_DELAY_MS || '3000',
  },
}

module.exports = nextConfig
