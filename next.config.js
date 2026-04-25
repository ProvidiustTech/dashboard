/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',        // Creates a much smaller, self-contained build
  swcMinify: false,            // Saves memory during build
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,   // Only if you have TS errors
  },
};

export default nextConfig;