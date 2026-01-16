import { NextResponse } from 'next/server'

export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image: string
  techStack: string[]
  githubUrl: string
  liveUrl: string
  featured: boolean
  category?: string
  role?: string
  timeline?: string
  features?: string[]
}

const mockProjects: Project[] = [
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

export async function GET() {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))

    return NextResponse.json(mockProjects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}