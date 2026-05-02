/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ito-game_advanced',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
