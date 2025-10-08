'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Filter, X, Grid, List, SortAsc, SortDesc } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Project } from '@/app/api/projects/route'

interface ProjectFilterProps {
  projects: Project[]
  onFilteredProjects: (projects: Project[]) => void
  onViewModeChange?: (viewMode: ViewMode) => void
  className?: string
}

type SortOption = 'title' | 'featured' | 'newest' | 'oldest'
type ViewMode = 'grid' | 'list'

export function ProjectFilter({ projects, onFilteredProjects, onViewModeChange, className = '' }: ProjectFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Extract all unique technologies from projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>()
    projects.forEach(project => {
      project.techStack.forEach(tech => techSet.add(tech))
    })
    return Array.from(techSet).sort()
  }, [projects])

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      // Search filter
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Technology filter
      const matchesTech = selectedTechs.length === 0 || 
                         selectedTechs.some(tech => project.techStack.includes(tech))
      
      // Featured filter
      const matchesFeatured = !showFeaturedOnly || project.featured
      
      return matchesSearch && matchesTech && matchesFeatured
    })

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'featured':
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return a.title.localeCompare(b.title)
        case 'newest':
          return b.id.localeCompare(a.id) // Assuming higher ID means newer
        case 'oldest':
          return a.id.localeCompare(b.id)
        default:
          return 0
      }
    })

    return filtered
  }, [projects, searchTerm, selectedTechs, showFeaturedOnly, sortBy])

  // Update parent component when filtered projects change
  useMemo(() => {
    onFilteredProjects(filteredProjects)
  }, [filteredProjects, onFilteredProjects])

  const toggleTechnology = (tech: string) => {
    setSelectedTechs(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    )
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedTechs([])
    setShowFeaturedOnly(false)
    setSortBy('featured')
  }

  const activeFiltersCount = selectedTechs.length + (showFeaturedOnly ? 1 : 0) + (searchTerm ? 1 : 0)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Controls Bar */}
      <div className="flex flex-col gap-4 items-start justify-between">
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dimmed" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-bg/40 border border-dimmed/20 rounded-xl text-text placeholder-dimmed focus:outline-none focus:border-accent/40 focus:bg-bg/60 transition-all duration-300 backdrop-blur-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dimmed hover:text-text transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`border-dimmed/30 hover:border-accent/40 transition-all duration-300 ${
              activeFiltersCount > 0 ? 'border-accent/40 bg-accent/5' : ''
            }`}
          >
            <Filter size={16} className="mr-2" />
            <span className="hidden xs:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-accent/20 text-accent border-accent/30 text-xs px-2 py-0.5">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 bg-bg/40 border border-dimmed/20 rounded-xl text-text text-sm focus:outline-none focus:border-accent/40 transition-all duration-300 backdrop-blur-sm min-w-0 flex-shrink-0"
          >
            <option value="featured">Featured First</option>
            <option value="title">A-Z</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-dimmed/20 rounded-xl overflow-hidden bg-bg/40 backdrop-blur-sm">
            <button
              onClick={() => {
                setViewMode('grid')
                onViewModeChange?.('grid')
              }}
              className={`p-2 transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-accent/20 text-accent' 
                  : 'text-dimmed hover:text-text hover:bg-bg/60'
              }`}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => {
                setViewMode('list')
                onViewModeChange?.('list')
              }}
              className={`p-2 transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-accent/20 text-accent' 
                  : 'text-dimmed hover:text-text hover:bg-bg/60'
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-bg/40 border border-dimmed/10 rounded-2xl p-6 backdrop-blur-xl space-y-6">
              {/* Featured Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-text font-medium">Show Featured Only</span>
                <button
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    showFeaturedOnly ? 'bg-accent/30' : 'bg-dimmed/20'
                  }`}
                >
                  <motion.div
                    className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${
                      showFeaturedOnly ? 'left-7 bg-accent' : 'left-1 bg-dimmed'
                    }`}
                    layout
                  />
                </button>
              </div>

              {/* Technology Filter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text font-medium">Technologies</span>
                  {selectedTechs.length > 0 && (
                    <button
                      onClick={() => setSelectedTechs([])}
                      className="text-dimmed hover:text-accent text-sm transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTechnologies.map((tech) => (
                    <motion.button
                      key={tech}
                      onClick={() => toggleTechnology(tech)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                        selectedTechs.includes(tech)
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'bg-dimmed/10 text-dimmed border border-dimmed/20 hover:border-accent/30 hover:text-accent'
                      }`}
                    >
                      {tech}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Clear All Filters */}
              {activeFiltersCount > 0 && (
                <div className="pt-4 border-t border-dimmed/10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="border-dimmed/30 text-dimmed hover:text-text hover:border-accent/40"
                  >
                    <X size={16} className="mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-dimmed">
        <span>
          Showing {filteredProjects.length} of {projects.length} projects
        </span>
        {activeFiltersCount > 0 && (
          <span className="text-accent">
            {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
          </span>
        )}
      </div>
    </div>
  )
}