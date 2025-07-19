import { Metadata } from 'next'

export const baseMetadata = {
  title: 'Chhuon Makara Roth - Full Stack Developer',
  description: 'Portfolio of Makara, a full-stack developer specializing in modern web technologies including React, Next.js, TypeScript, and Node.js.',
  keywords: 'Makara, Chhuon Makara Roth, full-stack developer, React, Next.js, TypeScript, Node.js, web development, Cambodia developer, portfolio',
  author: 'Chhuon Makara Roth',
  siteUrl: 'https://your-domain.com', // Replace with your actual domain
}

export function generateMetadata({
  title,
  description,
  path = '',
  image = '/og-image.jpg',
  type = 'website',
}: {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
}): Metadata {
  const fullTitle = title ? `${title} | ${baseMetadata.title}` : baseMetadata.title
  const fullDescription = description || baseMetadata.description
  const fullUrl = `${baseMetadata.siteUrl}${path}`

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: baseMetadata.keywords,
    authors: [{ name: baseMetadata.author }],
    creator: baseMetadata.author,
    publisher: baseMetadata.author,
    
    // Add metadataBase to resolve social media images
    metadataBase: new URL(baseMetadata.siteUrl),
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: baseMetadata.title,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: type,
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [image],
      creator: '@your-twitter-handle', // Replace with your Twitter handle
    },
    
    // Additional SEO
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Canonical URL
    alternates: {
      canonical: fullUrl,
    },
    
    // App-specific
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
    },
    
    // Verification (add your verification codes)
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
    
    // Additional metadata
    category: 'Technology',
  }
}

export function generateStructuredData(type: 'person' | 'website' | 'article', data: any) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'person':
      return {
        ...baseStructuredData,
        '@type': 'Person',
        name: 'Chhuon Makara Roth',
        jobTitle: 'Full Stack Developer',
        description: 'Full-stack developer specializing in modern web technologies',
        url: baseMetadata.siteUrl,
        sameAs: [
          'https://github.com/your-github',
          'https://linkedin.com/in/your-linkedin',
          'https://twitter.com/your-twitter',
        ],
        knowsAbout: [
          'JavaScript',
          'React',
          'Next.js',
          'TypeScript',
          'Node.js',
          'Web Development',
          'Full Stack Development',
        ],
        ...data,
      }
    
    case 'website':
      return {
        ...baseStructuredData,
        '@type': 'WebSite',
        name: baseMetadata.title,
        url: baseMetadata.siteUrl,
        description: baseMetadata.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseMetadata.siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
        ...data,
      }
    
    case 'article':
      return {
        ...baseStructuredData,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Person',
          name: baseMetadata.author,
        },
        publisher: {
          '@type': 'Person',
          name: baseMetadata.author,
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        ...data,
      }
    
    default:
      return baseStructuredData
  }
} 