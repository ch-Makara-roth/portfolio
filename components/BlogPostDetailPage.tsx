'use client'

import { useQuery } from '@tanstack/react-query'
import { PostWithAuthor } from './BlogsPage'
import Image from 'next/image'

async function fetchPost(slug: string): Promise<PostWithAuthor> {
  const response = await fetch(`/api/v1/posts/${slug}`)
  if (!response.ok) {
    throw new Error('Failed to fetch post')
  }
  const result = await response.json();
  return result.data;
}

const BlogPostDetailPage = ({ slug }: { slug: string }) => {
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchPost(slug),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-text mb-4">Error loading post</h2>
          <p className="text-dimmed text-sm sm:text-base">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent px-2">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-dimmed">
            <div className="flex items-center space-x-2">
              <Image
                src={post.author.avatar || '/avatars/default.png'}
                alt={post.author.username}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{post.author.username}</span>
            </div>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="prose prose-invert max-w-none mx-auto text-lg leading-relaxed">
          {post.content}
        </div>
      </div>
    </div>
  )
}

export default BlogPostDetailPage
