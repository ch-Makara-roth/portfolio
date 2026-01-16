'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Star, Eye, Calendar, ArrowLeft } from 'lucide-react'
import { Project } from '@/app/api/projects/route'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProjectCardProps {
  project: Project
  viewMode?: 'grid' | 'list'
  className?: string
  isLarge?: boolean
}

export function ProjectCard({ project, viewMode = 'grid', className = '', isLarge = false }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleNavigateToProject = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on link buttons
    if ((e.target as HTMLElement).closest('a')) return
    router.push(`/projects/${project.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNavigateToProject}
      className={`group relative bg-bg/20 backdrop-blur-3xl border border-dimmed/10 rounded-[2.5rem] overflow-hidden hover:border-accent/40 transition-all duration-700 hover:shadow-[0_0_50px_rgba(100,255,218,0.1)] cursor-pointer ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
        } ${className}`}
    >
      {/* Dynamic Background Glow */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
      />

      {/* Image Container */}
      <div
        className={`relative overflow-hidden ${viewMode === 'list'
          ? 'w-full h-48 sm:w-[22rem] sm:h-auto flex-shrink-0'
          : isLarge ? 'h-80 sm:h-96 lg:h-[28rem]' : 'h-48 sm:h-56 lg:h-64'
          }`}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={`transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-110 object-cover object-top`}
          priority={isLarge}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Floating Category Badge */}
        {project.category && (
          <div className="absolute top-8 left-8 z-10">
            <Badge className="bg-bg/60 backdrop-blur-md text-accent border border-accent/30 py-1.5 px-4 rounded-full text-[0.7rem] tracking-[0.2em] font-mono uppercase">
              {project.category}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={`relative flex flex-col justify-between p-6 sm:p-8 ${viewMode === 'list' ? 'flex-1' : ''} ${isLarge ? 'lg:p-10' : ''}`}>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3
              className={`font-black tracking-tight text-text leading-[1.1] transition-colors duration-500 group-hover:text-accent ${isLarge ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
                }`}
            >
              {project.title}
            </h3>
            <div className="flex items-center gap-3 text-[0.65rem] font-mono text-dimmed">
              <span>{project.timeline}</span>
              <div className="h-1 w-1 bg-dimmed/40 rounded-full" />
              <span>{project.role}</span>
            </div>
          </div>

          <p className={`text-dimmed leading-relaxed font-light line-clamp-2 group-hover:text-text/80 transition-colors duration-500 ${isLarge ? 'text-base sm:text-lg max-w-2xl' : 'text-sm sm:text-base'
            }`}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {project.techStack.map((tech, index) => (
              <span
                key={index}
                className="text-[9px] sm:text-[10px] font-mono text-dimmed/80 bg-dimmed/5 border border-dimmed/10 px-2.5 py-0.5 rounded-full group-hover:border-accent/20 group-hover:text-accent/80 transition-all duration-500"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-6">
          <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <span className="text-xs font-mono text-accent flex items-center gap-2 group/link">
              EXPLORE CASE STUDY
              <ArrowLeft size={14} className="rotate-180 transition-transform group-hover/link:translate-x-1" />
            </span>
          </motion.div>

          <div className="h-px flex-1 bg-dimmed/10" />

          <div className="flex gap-2.5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-bg/40 border border-dimmed/20 rounded-xl text-dimmed hover:text-accent hover:border-accent/40 transition-all duration-300"
              >
                <Github size={18} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-bg/40 border border-dimmed/20 rounded-xl text-dimmed hover:text-accent hover:border-accent/40 transition-all duration-300"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}