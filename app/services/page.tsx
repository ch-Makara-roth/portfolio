import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ServicesPage from '@/components/ServicesPage'

export const metadata: Metadata = generateMetadata({
  title: 'Services',
  description: 'Web development services by Chhuon Makara Roth, including full-stack web apps, mobile development, API development, UI/UX design, and technical consulting.',
  path: '/services',
})

export default function Services() {
  return <ServicesPage />
}
