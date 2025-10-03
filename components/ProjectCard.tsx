'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github } from 'lucide-react'
import { Project } from '@/app/api/projects/route'
import Image from 'next/image'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="bg-bg/50 border-dimmed/20 backdrop-blur-sm overflow-hidden h-full">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
        </div>
        
        <div className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-text mb-2 sm:mb-3 group-hover:text-accent transition-colors leading-tight">
              {project.title}
            </h3>
            <p className="text-dimmed text-sm sm:text-base mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
              {project.techStack.map((tech) => (
                <Badge 
                  key={tech} 
                  variant="secondary"
                  className="bg-accent/10 text-accent border-accent/20 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-dimmed/20">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-dimmed/40 text-dimmed hover:text-text hover:border-accent/40 text-xs sm:text-sm py-2 sm:py-3 min-h-[36px] sm:min-h-[40px]"
              asChild
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github size={14} className="mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Code</span>
              </a>
            </Button>
            
            <Button
              size="sm"
              className="flex-1 bg-accent/20 hover:bg-accent/30 text-accent border-accent/40 text-xs sm:text-sm py-2 sm:py-3 min-h-[36px] sm:min-h-[40px]"
              asChild
            >
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} className="mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Live</span>
              </a>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
} 