'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useCallback, useState, useMemo } from 'react'
import { BlogPost as BlogPostComponent } from '@/components/BlogPost'
import { BlogPost, BlogQueryParams } from '@/types/blog'
import { Loader2, ServerCrash, Sparkles, Search, Filter, X, Grid, List, RefreshCw, BookOpen, Tag as TagIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useInfinitePosts, useBlogTags } from '@/hooks/useBlogQueries'

const BlogPostGridSkeleton = () => (
  <div className="rounded-2xl border border-dimmed/10 bg-bg/40 overflow-hidden animate-pulse">
    <div className="h-52 bg-dimmed/15" />
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-3 bg-dimmed/20 rounded w-20" />
      </div>
      <div className="h-6 bg-dimmed/20 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-3.5 bg-dimmed/15 rounded w-full" />
        <div className="h-3.5 bg-dimmed/15 rounded w-4/5" />
      </div>
      <div className="pt-4 border-t border-dimmed/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-dimmed/20" />
          <div className="h-3 bg-dimmed/20 rounded w-20" />
        </div>
        <div className="h-3 bg-dimmed/20 rounded w-16" />
      </div>
    </div>
  </div>
)

const BlogPostListSkeleton = () => (
  <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border border-dimmed/10 bg-bg/40 animate-pulse">
    <div className="w-full sm:w-48 h-40 bg-dimmed/15 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-3 py-1">
      <div className="h-3 bg-dimmed/20 rounded w-24" />
      <div className="h-6 bg-dimmed/20 rounded w-2/3" />
      <div className="h-3.5 bg-dimmed/15 rounded w-full" />
      <div className="h-3.5 bg-dimmed/15 rounded w-4/5" />
      <div className="pt-2 flex items-center justify-between">
        <div className="h-4 bg-dimmed/20 rounded w-24" />
        <div className="h-4 bg-dimmed/20 rounded w-16" />
      </div>
    </div>
  </div>
)

