import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Project } from '@/app/api/projects/route'
import { generateMetadata as generateSeoMetadata } from '@/lib/metadata'
import ProjectDetailPage from '../../../components/ProjectDetailPage'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

async function fetchProjects(): Promise<Project[]> {
  // Fallback data for build time when API is not available (must match /api/projects/route.ts)
  const fallbackProjects: Project[] = [
    {
      id: '1',
      title: 'Online Tools',
      category: 'SaaS Tool',
      description: 'An all-in-one suite of online tools designed for daily tasks like image compression, PDF editing, and QR code generation.',
      longDescription: 'OnlineTools is a comprehensive platform providing essential digital utilities. It features advanced image compression algorithms, PDF manipulation tools, and a custom QR code generator. Built with a focus on speed and user privacy, it offers a seamless experience with no registration required.',
      image: '/images/projects/online-tools.png',
      techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Shadcn UI'],
      githubUrl: 'https://github.com/ch-Makara-roth/online-tools',
      liveUrl: 'https://online-tools.chhuonmakararoth.site/',
      featured: true,
      role: 'Solo Developer',
      timeline: '2025',
      features: [
        'Image Compression & Resizing',
        'PDF Editing Tools',
        'QR Code Generation',
        'Command Palette (Cmd+K)',
        'No Registration Required'
      ]
    },
    {
      id: '2',
      title: 'The Modern Walk',
      category: 'E-Commerce Store',
      description: 'A high-end e-commerce concept store focusing on premium performance footwear and minimalist shoe design.',
      longDescription: 'An immersive shopping experience for high-performance footwear. The Modern Walk blends athletic engineering with street style, featuring high-quality product spotlights, interactive UI elements, and a minimalist design aesthetic that emphasizes the products.',
      image: '/images/projects/shoe-shop.png',
      techStack: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'Vercel'],
      githubUrl: 'https://github.com/ch-Makara-roth/shoe-shop-v1',
      liveUrl: 'https://shoe-shop-fawn.vercel.app/',
      featured: true,
      role: 'Solo Developer',
      timeline: '2026',
      features: [
        'Interactive Product Spotlight',
        'Minimalist UI/UX',
        'Performance Optimized',
        'Responsive Design',
        'Custom Animations'
      ]
    }
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
      return generateSeoMetadata({
        title: 'Project Not Found',
        description: 'The requested project could not be found.',
        path: `/projects/${params.slug}`,
      })
    }

    return generateSeoMetadata({
      title: project.title,
      description: project.description,
      path: `/projects/${project.id}`,
      image: project.image,
    })
  } catch (error) {
    return generateSeoMetadata({
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
      path: `/projects/${params.slug}`,
    })
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
