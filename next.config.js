/** @type {import('next').NextConfig} */
const extraImageHosts = (process.env.NEXT_IMAGE_HOSTS || '').split(',').map((h) => h.trim()).filter(Boolean)

const nextConfig = {
  // Performance optimizations
  compress: true,
  
  // Image optimization
  images: {
    domains: ['via.placeholder.com', 'github.com', 'example.com', 'media.geeksforgeeks.org', 'res.cloudinary.com', 'images.veryfront.com', ...extraImageHosts],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.docker.com',
        pathname: '/wp-content/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.nashtechglobal.com',
        pathname: '/wp-content/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.geeksforgeeks.org',
        pathname: '/wp-content/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.veryfront.com',
        pathname: '/**',
      },
      ...extraImageHosts.flatMap((hostname) => ([
        { protocol: 'https', hostname, pathname: '/**' },
        { protocol: 'http', hostname, pathname: '/**' },
      ])),
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // SEO optimizations
  trailingSlash: true,
  generateEtags: true,
  
  // Bundle optimization
  swcMinify: true,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Headers for better SEO and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig