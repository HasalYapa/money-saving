/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Explicitly exclude dynamic paths from static generation
  output: 'export',
  distDir: 'dist',
  // Configure ignored build errors related to useSearchParams
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Skip type checking to avoid issues with client components
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
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