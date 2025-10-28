'use client'

import { useQuery } from '@tanstack/react-query'
import { blogApi, BlogPost } from '@/lib/blogApi'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Eye, Heart, MessageCircle, Share2, User, Facebook, Twitter, Linkedin, Send as Telegram, Copy } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import { MarkdownRenderer } from './MarkdownRenderer'
import { PostRecommendations } from './PostRecommendations'
import { useState, useEffect, useRef } from 'react'

async function fetchPost(slug: string): Promise<BlogPost> {
  try {
    const response = await blogApi.getPostBySlug(slug)
    return response.data
  } catch (error) {
    console.error('Failed to fetch post:', error)
    throw new Error('Failed to fetch post')
  }
}

const BlogPostDetailPage = ({ slug }: { slug: string }) => {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchPost(slug),
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
    }

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showShareMenu])

  const getPostUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/blogs/${slug}`
    }
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/blogs/${slug}`
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowShareMenu(!showShareMenu)
  }

  const shareToFacebook = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const url = encodeURIComponent(getPostUrl())
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
      setShowShareMenu(false)
    } catch (error) {
      console.error('Failed to share to Facebook:', error)
    }
  }

  const shareToTwitter = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const url = encodeURIComponent(getPostUrl())
      const text = encodeURIComponent(`${post?.title} - Check out this blog post!`)
      const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
      setShowShareMenu(false)
    } catch (error) {
      console.error('Failed to share to Twitter:', error)
    }
  }

  const shareToLinkedIn = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const url = encodeURIComponent(getPostUrl())
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
      setShowShareMenu(false)
    } catch (error) {
      console.error('Failed to share to LinkedIn:', error)
    }
  }

  const shareToTelegram = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const url = encodeURIComponent(getPostUrl())
      const text = encodeURIComponent(post?.title || '')
      const shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
      setShowShareMenu(false)
    } catch (error) {
      console.error('Failed to share to Telegram:', error)
    }
  }

  const copyLink = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const url = getPostUrl()
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      setShowShareMenu(false)
      console.log('Link copied to clipboard')
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

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
          <h2 className="text-xl sm:text-2xl font-semibold text-text mb-4">
            {error instanceof Error ? 'Error loading post' : 'Post not found'}
          </h2>
          <p className="text-dimmed text-sm sm:text-base mb-4">
            {error instanceof Error ? error.message : 'The requested post could not be found'}
          </p>
          <Link href="/blogs">
            <Button variant="outline">
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Button>
          </Link>
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
                  src={post.author?.avatar || '/avatars/default.png'}
                  alt={post.author?.username || 'Anonymous'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-semibold text-text">{post.author?.firstName + ' ' + post.author?.lastName || 'Anonymous'}</p>
                  <p className="text-sm text-dimmed">@{post.author?.username || 'anonymous'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(post.createdAt || '').toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{post.readTime || '5 min'} read</span>
                </div>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center justify-center gap-6 text-dimmed text-sm">
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{post.views || 0} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={16} />
                <span>{post._count?.likes || post.likes || 0} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{post._count?.comments || post.comments || 0} comments</span> 
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" className="group">
              <Heart size={16} className="mr-2 group-hover:text-red-500 transition-colors" />
              Like
            </Button>
            <div className="relative" ref={shareMenuRef}>
              <Button 
                variant="outline" 
                size="sm" 
                className="group"
                onClick={handleShareClick}
              >
                <Share2 size={16} className="mr-2 group-hover:text-accent transition-colors" />
                Share
              </Button>
              
              {showShareMenu && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 z-10 min-w-[200px]">
                  <div className="space-y-1">
                    <button
                      onClick={shareToFacebook}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <Facebook className="h-4 w-4 text-blue-600" />
                      <span>Share on Facebook</span>
                    </button>
                    
                    <button
                      onClick={shareToTwitter}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <Twitter className="h-4 w-4 text-blue-400" />
                      <span>Share on X</span>
                    </button>
                    
                    <button
                      onClick={shareToLinkedIn}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      <span>Share on LinkedIn</span>
                    </button>
                    
                    <button
                      onClick={shareToTelegram}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <Telegram className="h-4 w-4 text-blue-500" />
                      <span>Share on Telegram</span>
                    </button>
                    
                    <div className="border-t border-gray-700 my-1"></div>
                    
                    <button
                      onClick={copyLink}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <Copy className="h-4 w-4 text-gray-400" />
                      <span>Copy link</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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
            content={post.content || ''} 
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
                src={post.author?.avatar || '/avatars/default.png'}
                alt={post.author?.username || 'Anonymous'}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-text">{post.author?.username || 'Anonymous'}</p>
                <p className="text-sm text-dimmed">Software Developer & Writer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Heart size={16} className="mr-2" />
                Like ({post._count?.likes || post.likes || 0})
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle size={16} className="mr-2" />
                Comment ({post._count?.comments || post.comments || 0})
              </Button>
              <div className="relative" ref={shareMenuRef}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShareClick}
                >
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
                
                {showShareMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 z-10 min-w-[200px]">
                    <div className="space-y-1">
                      <button
                        onClick={shareToFacebook}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <Facebook className="h-4 w-4 text-blue-600" />
                        <span>Share on Facebook</span>
                      </button>
                      
                      <button
                        onClick={shareToTwitter}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <Twitter className="h-4 w-4 text-blue-400" />
                        <span>Share on X</span>
                      </button>
                      
                      <button
                        onClick={shareToLinkedIn}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <Linkedin className="h-4 w-4 text-blue-700" />
                        <span>Share on LinkedIn</span>
                      </button>
                      
                      <button
                        onClick={shareToTelegram}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <Telegram className="h-4 w-4 text-blue-500" />
                        <span>Share on Telegram</span>
                      </button>
                      
                      <div className="border-t border-gray-700 my-1"></div>
                      
                      <button
                        onClick={copyLink}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <Copy className="h-4 w-4 text-gray-400" />
                        <span>Copy link</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.footer>
        
        <PostRecommendations 
          currentPost={post} 
          className="mt-16 border-t border-dimmed/20 pt-16"
        />
      </div>
    </div>
  )
}

export default BlogPostDetailPage
