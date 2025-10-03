import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import HomePage from '@/components/HomePage'

export const metadata: Metadata = generateMetadata({
  title: 'Home',
  description: 'Portfolio of Chhuon Makara Roth, a full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies. Based in Phnom Penh, Cambodia.',
  path: '/',
})

export default function Home() {
  return <HomePage />
} 