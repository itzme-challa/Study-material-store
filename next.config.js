/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CF_APP_ID: process.env.CF_APP_ID,
    CF_SECRET_KEY: process.env.CF_SECRET_KEY,
  },
  images: {
    domains: [],
  },
}

module.exports = nextConfig
