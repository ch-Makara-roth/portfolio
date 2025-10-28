'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useCallback, useState, useMemo } from 'react'
import { BlogPost as BlogPostComponent } from '@/components/BlogPost'
import { blogApi, BlogPost } from '@/lib/blogApi'
import { Loader2, ServerCrash, Sparkles } from 'lucide-react'

async function fetchPosts({ pageParam = 1 }): Promise<{ posts: BlogPost[], nextPage: number | null }> {
  try {
    const result = await blogApi.getAllPosts({
      page: pageParam,
      limit: 4,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    
    return {
      posts: result.data,
      nextPage: result.pagination.page < result.pagination.totalPages ? pageParam + 1 : null
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    throw new Error('Failed to fetch posts')
  }
  const result = await response.json();
  return {
    posts: result.data,
    nextPage: result.data.length ? pageParam + 1 : null
  };
}

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
  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })

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
    data?.pages.reduce((acc, page) => acc + page.posts.length, 0) || 0,
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
        {/* Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4">
          <h1 className="text-xl font-bold">Latest Posts</h1>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {data?.pages.map((page, pageIndex) =>
            page.posts.map((post: BlogPost, postIndex) => (
             
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: (pageIndex * page.posts.length + postIndex) * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <BlogPostComponent post={post} />
              </motion.div>
            ))
          )}
        </motion.div>

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

        {!hasNextPage && data?.pages.some((page: any) => page.posts.length > 0) && (
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


