/** @type {import('next').NextConfig} */

const nextConfig = {
  // Performance optimizations
  compress: true,

  // Image optimization - Allow images from any HTTPS source
  // This is needed because blog posts from the API may contain images from various sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // dangerouslyAllowSVG removed for security
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

  // Headers for better security and performance
  async headers() {
    const isDev = process.env.NODE_ENV === 'development'
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
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ''}https://challenges.cloudflare.com https://analytics.ahrefs.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com https://analytics.ahrefs.com https://www.google-analytics.com https://api.chhuonmakararoth.site; frame-src https://challenges.cloudflare.com;`,
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // X-XSS-Protection removed - deprecated and can reduce security
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