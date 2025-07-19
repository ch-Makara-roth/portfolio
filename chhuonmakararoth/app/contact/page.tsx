import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ContactPage from '@/components/ContactPage'

export const metadata: Metadata = generateMetadata({
  title: 'Contact',
  description: 'Get in touch with Chhuon Makara Roth for web development projects, freelance work, or collaboration opportunities. Available for full-stack development and consulting.',
  path: '/contact',
})

export default function Contact() {
  return <ContactPage />
} 