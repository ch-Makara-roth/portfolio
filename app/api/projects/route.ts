import { NextResponse } from 'next/server'

export interface Project {
  id: string
  title: string
  description: string
  image: string
  techStack: string[]
  githubUrl: string
  liveUrl: string
  featured: boolean
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform built with Next.js, featuring user authentication, payment processing, and admin dashboard. Includes real-time inventory management and order tracking.',
    image: '/images/projects/ecommerce.jpg',
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    githubUrl: 'https://github.com/yourusername/ecommerce-platform',
    liveUrl: 'https://ecommerce-demo.vercel.app',
    featured: true
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features. Built with modern React patterns.',
    image: '/images/projects/taskmanager.jpg',
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express', 'Material-UI'],
    githubUrl: 'https://github.com/yourusername/task-manager',
    liveUrl: 'https://taskmanager-demo.netlify.app',
    featured: true
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'A responsive weather dashboard that displays current conditions, forecasts, and weather maps. Features location-based weather data and beautiful visualizations.',
    image: '/images/projects/weather.jpg',
    techStack: ['Vue.js', 'Chart.js', 'OpenWeather API', 'Vuetify', 'PWA'],
    githubUrl: 'https://github.com/yourusername/weather-dashboard',
    liveUrl: 'https://weather-dashboard-demo.vercel.app',
    featured: true
  },
  {
    id: '4',
    title: 'Blog CMS',
    description: 'A headless content management system for blogs with markdown support, SEO optimization, and multi-author capabilities.',
    image: '/images/projects/blog-cms.jpg',
    techStack: ['Gatsby', 'GraphQL', 'Contentful', 'React', 'Styled Components'],
    githubUrl: 'https://github.com/yourusername/blog-cms',
    liveUrl: 'https://blog-cms-demo.netlify.app',
    featured: false
  },
  {
    id: '5',
    title: 'Fitness Tracker',
    description: 'A mobile-first fitness tracking application with workout logging, progress visualization, and social features for sharing achievements.',
    image: '/images/projects/fitness.jpg',
    techStack: ['React Native', 'Firebase', 'Redux', 'Chart.js', 'Expo'],
    githubUrl: 'https://github.com/yourusername/fitness-tracker',
    liveUrl: 'https://fitness-tracker-demo.expo.dev',
    featured: false
  },
  {
    id: '6',
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio website showcasing projects and skills. Built with performance and accessibility in mind.',
    image: '/images/projects/portfolio.jpg',
    techStack: ['Next.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Vercel'],
    githubUrl: 'https://github.com/yourusername/portfolio',
    liveUrl: 'https://yourportfolio.vercel.app',
    featured: false
  }
]

export async function GET() {
  try {
    // Simulate API delay
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