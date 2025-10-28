'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BlogPost as BlogPostType } from '@/lib/blogApi'
import { Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal, Send, User, Facebook, Twitter, Linkedin, Send as Telegram, Copy, Link2, Edit, Trash2, Flag, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { blogApi, Comment } from '@/lib/blogApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface BlogPostProps {
  post: BlogPostType
}

export const BlogPost = ({ post }: BlogPostProps) => {
  const queryClient = useQueryClient()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commentCount, setCommentCount] = useState(post._count?.comments ?? post.comments ?? 0)

  // Use TanStack Query for comments with real-time updates
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    refetch: refetchComments
  } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => blogApi.getComments(post.id, { page: 1, limit: 10 }),
    enabled: showComments,
    
  })

  const comments = commentsData?.data || []

  // Mutation for creating comments
  const createCommentMutation = useMutation({
    mutationFn: (commentData: { author: string; content: string }) =>
      blogApi.createComment(post.id, commentData),
    onSuccess: (newCommentData) => {
      // Update the comments cache with the new comment
      queryClient.setQueryData(['comments', post.id], (oldData: any) => {
        if (!oldData) return { data: [newCommentData] }
        return {
          ...oldData,
          data: [newCommentData, ...oldData.data]
        }
      })
      
      // Invalidate and refetch to get the latest data from server
      queryClient.invalidateQueries({ queryKey: ['comments', post.id] })
      
      // Update comment count
      setCommentCount(prev => (prev || 0) + 1)
      setNewComment('')
    },
    onError: (error) => {
      console.error('Failed to create comment:', error)
    }
  })
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [isHidden, setIsHidden] = useState(() => {
    // Check localStorage on component initialization
    if (typeof window !== 'undefined') {
      try {
        const hiddenPosts = localStorage.getItem('hiddenPosts')
        const hiddenPostIds = hiddenPosts ? JSON.parse(hiddenPosts) : []
        return hiddenPostIds.includes(post.id)
      } catch (error) {
        console.error('Error reading hidden posts from localStorage:', error)
        return false
      }
    }
    return false
  })
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
      }
    }

    if (showShareMenu || showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showShareMenu, showMoreMenu])

  const getHiddenPosts = (): string[] => {
    try {
      if (typeof window !== 'undefined') {
        const hiddenPosts = localStorage.getItem('hiddenPosts')
        return hiddenPosts ? JSON.parse(hiddenPosts) : []
      }
      return []
    } catch (error) {
      console.error('Error reading hidden posts from localStorage:', error)
      return []
    }
  }

  const saveHiddenPosts = (hiddenPosts: string[]): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hiddenPosts', JSON.stringify(hiddenPosts))
      }
    } catch (error) {
      console.error('Error saving hidden posts to localStorage:', error)
    }
  }

  const addHiddenPost = (postId: string): void => {
    const hiddenPosts = getHiddenPosts()
    if (!hiddenPosts.includes(postId)) {
      hiddenPosts.push(postId)
      saveHiddenPosts(hiddenPosts)
    }
  }

  const removeHiddenPost = (postId: string): void => {
    const hiddenPosts = getHiddenPosts()
    const updatedHiddenPosts = hiddenPosts.filter(id => id !== postId)
    saveHiddenPosts(updatedHiddenPosts)
  }

  // If post is hidden, show a minimal placeholder
  if (isHidden) {
    return (
      <motion.div
        className="p-4 bg-gray-900/10 border border-gray-800/50 rounded-xl mb-4 opacity-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <EyeOff className="h-5 w-5 text-gray-500" />
            <span className="text-gray-500 text-sm">Post hidden</span>
          </div>
          <button
            onClick={() => {
              setIsHidden(false)
              removeHiddenPost(post.id)
            }}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            Show post
          </button>
        </div>
      </motion.div>
    )
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
  }

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowComments(!showComments)
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!newComment.trim() || createCommentMutation.isPending) return

    createCommentMutation.mutate({
      author: 'Anonymous User',
      content: newComment.trim()
    })
  }

  const handleInteraction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMoreMenu(!showMoreMenu)
  }

  const handleEditPost = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Edit post:', post.id)
    setShowMoreMenu(false)
  }

  const handleDeletePost = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this post?')) {
      console.log('Delete post:', post.id)
    }
    setShowMoreMenu(false)
  }

  const handleReportPost = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Report post:', post.id)
    setShowMoreMenu(false)
  }

  const handleHidePost = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsHidden(true)
    addHiddenPost(post.id)
    setShowMoreMenu(false)
    console.log('Post hidden:', post.title)
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowShareMenu(!showShareMenu)
  }

  const getPostUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/blogs/${post.slug}`
    }
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/blogs/${post.slug}`
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
      const text = encodeURIComponent(`${post.title} - Check out this blog post!`)
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
      const text = encodeURIComponent(post.title)
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

  const getPreviewText = (content: string) => {
    return content
      .replace(/[#*`_~\[\]()]/g, '')
      .replace(/\n/g, ' ') 
      .substring(0, 200)
      .trim()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`
    return date.toLocaleDateString()
  }

  const formatCommentDate = (dateString: string) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  return (
    <motion.div
      className="p-4 bg-gray-900/20 border border-gray-800 rounded-xl mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-1">
        <Link href={`/blogs/${post.slug}`} className="block">
          <motion.article
            className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:bg-gray-900/70 transition-colors cursor-pointer"
            whileHover={{ backgroundColor: 'rgba(17, 24, 39, 0.8)' }}
          >
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <Image
                  src={post.author?.avatar || '/avatars/default.png'}
                  alt={post.author?.username || 'Anonymous'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center items-start space-y-1 sm:space-y-0 sm:space-x-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white text-sm">{post.author.name}</span>
                      <span className="text-gray-500 text-sm hidden sm:inline">@{post.author.username}</span>
                      <span className="text-gray-500 text-sm hidden sm:inline">·</span>
                      <span className="text-gray-500 text-sm hidden sm:inline">{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:hidden text-gray-500 text-sm">
                      <span>@{post.author.username}</span>
                      <span>·</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div ref={moreMenuRef} className="relative">
                      <button
                        onClick={handleMoreClick}
                        className="p-1.5 rounded-full hover:bg-gray-800 transition-colors focus:outline-none focus:ring-0"
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </button>
                      
                      {showMoreMenu && (
                        <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 z-10 min-w-[180px]">
                          <div className="space-y-1">
                            <button
                              onClick={handleHidePost}
                              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <EyeOff className="h-4 w-4 text-gray-400" />
                              <span>Hide post</span>
                            </button>
                            
                            <button
                              onClick={handleReportPost}
                              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <Flag className="h-4 w-4 text-orange-400" />
                              <span>Report post</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Post Title */}
                <h2 className="text-white text-lg font-medium mb-2 leading-tight">
                  {post.title}
                </h2>

                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                  {getPreviewText(post.content)}
                  {post.content.length > 200 && '...'}
                </p>

                {post.image && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={600}
                      height={300}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        </Link>

        <motion.div
          className="p-3  px-auto bg-gray-900/30 border border-gray-700 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between max-w-md px-auto mx-auto">
            <button
              onClick={handleCommentClick}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group focus:outline-none focus:ring-0"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <MessageCircle className="h-4 w-4" />
              </div>
              <span className="text-sm">{commentCount || 0}</span>
            </button>

            <button
              onClick={handleInteraction}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group focus:outline-none focus:ring-0"
            >
              <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                <Repeat2 className="h-4 w-4" />
              </div>
              <span className="text-sm">0</span>
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors group focus:outline-none focus:ring-0 ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm">{likeCount}</span>
            </button>

            <div ref={shareMenuRef} className="relative">
              <button
                onClick={handleShareClick}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group focus:outline-none focus:ring-0"
              >
                <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                  <Share className="h-4 w-4" />
                </div>
              </button>
              
              {showShareMenu && (
                <div className="absolute bottom-full right-0 sm:left-0 sm:right-auto mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 z-50 w-[200px] sm:min-w-[200px] sm:w-auto">
                  <div className="space-y-1">
                    <button
                      onClick={shareToFacebook}
                      className="w-full flex items-center space-x-3 px-3 py-3 sm:py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors touch-manipulation"
                    >
                      <Facebook className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span>Share on Facebook</span>
                    </button>
                    
                    <button
                      onClick={shareToTwitter}
                      className="w-full flex items-center space-x-3 px-3 py-3 sm:py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors touch-manipulation"
                    >
                      <Twitter className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <span>Share on X</span>
                    </button>
                    
                    <button
                      onClick={shareToLinkedIn}
                      className="w-full flex items-center space-x-3 px-3 py-3 sm:py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors touch-manipulation"
                    >
                      <Linkedin className="h-4 w-4 text-blue-700 flex-shrink-0" />
                      <span>Share on LinkedIn</span>
                    </button>
                    
                    <button
                      onClick={shareToTelegram}
                      className="w-full flex items-center space-x-3 px-3 py-3 sm:py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors touch-manipulation"
                    >
                      <Telegram className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Share on Telegram</span>
                    </button>
                    
                    <div className="border-t border-gray-700 my-1"></div>
                    
                    <button
                      onClick={copyLink}
                      className="w-full flex items-center space-x-3 px-3 py-3 sm:py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors touch-manipulation"
                    >
                      <Copy className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span>Copy link</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleBookmark}
              className={`flex items-center space-x-2 transition-colors group focus:outline-none focus:ring-0 ${
                isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </div>
            </button>
          </div>

          {showComments && (
            <div className="mt-4 border-t border-gray-800 pt-4" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <textarea
                        value={newComment}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                        rows={2}
                        disabled={createCommentMutation.isPending}
                      />
                      <button
                        type="submit"
                        disabled={!newComment.trim() || createCommentMutation.isPending}
                        className="absolute bottom-2 right-2 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-colors"
                      >
                        <Send className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Loading State */}
              {isLoadingComments && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              )}
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-800 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white text-sm font-medium">{comment.author}</span>
                          <span className="text-gray-500 text-xs">{formatCommentDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
