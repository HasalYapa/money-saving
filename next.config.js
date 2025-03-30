/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure dynamic routes - these routes won't be statically generated
  // but will be server-rendered at request time
  experimental: {
    // This allows searchParams to be used without errors in deployment
    serverActions: {
      allowedOrigins: ['localhost:3000', 'money-saving-hasal-yapa.vercel.app'],
    },
  },
}

module.exports = nextConfig 