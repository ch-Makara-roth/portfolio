import './globals.css'
import { Inter } from 'next/font/google'
import { QueryProvider } from '@/components/QueryProvider'
import { DockNavigation } from '@/components/DockNavigation'
import { generateMetadata, generateStructuredData } from '@/lib/metadata'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata = generateMetadata({})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a1a1a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const personStructuredData = generateStructuredData('person', {})
  const websiteStructuredData = generateStructuredData('website', {})

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} bg-bg text-text font-fira min-h-screen safe-area-inset-top safe-area-inset-bottom`}>
        <QueryProvider>
          <main className="pb-16 sm:pb-20 md:pb-24 safe-area-inset-top">
            {children}
          </main>
          <DockNavigation />
        </QueryProvider>
      </body>
    </html>
  )
} 