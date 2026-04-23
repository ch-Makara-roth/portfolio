import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ContactPage from '@/components/ContactPage'

export const metadata: Metadata = generateMetadata({
  title: 'Contact',
  description: 'Get in touch with Chhuon Makara Roth for web development projects, freelance work, or collaboration opportunities. Available for full-stack development and consulting.',
  path: '/contact',
})

export default function Contact() {
  return (
    <>
      {/* Server-rendered H1 for SEO */}
      <h1 className="sr-only">Contact Chhuon Makara Roth - Full Stack Developer</h1>
      <ContactPage />
    </>
  )
} 