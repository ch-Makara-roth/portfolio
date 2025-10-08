'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, ExternalLink, Calendar, Star, Code, Eye, Users, Clock, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Project } from '@/app/api/projects/route'

interface ProjectDetailPageProps {
  project: Project
}

export default function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  const router = useRouter()
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg/95 to-bg/90">
      {/* Navigation Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-dimmed/20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-dimmed hover:text-text transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Projects</span>
              <span className="sm:hidden">Back</span>
            </Button>
            
            <nav className="hidden md:flex items-center gap-1 text-sm text-dimmed">
              <Link href="/projects" className="hover:text-text transition-colors">
                Projects
              </Link>
              <span className="mx-2">/</span>
              <span className="text-text font-medium truncate max-w-[200px]">
                {project.title}
              </span>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Project Header */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {project.featured && (
                      <Badge className="bg-accent/20 text-accent border-accent/30">
                        <Star size={14} className="mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text leading-tight">
                    {project.title}
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-dimmed leading-relaxed max-w-3xl">
                    {project.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:min-w-fit">
                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="border-dimmed/30 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 group"
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github size={20} className="mr-2 group-hover:text-accent transition-colors" />
                        <span className="hidden sm:inline">View Code</span>
                        <span className="sm:hidden">GitHub</span>
                      </a>
                    </Button>
                  )}
                  
                  {project.liveUrl && (
                    <Button
                      size="lg"
                      asChild
                      className="bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 hover:border-accent/50 transition-all duration-300"
                    >
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={20} className="mr-2" />
                        <span className="hidden sm:inline">Live Demo</span>
                        <span className="sm:hidden">Demo</span>
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Project Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-dimmed/10 to-dimmed/5 border border-dimmed/20"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className={`object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                priority
              />
              
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/20 via-transparent to-transparent" />
            </motion.div>
          </motion.section>

          {/* Project Details Grid */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Technologies */}
              <Card className="p-6 bg-gradient-to-br from-bg/80 via-bg/60 to-bg/40 backdrop-blur-xl border-dimmed/20">
                <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                  <Code size={20} className="text-accent" />
                  Technologies Used
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.techStack.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Badge
                        className="bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30 transition-colors duration-300 text-sm px-3 py-2"
                      >
                        <Tag size={12} className="mr-1" />
                        {tech}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Project Features (Mock data for demonstration) */}
              <Card className="p-6 bg-gradient-to-br from-bg/80 via-bg/60 to-bg/40 backdrop-blur-xl border-dimmed/20">
                <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                  <Eye size={20} className="text-accent" />
                  Key Features
                </h2>
                <div className="space-y-3">
                  {[
                    'Modern and responsive user interface',
                    'Optimized performance and fast loading times',
                    'Cross-browser compatibility',
                    'Mobile-first design approach',
                    'Accessible and user-friendly experience'
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <p className="text-dimmed leading-relaxed">{feature}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Stats */}
              <Card className="p-6 bg-gradient-to-br from-bg/80 via-bg/60 to-bg/40 backdrop-blur-xl border-dimmed/20">
                <h3 className="text-lg font-semibold text-text mb-4">Project Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={16} className="text-accent" />
                    <span className="text-dimmed">Created:</span>
                    <span className="text-text font-medium">2024</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={16} className="text-accent" />
                    <span className="text-dimmed">Status:</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      Completed
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Users size={16} className="text-accent" />
                    <span className="text-dimmed">Type:</span>
                    <span className="text-text font-medium">
                      {project.featured ? 'Featured Project' : 'Personal Project'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 bg-gradient-to-br from-bg/80 via-bg/60 to-bg/40 backdrop-blur-xl border-dimmed/20">
                <h3 className="text-lg font-semibold text-text mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full justify-start border-dimmed/30 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300"
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github size={16} className="mr-2" />
                        View Repository
                      </a>
                    </Button>
                  )}
                  
                  {project.liveUrl && (
                    <Button
                      size="sm"
                      asChild
                      className="w-full justify-start bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 hover:border-accent/50 transition-all duration-300"
                    >
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} className="mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/projects')}
                    className="w-full justify-start text-dimmed hover:text-text transition-colors"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Projects
                  </Button>
                </div>
              </Card>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}