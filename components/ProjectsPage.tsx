'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Star, Folder, ArrowLeft } from 'lucide-react'
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
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      return response.json() as Promise<Project[]>
    },
  })

  const featuredProjects = useMemo(() => filteredProjects.filter(project => project.featured), [filteredProjects])
  const otherProjects = useMemo(() => filteredProjects.filter(project => !project.featured), [filteredProjects])
  const spotlightProject = useMemo(() => featuredProjects[0], [featuredProjects])
  const remainingFeatured = useMemo(() => featuredProjects.slice(1), [featuredProjects])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg py-20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-6 shadow-[0_0_20px_rgba(100,255,218,0.3)]"
          />
          <p className="text-dimmed text-lg animate-pulse">Designing the future...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg py-20 flex items-center justify-center">
        <div className="text-center p-8 bg-red-500/5 rounded-3xl border border-red-500/20 backdrop-blur-xl max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-400 text-4xl">⚠</span>
          </div>
          <h2 className="text-2xl font-bold text-text mb-3">System Overload</h2>
          <p className="text-dimmed mb-6">Failed to retrieve projects from the mainframe. Please re-initiate the connection.</p>
          <Button onClick={() => window.location.reload()} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30">
            Retry Connection
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-bg overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-accent/3 blur-[80px] rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28">
        {/* Header Section */}
        <header className="max-w-4xl mx-auto mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              CURATED WORK
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-text tracking-tighter leading-[0.9]">
              IMAGINING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent/80 to-secondary animate-gradient bg-[length:200%_auto]">POSSIBILITIES.</span>
            </h1>
            <p className="text-lg md:text-xl text-dimmed max-w-2xl leading-relaxed font-light">
              Designing and building digital products with a focus on <span className="text-text font-medium">performance</span>, <span className="text-text font-medium">aesthetics</span>, and <span className="text-text font-medium">user experience</span>.
            </p>
          </motion.div>
        </header>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 md:mb-24"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-bg/40 backdrop-blur-2xl border border-dimmed/10 rounded-3xl p-4 sm:p-6">
              <ProjectFilter
                projects={projects || []}
                onFilteredProjects={setFilteredProjects}
                onViewModeChange={setViewMode}
              />
            </div>
          </div>
        </motion.div>

        {/* Projects Content */}
        <div className="space-y-24 md:space-y-32">
          {filteredProjects.length > 0 ? (
            <>
              {/* Spotlight Project */}
              {viewMode === 'grid' && spotlightProject && (
                <motion.section
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-dimmed/20 to-transparent" />
                    <h2 className="text-xs font-mono text-accent tracking-[0.2em] uppercase">Spotlight</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-dimmed/20 to-transparent" />
                  </div>

                  <div className="group relative">
                    <ProjectCard project={spotlightProject} viewMode="grid" className="md:aspect-video" isLarge />
                  </div>
                </motion.section>
              )}

              {/* Grid or List View */}
              <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {viewMode === 'grid' && (
                  <div className="flex items-center gap-3 mb-12">
                    <h2 className="text-xs font-mono text-dimmed tracking-[0.2em] uppercase">Collections</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-dimmed/20 to-transparent" />
                  </div>
                )}

                <div className={`${viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12'
                  : 'space-y-8'
                  }`}>
                  {(viewMode === 'grid' ? [...remainingFeatured, ...otherProjects] : filteredProjects).map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ProjectCard project={project} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center"
            >
              <div className="relative inline-block mb-8">
                <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative text-6xl">🔭</div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-2">No artifacts found</h3>
              <p className="text-dimmed max-w-sm mx-auto">The search criteria didn't match any of my records. Try adjusting your parameters.</p>
              <Button
                variant="ghost"
                className="mt-8 text-accent hover:bg-accent/10"
                onClick={() => window.location.reload()}
              >
                Reset Exploration
              </Button>
            </motion.div>
          )}
        </div>

        {/* Footer Decoration */}
        <div className="mt-32 pt-16 border-t border-dimmed/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-dimmed">
          <div className="flex items-center gap-4">
            <span className="font-mono text-accent">© 2024</span>
            <span>Handcrafted with precision</span>
          </div>
          <div className="flex gap-8 font-mono">
            <a href="#top" className="hover:text-accent transition-colors">TOP ↑</a>
          </div>
        </div>
      </div>

      {/* Bottom Nav padding for mobile */}
      <div className="h-24 md:hidden" />
    </div>
  )
}