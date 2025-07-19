import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ProjectsPage from '@/components/ProjectsPage'

export const metadata: Metadata = generateMetadata({
  title: 'Projects',
  description: 'Portfolio of projects by Chhuon Makara Roth, featuring full-stack web applications, mobile apps, and modern web technologies including React, Next.js, and TypeScript.',
  path: '/projects',
})

export default function Projects() {
  return <ProjectsPage />
} 