'use client'

import { useQuery } from '@tanstack/react-query'
import { PostWithAuthor } from './BlogsPage'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Eye, Heart, MessageCircle, Share2, User } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { MarkdownRenderer } from './MarkdownRenderer'

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
    <div className="min-h-screen py-8 max-sm:pb-20 md:pb-32 px-4 sm:px-6 lg:px-8  sm:py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/blogs">
            <Button variant="ghost" className="group">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Button>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>
            
            {/* Author and Meta Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-dimmed mb-6">
              <div className="flex items-center space-x-3">
                <Image
                  src={post.author.avatar || '/avatars/default.png'}
                  alt={post.author.username}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-semibold text-text">{post.author.username}</p>
                  <p className="text-sm text-dimmed">Author</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center justify-center gap-6 text-dimmed text-sm">
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>1.2k views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={16} />
                <span>{post._count.likes} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{post._count.comments} comments</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" className="group">
              <Heart size={16} className="mr-2 group-hover:text-red-500 transition-colors" />
              Like
            </Button>
            <Button variant="outline" size="sm" className="group">
              <Share2 size={16} className="mr-2 group-hover:text-accent transition-colors" />
              Share
            </Button>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <MarkdownRenderer 
            content={post.content} 
            className="prose-headings:scroll-mt-20"
          />
        </motion.article>

        {/* Article Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-dimmed/20 pt-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={post.author.avatar || '/avatars/default.png'}
                alt={post.author.username}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-text">{post.author.username}</p>
                <p className="text-sm text-dimmed">Software Developer & Writer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Heart size={16} className="mr-2" />
                Like ({post._count.likes})
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle size={16} className="mr-2" />
                Comment ({post._count.comments})
              </Button>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}

export default BlogPostDetailPage
