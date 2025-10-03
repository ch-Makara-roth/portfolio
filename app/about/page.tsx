import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import AboutPage from '@/components/AboutPage'

export const metadata: Metadata = generateMetadata({
  title: 'About',
  description: 'Learn more about Chhuon Makara Roth, a full-stack developer from Phnom Penh, Cambodia with 3+ years of experience in React, Next.js, TypeScript, and modern web development.',
  path: '/about',
})

export default function About() {
  return <AboutPage />
} 