'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Star, Eye, Calendar } from 'lucide-react'
import { Project } from '@/app/api/projects/route'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProjectCardProps {
  project: Project
  viewMode?: 'grid' | 'list'
}

export function ProjectCard({ project, viewMode = 'grid' }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleNavigateToProject = () => {
    router.push(`/projects/${project.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative bg-gradient-to-br from-bg/80 via-bg/60 to-bg/40 backdrop-blur-xl border border-dimmed/20 rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 ${
        viewMode === 'list' ? 'flex flex-row' : ''
      }`}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-accent/20 text-accent border-accent/30 backdrop-blur-sm">
            <Star size={12} className="mr-1" />
            Featured
          </Badge>
        </div>
      )}

      {/* Image Container */}
      <div 
        className={`relative overflow-hidden cursor-pointer group/image ${
          viewMode === 'list' 
            ? 'w-80 h-48 flex-shrink-0 rounded-l-2xl' 
            : 'h-48 sm:h-56'
        }`}
        onClick={handleNavigateToProject}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={`transition-transform duration-700 group-hover/image:scale-110 ${
            viewMode === 'list' ? 'object-cover object-center' : 'object-cover'
          }`}
        />
        
        {/* Multi-layer Gradient Overlays */}
        <div className={`absolute inset-0 ${
          viewMode === 'list' 
            ? 'bg-gradient-to-r from-transparent via-bg/10 to-bg/30' 
            : 'bg-gradient-to-t from-bg/90 via-bg/20 to-transparent'
        }`} />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Action Buttons */}
        <div className={`absolute flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${
          viewMode === 'list' ? 'top-4 left-4' : 'top-4 right-4'
        }`}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-bg/80 backdrop-blur-sm rounded-full border border-dimmed/20 hover:border-accent/40 transition-all duration-300"
          >
            <Eye size={16} className="text-dimmed group-hover:text-accent transition-colors" />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-bg/80 backdrop-blur-sm rounded-full border border-dimmed/20 hover:border-accent/40 transition-all duration-300"
          >
            <Calendar size={16} className="text-dimmed group-hover:text-accent transition-colors" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className={`space-y-4 ${viewMode === 'list' ? 'p-6 flex-1' : 'p-6'}`}>
        {/* Title */}
        <h3 
          className="text-xl font-bold text-text group-hover:text-accent transition-colors duration-300 cursor-pointer line-clamp-2"
          onClick={handleNavigateToProject}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-dimmed text-sm leading-relaxed line-clamp-3 group-hover:text-text/80 transition-colors duration-300">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30 transition-colors duration-300"
            >
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 4 && (
            <Badge
              variant="secondary"
              className="text-xs bg-dimmed/20 text-dimmed border-dimmed/30"
            >
              +{project.techStack.length - 4}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {project.githubUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 border-dimmed/30 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 group/btn"
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github size={16} className="mr-2 group-hover/btn:text-accent transition-colors" />
                <span className="hidden xs:inline">Code</span>
                <span className="xs:hidden">GitHub</span>
              </a>
            </Button>
          )}
          
          {project.liveUrl && (
            <Button
              size="sm"
              asChild
              className="flex-1 bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 hover:border-accent/50 transition-all duration-300 relative overflow-hidden group/btn"
            >
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} className="mr-2" />
                <span className="hidden xs:inline">Live Demo</span>
                <span className="xs:hidden">Demo</span>
                
                {/* Animated Border */}
                <div className="absolute inset-0 border border-accent/50 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 animate-pulse" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}