const BlogsPage = () => {
  const [isClient, setIsClient] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'publishedAt' | 'title' | 'createdAt' | 'views' | 'likes'>('publishedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  
  // Dynamic tags from server
  const { data: serverTags = [] } = useBlogTags()

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 400)
    
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  // Build query parameters
  const queryParams = useMemo((): BlogQueryParams => {
    const params: BlogQueryParams = {
      sortBy,
      sortOrder,
    }
    
    if (debouncedSearchQuery.trim()) {
      params.search = debouncedSearchQuery.trim()
    }
    
    if (selectedTags.length > 0) {
      params.tag = selectedTags[0]
      params.tags = selectedTags.join(',')
    }
    
    return params
  }, [debouncedSearchQuery, selectedTags, sortBy, sortOrder])
  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfinitePosts(queryParams)

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
    setSortBy('publishedAt')
    setSortOrder('desc')
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const availableTags = useMemo(() => {
    if (serverTags && serverTags.length > 0) {
      return serverTags.map((t) => t.tag)
    }
    return ['Next.js', 'Architecture', 'TypeScript', 'Backend', 'NestJS', 'DevOps', 'React', 'Security', 'Performance', 'Microservices']
  }, [serverTags])

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Infinite scroll event handler
  const handleScroll = useCallback(() => {
    if (!isClient || isFetchingNextPage || !hasNextPage) return
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.offsetHeight
    
    if (scrollTop + windowHeight >= documentHeight - 300) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isClient])

  useEffect(() => {
    if (!isClient) return
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll, isClient])

  // Flatten all posts across loaded pages
  const allPosts = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page: any) => page.data || [])
  }, [data?.pages])

  const totalPosts = allPosts.length

  // First post gets spotlight treatment if in grid view and no specific search filter is typed
  const spotlightPost = useMemo(() => {
    if (viewMode === 'list' || debouncedSearchQuery || selectedTags.length > 0) return null
    return allPosts.find((p) => p.isFeatured) || allPosts[0] || null
  }, [allPosts, viewMode, debouncedSearchQuery, selectedTags])

  const gridPosts = useMemo(() => {
    if (!spotlightPost) return allPosts
    return allPosts.filter((p) => (p._id || p.id) !== (spotlightPost._id || spotlightPost.id))
  }, [allPosts, spotlightPost])

  const activeFiltersCount = selectedTags.length + (searchQuery ? 1 : 0) + (sortBy !== 'publishedAt' ? 1 : 0)

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28 max-w-6xl">
        
        {/* ─── 1. Header Section ─── */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-accent" />
                <span className="text-xs font-mono text-accent tracking-widest uppercase">
                  Writings & Insights
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-text tracking-tight leading-none">
                Articles & Thoughts.
              </h1>
              <p className="text-dimmed leading-relaxed text-base sm:text-lg">
                Deep dives into full-stack architecture, modern backend systems, frontend performance, and developer workflows. Practical notes from shipping production applications.
              </p>
            </div>

            {/* Stats Counter Box */}
            <div className="flex items-center gap-8 shrink-0 border border-dimmed/10 rounded-2xl px-8 py-5 bg-bg/40 backdrop-blur-md">
              <div className="text-center">
                <p className="text-3xl font-black text-text tabular-nums">
                  {totalPosts > 0 ? totalPosts : '—'}
                </p>
                <p className="text-[10px] font-mono text-dimmed uppercase tracking-widest mt-1">
                  Articles
                </p>
              </div>
              <div className="w-px h-10 bg-dimmed/10" />
              <div className="text-center">
                <p className="text-3xl font-black text-text tabular-nums">
                  {availableTags.length}
                </p>
                <p className="text-[10px] font-mono text-dimmed uppercase tracking-widest mt-1">
                  Topics
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* ─── 2. Search & Controls Bar ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10 pb-8 border-b border-dimmed/10 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-dimmed" />
              <input
                type="text"
                placeholder="Search articles by title, topic, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-bg/40 border border-dimmed/20 rounded-xl text-text placeholder-dimmed focus:outline-none focus:border-accent/40 focus:bg-bg/60 transition-all duration-300 backdrop-blur-sm text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dimmed hover:text-text p-1 transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={`border-dimmed/30 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 ${
                  showFilters || activeFiltersCount > 0 ? 'border-accent/40 bg-accent/10 text-accent' : 'text-dimmed'
                }`}
              >
                <Filter size={15} className="mr-2" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-accent/20 text-accent border-accent/30 text-[10px] px-1.5 py-0.5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-bg/40 border border-dimmed/20 rounded-xl text-text text-xs font-mono focus:outline-none focus:border-accent/40 transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                <option value="publishedAt">Latest First</option>
                <option value="views">Most Viewed</option>
                <option value="likes">Most Liked</option>
                <option value="title">Title (A-Z)</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-dimmed/20 rounded-xl overflow-hidden bg-bg/40 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-accent/20 text-accent' 
                      : 'text-dimmed hover:text-text hover:bg-bg/60'
                  }`}
                  title="Grid View"
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-accent/20 text-accent' 
                      : 'text-dimmed hover:text-text hover:bg-bg/60'
                  }`}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-bg/40 border border-dimmed/15 rounded-2xl p-6 backdrop-blur-xl space-y-5 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TagIcon size={16} className="text-accent" />
                      <span className="text-sm font-mono font-medium text-text">
                        Filter by Topic
                      </span>
                    </div>
                    {selectedTags.length > 0 && (
                      <button
                        onClick={() => setSelectedTags([])}
                        className="text-xs font-mono text-dimmed hover:text-accent transition-colors"
                      >
                        Clear selected ({selectedTags.length})
                      </button>
                    )}
                  </div>

                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag)
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 border ${
                            isSelected
                              ? 'bg-accent/20 text-accent border-accent/40 shadow-sm shadow-accent/10'
                              : 'bg-dimmed/5 text-dimmed border-dimmed/15 hover:border-accent/30 hover:text-text'
                          }`}
                        >
                          #{tag}
                        </button>
                      )
                    })}
                  </div>

                  {/* Reset All */}
                  {activeFiltersCount > 0 && (
                    <div className="pt-4 border-t border-dimmed/10 flex items-center justify-between">
                      <span className="text-xs font-mono text-accent">
                        {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs font-mono text-dimmed hover:text-text"
                      >
                        <X size={14} className="mr-1.5" />
                        Reset all filters
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── 3. Posts Stream / Feed ─── */}
        {status === 'pending' ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlogPostGridSkeleton />
              <BlogPostGridSkeleton />
              <BlogPostGridSkeleton />
              <BlogPostGridSkeleton />
            </div>
          ) : (
            <div className="space-y-4">
              <BlogPostListSkeleton />
              <BlogPostListSkeleton />
              <BlogPostListSkeleton />
            </div>
          )
        ) : status === 'error' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-4 bg-bg/30 border border-dimmed/10 rounded-2xl"
          >
            <ServerCrash className="h-12 w-12 text-red-400 mx-auto mb-4 opacity-80" />
            <h2 className="text-xl font-bold text-text mb-2">Failed to load articles</h2>
            <p className="text-dimmed text-sm mb-6 max-w-md mx-auto">
              {error instanceof Error ? error.message : 'Could not fetch blog posts from the API.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-accent/30 text-accent hover:bg-accent/10"
            >
              <RefreshCw size={14} className="mr-2" />
              Try reloading
            </Button>
          </motion.div>
        ) : allPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 px-4 bg-bg/30 border border-dimmed/10 rounded-2xl space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-dimmed/10 flex items-center justify-center mx-auto text-accent">
              <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-bold text-text">No articles found</h3>
            <p className="text-dimmed text-sm max-w-sm mx-auto">
              No matching posts for your current filters or search terms.
            </p>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-accent hover:bg-accent/10 font-mono text-xs"
              >
                Clear all filters
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Spotlight Banner Card */}
            {spotlightPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <BlogPostComponent post={spotlightPost} isLarge />
              </motion.div>
            )}

            {/* Grid / List Cards */}
            {gridPosts.length > 0 && (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gridPosts.map((post: BlogPost, index: number) => (
                    <motion.div
                      key={post._id || post.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
                    >
                      <BlogPostComponent post={post} viewMode="grid" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {allPosts.map((post: BlogPost, index: number) => (
                    <motion.div
                      key={post._id || post.id || index}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: (index % 6) * 0.05 }}
                    >
                      <BlogPostComponent post={post} viewMode="list" />
                    </motion.div>
                  ))}
                </div>
              )
            )}

            {/* Loading next page indicator */}
            {isFetchingNextPage && (
              <motion.div 
                className="py-8 flex justify-center items-center text-dimmed text-sm font-mono gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                <span>Loading more articles...</span>
              </motion.div>
            )}

            {/* End of posts indicator */}
            {!hasNextPage && allPosts.length > 0 && (
              <div className="py-12 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-dimmed/15 bg-bg/40 text-dimmed text-xs font-mono">
                  <Sparkles size={13} className="text-accent" />
                  <span>You've reached the end of the archive</span>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default BlogsPage
