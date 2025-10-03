'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BlogPost as BlogPostComponent } from '@/components/BlogPost'
import { Post, User } from '@/../server/generated/prisma'
import { Button } from './ui/button'
import { Loader2, ServerCrash } from 'lucide-react'

export type PostWithAuthor = Post & { author: User; _count: { likes: number; comments: number } };

async function fetchPosts({ pageParam = 1 }): Promise<{ posts: PostWithAuthor[], nextPage: number | null }> {
  const response = await fetch(`/api/mock-posts?page=${pageParam}&limit=2`)
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

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Loader2 className="animate-spin h-8 w-8 sm:h-12 sm:w-12 text-accent" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <ServerCrash className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-text mb-4">Error loading posts</h2>
          <p className="text-dimmed text-sm sm:text-base">
            {error instanceof Error ? error.message : 'An unexpected error occurred.'} Please try again later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent px-2">
            The Dev Diaries
          </h1>
          <p className="text-base sm:text-lg text-dimmed max-w-2xl mx-auto leading-relaxed">
            A curated collection of insights, tutorials, and stories from the world of software development.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {data?.pages.map((page) =>
              page.posts.map((post: PostWithAuthor) => (
                <BlogPostComponent key={post.id} post={post} />
              ))
            )}
          </div>

          {hasNextPage && (
            <div className="text-center mt-8 sm:mt-12">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                className="group"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default BlogsPage;


