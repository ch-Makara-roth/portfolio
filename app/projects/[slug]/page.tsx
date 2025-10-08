import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Project } from '@/app/api/projects/route'
import ProjectDetailPage from '../../../components/ProjectDetailPage'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/projects`, {
    cache: 'no-store'
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }
  
  return response.json()
}

// Generate metadata for the project detail page
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    const projects = await fetchProjects()
    const project = projects.find((p: Project) => p.id === params.slug)

    if (!project) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be found.'
      }
    }

    return {
      title: `${project.title} | Portfolio`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        images: [
          {
            url: project.image,
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description,
        images: [project.image],
      },
    }
  } catch (error) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.'
    }
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  try {
    const projects = await fetchProjects()
    const project = projects.find((p: Project) => p.id === params.slug)

    if (!project) {
      notFound()
    }

    return <ProjectDetailPage project={project} />
  } catch (error) {
    console.error('Error fetching project:', error)
    notFound()
  }
}

// Generate static params for all projects
export async function generateStaticParams() {
  try {
    const projects = await fetchProjects()
    
    return projects.map((project: Project) => ({
      slug: project.id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}