'use client'

import { useQueryClient } from '@tanstack/react-query'
import { BlogPost, CreateCommentRequest } from '@/types/blog'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Eye, Heart, MessageCircle, Share2, User, Send as Telegram, Copy, Loader2, Link as LinkIcon, Check } from 'lucide-react'
import { FacebookIcon as Facebook, TwitterIcon as Twitter, LinkedinIcon as Linkedin } from '@/components/icons/BrandIcons'
import Link from 'next/link'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { MarkdownRenderer } from './MarkdownRenderer'
import { PostRecommendations } from './PostRecommendations'
import { TableOfContents } from './TableOfContents'
import { useState, useEffect, useRef } from 'react'
import { usePost, useComments, useCreateComment } from '@/hooks/useBlogQueries'
import blogApiService from '@/lib/api/blogService'
import { isUuid } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/hooks/useBlogQueries'

const BlogPostDetailPage = ({ slug }: { slug: string }) => {
  const queryClient = useQueryClient()
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commentAuthorName, setCommentAuthorName] = useState('')
  const [commentAuthorEmail, setCommentAuthorEmail] = useState('')
  const shareMenuRef = useRef<HTMLDivElement>(null)

  const { data: post, isLoading, error } = usePost(slug)

  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  // Fetch comments from API
  const { data: comments = [], isLoading: commentsLoading, error: commentsError } = useComments(post?.id || '')

  // Create comment mutation
  const createCommentMutation = useCreateComment()

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

  useEffect(() => {
    if (post) {
      // Get likes from likesAggregate or fallback to likes field
      const likeCount = post.likesAggregate?.likeCount ?? post.likes ?? 0
      setLikesCount(likeCount as number)
    }
  }, [post])

  useEffect(() => {
    try {
      if (post?.id && typeof window !== 'undefined') {
        const key = `blog_like_${post.id}`
        const state = localStorage.getItem(key)
        setIsLiked(state === 'liked')
      }
    } catch {}
  }, [post?.id])

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

  const likeMutation = useMutation({
    mutationFn: (action: 'like' | 'unlike') => {
      const key = post ? `blog_like_${post.id}` : ''
      return blogApiService.likeArticle({ article_id: post!.id, action, localStorage_key: key })
    },
    onMutate: async (action) => {
      const previous = { isLiked, likesCount }
      setIsLiked(action === 'like')
      setLikesCount((c) => Math.max(0, c + (action === 'like' ? 1 : -1)))
      return { previous }
    },
    onError: (_err, _action, context) => {
      if (context?.previous) {
        setIsLiked(context.previous.isLiked)
        setLikesCount(context.previous.likesCount)
      }
    },
    onSuccess: (json, action) => {
      const likes = json?.data?.likes ?? likesCount
      setLikesCount(likes)
      try {
        if (post && typeof window !== 'undefined') {
          const key = `blog_like_${post.id}`
          localStorage.setItem(key, action === 'like' ? 'liked' : 'unliked')
        }
      } catch {}
    },
    onSettled: () => {
      if (post) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(post.id) })
      }
    }
  })

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!post?.id || likeMutation.isPending) return
    if (!isUuid(post.id)) return
    const action: 'like' | 'unlike' = isLiked ? 'unlike' : 'like'
    likeMutation.mutate(action)
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

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowComments(!showComments)
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!newComment.trim() || !commentAuthorName.trim() || !commentAuthorEmail.trim() || !post) return

    const commentData: CreateCommentRequest = {
      content: newComment.trim(),
      authorName: commentAuthorName.trim(),
      authorEmail: commentAuthorEmail.trim(),
      postId: post.id,
    }

    createCommentMutation.mutate({ postId: post.id, comment: commentData })
  }

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-dimmed text-sm">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    console.error('Blog post error:', error)
    console.log('Post data:', post)
    
    return (
      <div className="min-h-screen py-8 max-sm:pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-text mb-2">
                {error ? 'Failed to load article' : 'Post not found'}
              </h2>
              <p className="text-dimmed mb-4">
                {error instanceof Error 
                  ? error.message 
                  : 'The requested article could not be loaded.'}
              </p>
              <p className="text-dimmed text-sm mb-6">
                Slug: {slug}
              </p>
              <Link href="/blogs">
                <Button variant="outline">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Blogs
                </Button>
              </Link>
            </div>
          </motion.article>
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
                  <span>{post.readingTime ? `${post.readingTime} min read` : '5 min read'}</span>
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
              <span>{likesCount} likes</span>
            </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{post._count.comments} comments</span>
              </div>
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
            content={post.content}
            className="prose-headings:scroll-mt-20"
          />
        </motion.article>

        {/* Table of Contents - Fixed Right Side */}
        <TableOfContents content={post.content} />

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
              <Button variant="outline" size="sm" onClick={handleLikeClick} className={isLiked ? 'text-red-500' : ''}>
                <Heart size={16} className="mr-2" />
                Like ({likesCount})
              </Button>
              <Button variant="outline" size="sm" onClick={handleCommentClick}>
                <MessageCircle size={16} className="mr-2" />
                Comment ({post._count.comments})
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
        
        {/* Comments Section */}
        {showComments && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-12 border-t border-dimmed/20 pt-8"
          >
            <h3 className="text-xl font-semibold text-text mb-6">Comments</h3>
            
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={commentAuthorName}
                    onChange={(e) => setCommentAuthorName(e.target.value)}
                    placeholder="Your name"
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                  <input
                    type="email"
                    value={commentAuthorEmail}
                    onChange={(e) => setCommentAuthorEmail(e.target.value)}
                    placeholder="Your email"
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none transition-colors"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || !commentAuthorName.trim() || !commentAuthorEmail.trim() || createCommentMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {createCommentMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post Comment'
                    )}
                  </Button>
                </div>
              </div>
            </form>
            
            {/* Error Messages */}
            {commentsError && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-400">Failed to load comments. Please try again.</p>
              </div>
            )}
            
            {createCommentMutation.error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-400">Failed to post comment. Please try again.</p>
              </div>
            )}
            
            {/* Comments List */}
            <div className="space-y-6">
              {commentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 text-gray-400 animate-spin mr-3" />
                  <span className="text-gray-400">Loading comments...</span>
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-white">{comment.authorName}</h4>
                          <span className="text-sm text-gray-400">{formatCommentDate(comment.createdAt)}</span>
                          {comment.status === 'PENDING' && (
                            <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded">
                              Pending Approval
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </motion.section>
        )}
        
        <PostRecommendations 
          currentPost={post} 
          className="mt-16 border-t border-dimmed/20 pt-16"
        />
      </div>
    </div>
  )
}

export default BlogPostDetailPage
