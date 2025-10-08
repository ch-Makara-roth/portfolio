'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Star, Folder } from 'lucide-react'
import { ProjectCard } from './ProjectCard'
import { ProjectFilter } from './ProjectFilter'
import { Project } from '@/app/api/projects/route'

export function ProjectsPage() {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      return response.json() as Promise<Project[]>
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-bg/95 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-dimmed">Loading amazing projects...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-bg/95 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <h2 className="text-xl font-semibold text-text mb-2">Oops! Something went wrong</h2>
            <p className="text-dimmed">Failed to load projects. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  const featuredProjects = filteredProjects.filter(project => project.featured)
  const otherProjects = filteredProjects.filter(project => !project.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-bg/95 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6">
            My <span className="text-accent">Projects</span>
          </h1>
          <p className="text-lg text-dimmed max-w-2xl mx-auto leading-relaxed">
            Explore my collection of projects, from web applications to mobile apps. 
            Each project represents a unique challenge and learning experience.
          </p>
        </motion.div>

        {/* Filter Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <ProjectFilter 
            projects={projects || []} 
            onFilteredProjects={setFilteredProjects}
            onViewModeChange={setViewMode}
          />
        </motion.div>

        {/* Projects Grid */}
        <div className="space-y-12">
          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-8 flex items-center gap-3">
                <Star className="text-accent" size={28} />
                Featured Projects
              </h2>
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8'
                  : 'space-y-6'
              }`}>
                {featuredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProjectCard project={project} viewMode={viewMode} />
                    </motion.div>
                  ))}
              </div>
            </motion.section>
          )}

          {/* Other Projects */}
          {otherProjects.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-8 flex items-center gap-3">
                <Folder className="text-secondary" size={28} />
                All Projects
              </h2>
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8'
                  : 'space-y-6'
              }`}>
                {otherProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProjectCard project={project} viewMode={viewMode} />
                    </motion.div>
                  ))}
              </div>
            </motion.section>
          )}

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 space-y-4"
            >
              <div className="text-6xl">🔍</div>
              <h3 className="text-xl font-semibold text-text">No projects found</h3>
              <p className="text-dimmed max-w-md mx-auto">Try adjusting your filters to see more results.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}