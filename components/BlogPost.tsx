'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BlogPost as BlogPostType, Comment, CreateCommentRequest, CommentsResponse, CreateCommentResponse } from '@/types/blog'
import { Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal, Send, User, Facebook, Twitter, Linkedin, Send as Telegram, Copy, Link2, Edit, Trash2, Flag, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/hooks/useBlogQueries'
import blogApiService from '@/lib/api/blogService'
import { isUuid } from '@/lib/utils'

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
  'https://api.chhuonmakararoth.site/api/v1'
// API functions for comments
const fetchComments = async (postId: string): Promise<Comment[]> => {
  const response = await fetch(`${BASE_URL}/blog/posts/${postId}/comments`)
  if (!response.ok) {
    throw new Error('Failed to fetch comments')
  }
  const data: CommentsResponse = await response.json()
  return data.data
}

const createComment = async (commentData: CreateCommentRequest): Promise<Comment> => {
  const response = await fetch(`${BASE_URL}/blog/posts/${commentData.postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentData),
  })
  if (!response.ok) {
    throw new Error('Failed to create comment')
  }
  const data: CreateCommentResponse = await response.json()
  return data.data
}

interface BlogPostProps {
  post: BlogPostType
}

export const BlogPost = ({ post }: BlogPostProps) => {
  const queryClient = useQueryClient()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState<number>(post._count?.likes ?? post.likes ?? 0)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commentAuthorName, setCommentAuthorName] = useState('')
  const [commentAuthorEmail, setCommentAuthorEmail] = useState('')
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

  // Fetch comments from API
  const { data: comments = [], isLoading: commentsLoading, error: commentsError } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => fetchComments(post.id),
    enabled: showComments,
  })

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', post.id] })
      setNewComment('')
      setCommentAuthorName('')
      setCommentAuthorEmail('')
    },
    onError: (error) => {
      console.error('Failed to create comment:', error)
    },
  })

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

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const key = `blog_like_${post.id}`
        const state = localStorage.getItem(key)
        setIsLiked(state === 'liked')
      }
    } catch {}
  }, [post.id])

  useEffect(() => {
    setLikeCount(post._count?.likes ?? post.likes ?? 0)
  }, [post._count?.likes, post.likes])

  const likeMutation = useMutation({
    mutationFn: (action: 'like' | 'unlike') => {
      const key = `blog_like_${post.id}`
      return blogApiService.likeArticle({ article_id: post.id, action, localStorage_key: key })
    },
    onMutate: async (action) => {
      const previous = { isLiked, likeCount }
      setIsLiked(action === 'like')
      setLikeCount((c) => Math.max(0, c + (action === 'like' ? 1 : -1)))
      return { previous }
    },
    onError: (err, _action, context) => {
      if (context?.previous) {
        setIsLiked(context.previous.isLiked)
        setLikeCount(context.previous.likeCount)
      }
    },
    onSuccess: (json, action) => {
      const likes = json?.data?.likes ?? likeCount
      setLikeCount(likes)
      try {
        const key = `blog_like_${post.id}`
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, action === 'like' ? 'liked' : 'unliked')
        }
      } catch {}
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(post.id) })
    }
  })

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
    if (!isUuid(post.id) || likeMutation.isPending) return
    const action: 'like' | 'unlike' = isLiked ? 'unlike' : 'like'
    likeMutation.mutate(action)
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!newComment.trim() || !commentAuthorName.trim() || !commentAuthorEmail.trim()) return

    const commentData: CreateCommentRequest = {
      content: newComment.trim(),
      authorName: commentAuthorName.trim(),
      authorEmail: commentAuthorEmail.trim(),
      postId: post.id,
    }

    createCommentMutation.mutate(commentData)
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
      console.log("url:", url);
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
      .replace(/```[\s\S]*?```/g, '')
      .replace(/[#*`_~\[\]()]/g, '')
      .replace(/\n/g, ' ')
      .trim()
      .substring(0, 200)
  }

  const renderPreviewWithHighlight = (text: string) => {
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    const regex = /==([^=]+?)==/g
    for (;;) {
      const match = regex.exec(text)
      if (!match) break
      const [full, inner] = match
      const start = match.index
      if (start > lastIndex) parts.push(text.slice(lastIndex, start))
      parts.push(<mark key={`m-${start}`}>{inner}</mark>)
      lastIndex = start + full.length
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex))
    return <>{parts}</>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`
    return date.toLocaleDateString()
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
                {isHostAllowed(post.author.avatar || '/avatars/default.png') ? (
                  <Image
                    src={post.author.avatar || '/avatars/default.png'}
                    alt={post.author.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <Image
                    src={post.author.avatar || '/avatars/default.png'}
                    alt={post.author.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                    onError={() => {
                      console.warn('Blocked image host for avatar')
                    }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center items-start space-y-1 sm:space-y-0 sm:space-x-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white text-sm">{post.author.name || `${post.author.firstName} ${post.author.lastName}`}</span>
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
                  {renderPreviewWithHighlight(getPreviewText(post.excerpt || post.content))}
                </p>

                {(post.image || post.imageUrl) && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    {isHostAllowed(post.image || post.imageUrl || '') ? (
                      <Image
                        src={post.image || post.imageUrl || ''}
                        alt={post.title}
                        width={600}
                        height={300}
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Image
                        src={post.image || post.imageUrl || ''}
                        alt={post.title}
                        width={600}
                        height={300}
                        className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                        onError={() => {
                          console.warn('Blocked image host for post image')
                        }}
                      />
                    )}
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
              <span className="text-sm">{post._count?.comments || 0}</span>
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
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={commentAuthorName}
                      onChange={(e) => setCommentAuthorName(e.target.value)}
                      placeholder="Your name"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      required
                    />
                    <input
                      type="email"
                      value={commentAuthorEmail}
                      onChange={(e) => setCommentAuthorEmail(e.target.value)}
                      placeholder="Your email"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
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
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                          rows={2}
                          required
                        />
                        <button
                          type="submit"
                          disabled={!newComment.trim() || !commentAuthorName.trim() || !commentAuthorEmail.trim() || createCommentMutation.isPending}
                          className="absolute bottom-2 right-2 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-colors"
                        >
                          {createCommentMutation.isPending ? (
                            <Loader2 className="h-3 w-3 text-white animate-spin" />
                          ) : (
                            <Send className="h-3 w-3 text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              
              {commentsError && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                  <p className="text-red-400 text-sm">Failed to load comments. Please try again.</p>
                </div>
              )}
              
              {createCommentMutation.error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                  <p className="text-red-400 text-sm">Failed to post comment. Please try again.</p>
                </div>
              )}
              
              <div className="space-y-3">
                {commentsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                    <span className="ml-2 text-gray-400 text-sm">Loading comments...</span>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-800 rounded-lg px-3 py-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-white text-sm font-medium">{comment.authorName}</span>
                            <span className="text-gray-500 text-xs">{formatCommentDate(comment.createdAt)}</span>
                            {comment.status === 'PENDING' && (
                              <span className="text-yellow-400 text-xs bg-yellow-400/10 px-2 py-0.5 rounded">Pending</span>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
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
  const allowedHosts = new Set([
    'via.placeholder.com',
    'github.com',
    'raw.githubusercontent.com',
    'avatars.githubusercontent.com',
    'images.unsplash.com',
    'www.docker.com',
    'blog.nashtechglobal.com',
    'media.geeksforgeeks.org',
    'example.com',
  ])

  const isHostAllowed = (src: string) => {
    if (!src) return false
    if (src.startsWith('/')) return true
    try {
      const url = new URL(src)
      return allowedHosts.has(url.hostname)
    } catch {
      return true
    }
  }
