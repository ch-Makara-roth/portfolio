'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { ProjectCard } from './ProjectCard'
import { ProjectFilter } from './ProjectFilter'
import { Project } from '@/app/api/projects/route'
import { Button } from '@/components/ui/button'

export function ProjectsPage() {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to fetch projects')
      return response.json() as Promise<Project[]>
    },
  })

  // First project gets the large featured treatment; rest go in the grid
  const spotlightProject = useMemo(
    () => filteredProjects.find(p => p.featured) ?? filteredProjects[0],
    [filteredProjects]
  )
  const gridProjects = useMemo(
    () => filteredProjects.filter(p => p !== spotlightProject),
    [filteredProjects, spotlightProject]
  )

  // Stats
  const totalTechs = useMemo(() => {
    if (!projects) return 0
    const set = new Set<string>()
    projects.forEach(p => p.techStack.forEach(t => set.add(t)))
    return set.size
  }, [projects])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
          />
          <p className="text-dimmed text-sm font-mono">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-dimmed">Failed to load projects.</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw size={14} className="mr-2" /> Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28 max-w-6xl">

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 md:mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-accent" />
                <span className="text-xs font-mono text-accent tracking-widest uppercase">Portfolio</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-text tracking-tight leading-none">
                My Work.
              </h1>
              <p className="text-dimmed max-w-lg leading-relaxed text-base">
                A curated collection of projects I've designed and built — focused on clean UX, performance, and shipping things that matter.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 shrink-0 border border-dimmed/10 rounded-2xl px-8 py-5 bg-bg/40">
              <div className="text-center">
                <p className="text-3xl font-black text-text tabular-nums">{projects?.length ?? 0}</p>
                <p className="text-[10px] font-mono text-dimmed uppercase tracking-widest mt-1">Projects</p>
              </div>
              <div className="w-px h-10 bg-dimmed/10" />
              <div className="text-center">
                <p className="text-3xl font-black text-text tabular-nums">{totalTechs}</p>
                <p className="text-[10px] font-mono text-dimmed uppercase tracking-widest mt-1">Technologies</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* ── Filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10 pb-8 border-b border-dimmed/10"
        >
          <ProjectFilter
            projects={projects || []}
            onFilteredProjects={setFilteredProjects}
            onViewModeChange={setViewMode}
          />
        </motion.div>

        {/* ── Projects ── */}
        {filteredProjects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {viewMode === 'grid' ? (
              <div className="space-y-6">
                {/* Spotlight — large horizontal card */}
                {spotlightProject && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProjectCard project={spotlightProject} viewMode="grid" isLarge />
                  </motion.div>
                )}

                {/* Remaining projects in 2-col grid */}
                {gridProjects.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gridProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <ProjectCard project={project} viewMode="grid" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                  >
                    <ProjectCard project={project} viewMode="list" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="py-24 text-center space-y-3">
            <p className="text-4xl">🔍</p>
            <h3 className="text-xl font-semibold text-text">No projects found</h3>
            <p className="text-dimmed text-sm">Try adjusting your search or filters.</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 text-accent hover:bg-accent/10"
              onClick={() => window.location.reload()}
            >
              Reset filters
            </Button>
          </div>
        )}

      </div>

      {/* Mobile nav padding */}
      <div className="h-24 md:hidden" />
    </div>
  )
}