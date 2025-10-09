'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useEffect, useCallback } from 'react'
import { BlogPost as BlogPostComponent } from '@/components/BlogPost'
import { PostWithAuthor } from '@/lib/mockData'
import { Loader2, ServerCrash } from 'lucide-react'

export type { PostWithAuthor };

async function fetchPosts({ pageParam = 1 }): Promise<{ posts: PostWithAuthor[], nextPage: number | null }> {
  const response = await fetch(`/api/mock-posts?page=${pageParam}&limit=4`)
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  const result = await response.json();
  return {
    posts: result.data,
    nextPage: result.data.length ? pageParam + 1 : null
  };
}

const BlogsPage = () => {
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

  const handleScroll = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) {
      return
    }
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.offsetHeight
    
    // Use a threshold of 100px from bottom for better mobile detection
    const threshold = 100
    const isNearBottom = scrollTop + windowHeight >= documentHeight - threshold
    
    if (isNearBottom) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <ServerCrash className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-400 text-sm">
            {error instanceof Error ? error.message : 'Try reloading'}
          </p>
        </div>
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
            page.posts.map((post: PostWithAuthor, postIndex) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (pageIndex * page.posts.length + postIndex) * 0.1 }}
              >
                <BlogPostComponent post={post} />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Auto Loading Indicator */}
        {isFetchingNextPage && (
          <div className="p-4 border-b border-gray-800 flex justify-center">
            <div className="flex items-center text-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading more posts...
            </div>
          </div>
        )}

        {/* End of posts indicator */}
        {!hasNextPage && data?.pages.some(page => page.posts.length > 0) && (
          <div className="p-4 border-b border-gray-800 flex justify-center">
            <div className="text-gray-500 text-sm">
              You've reached the end of the posts
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogsPage;


