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
  // Fallback data for build time when API is not available
  const fallbackProjects = [
    { id: '1', title: 'E-Commerce Platform', description: 'A full-stack e-commerce solution', image: '/images/projects/ecommerce.jpg', techStack: ['React', 'Node.js'], featured: true, githubUrl: 'https://github.com/yourusername/ecommerce-platform', liveUrl: 'https://ecommerce-demo.vercel.app' },
    { id: '2', title: 'Task Management App', description: 'A collaborative task management application', image: '/images/projects/taskmanager.jpg', techStack: ['Vue.js', 'Express'], featured: false, githubUrl: 'https://github.com/yourusername/task-manager', liveUrl: 'https://taskmanager-demo.netlify.app' },
    { id: '3', title: 'Weather Dashboard', description: 'Real-time weather monitoring dashboard', image: '/images/projects/weather.jpg', techStack: ['React', 'API'], featured: true, githubUrl: 'https://github.com/yourusername/weather-dashboard', liveUrl: 'https://weather-dashboard-demo.vercel.app' }
  ]

  // During build time, always use fallback data to avoid fetch issues
  if (process.env.NODE_ENV === 'production') {
    return fallbackProjects
  }

  // For development, try to fetch from API with fallback
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
    const response = await fetch(`${baseUrl}/api/projects`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.warn('API not available, using fallback data')
      return fallbackProjects
    }
    
    return response.json()
  } catch (error) {
    console.warn('Failed to fetch projects, using fallback data:', error)
    return fallbackProjects
  }
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