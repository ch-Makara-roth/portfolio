'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useCallback, useState, useMemo } from 'react'
import { BlogPost as BlogPostComponent } from '@/components/BlogPost'
import { BlogPost, BlogQueryParams } from '@/types/blog'
import { Loader2, ServerCrash, Sparkles, TrendingUp, Search, Filter, X, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useInfinitePosts } from '@/hooks/useBlogQueries'

const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  return (...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

const BlogsPage = () => {
  const [isClient, setIsClient] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'publishedAt' | 'title' | 'createdAt'>('publishedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  
  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  // Build query parameters
  const queryParams = useMemo((): BlogQueryParams => {
    const params: BlogQueryParams = {
      sortBy,
      sortOrder
    }
    
    if (debouncedSearchQuery.trim()) {
      params.search = debouncedSearchQuery.trim()
    }
    
    if (selectedTags.length > 0) {
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

  // Clear filters function
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
    setSortBy('publishedAt')
    setSortOrder('desc')
  }

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // Common tags for filtering (you might want to fetch these from the API)
  const commonTags = ['React', 'Next.js', 'TypeScript', 'JavaScript', 'CSS', 'Node.js', 'Web Development', 'Tutorial']

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleScroll = useCallback(() => {
    if (!isClient || isFetchingNextPage || !hasNextPage) {
      return
    }
    
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
    setScrollY(currentScrollY)
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setHeaderVisible(false)
    } else {
      setHeaderVisible(true)
    }
    setLastScrollY(currentScrollY)
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.offsetHeight
    
    const threshold = 100
    const isNearBottom = scrollTop + windowHeight >= documentHeight - threshold
    
    if (isNearBottom) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isClient, lastScrollY])

  const throttledHandleScroll = useMemo(
    () => throttle(handleScroll, 16),
    [handleScroll]
  )

  useEffect(() => {
    if (!isClient) return
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, [throttledHandleScroll, isClient])

  const totalPosts = useMemo(() => 
    data?.pages.reduce((acc: number, page: any) => acc + page.data.length, 0) || 0,
    [data?.pages]
  )

  const headerBackgroundOpacity = useMemo(() => 
    Math.min(0.8 + scrollY * 0.001, 0.95),
    [scrollY]
  )

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-4" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-sm"
          >
            Loading amazing content...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <ServerCrash className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-400 text-sm">
            {error instanceof Error ? error.message : 'Try reloading'}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* Main Content */}
      <div className="max-w-2xl mx-auto border-x max-sm:pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 border-gray-800 min-h-screen">
        {/* Enhanced Header with preserved structure */}
        <div 
          className="sticky top-0 z-[100] bg-black/80 backdrop-blur-md border-b border-gray-800 p-4 mb-4"
          style={{
            background: `rgba(0, 0, 0, ${headerBackgroundOpacity})`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Sparkles className="h-5 w-5 text-blue-400" />
              </motion.div>
              <h1 className="text-xl font-bold">Latest Posts</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              {totalPosts > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>{totalPosts} posts</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-400 hover:text-white"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                  {/* Sort Options */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-400">Sort by:</span>
                    <div className="flex gap-2">
                      {[
                        { value: 'publishedAt', label: 'Date' },
                        { value: 'title', label: 'Title' },
                        { value: 'views', label: 'Views' }
                      ].map(({ value, label }) => (
                        <Button
                          key={value}
                          variant={sortBy === value ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setSortBy(value as any)}
                          className="text-xs"
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="text-xs"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>

                  {/* Tag Filters */}
                  <div className="space-y-2">
                    <span className="text-sm text-gray-400">Filter by tags:</span>
                    <div className="flex flex-wrap gap-2">
                      {commonTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "secondary"}
                          className={`cursor-pointer transition-colors ${
                            selectedTags.includes(tag) 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                          onClick={() => toggleTag(tag)}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(searchQuery || selectedTags.length > 0 || sortBy !== 'publishedAt' || sortOrder !== 'desc') && (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Display */}
          {(searchQuery || selectedTags.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {searchQuery && (
                <Badge variant="outline" className="text-xs">
                  Search: "{searchQuery}"
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="ml-1 h-3 w-3 p-0"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              {selectedTags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className="ml-1 h-3 w-3 p-0"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {data?.pages.map((page: any, pageIndex: number) =>
            page.data.map((post: BlogPost, postIndex: number) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: (pageIndex * page.data.length + postIndex) * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <BlogPostComponent post={post} />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* No Results Message */}
        {data?.pages.every((page: any) => page.data.length === 0) && status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No posts found</h3>
            <p className="text-gray-400 text-sm mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-blue-400 hover:text-blue-300"
            >
              Clear all filters
            </Button>
          </motion.div>
        )}

        {isFetchingNextPage && (
          <motion.div 
            className="p-4 border-b border-gray-800 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center text-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading more posts...
              </motion.span>
            </div>
          </motion.div>
        )}

        {!hasNextPage && data?.pages.some((page: any) => page.data.length > 0) && (
          <motion.div 
            className="p-4 border-b border-gray-800 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="text-gray-500 text-sm flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>You've reached the end of the posts</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default BlogsPage;


