'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PostWithAuthor } from '@/lib/mockData'
import { Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal, Send, User } from 'lucide-react'
import { useState } from 'react'

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
  avatar?: string
}

interface BlogPostProps {
  post: PostWithAuthor
}

export const BlogPost = ({ post }: BlogPostProps) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [commentCount, setCommentCount] = useState(post._count?.comments || 0)

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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Anonymous User',
      content: newComment.trim(),
      createdAt: new Date().toISOString()
    }

    setComments(prev => [comment, ...prev])
    setCommentCount(prev => prev + 1)
    setNewComment('')
  }

  const handleInteraction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // Extract preview text from content (remove markdown)
  const getPreviewText = (content: string) => {
    return content
      .replace(/[#*`_~\[\]()]/g, '') // Remove markdown characters
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .substring(0, 200) // Limit to 200 characters
      .trim()
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
        {/* Content Card */}
        <Link href={`/blogs/${post.slug}`} className="block">
          <motion.article
            className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:bg-gray-900/70 transition-colors cursor-pointer"
            whileHover={{ backgroundColor: 'rgba(17, 24, 39, 0.8)' }}
          >
            <div className="flex space-x-3">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                <Image
                  src={post.author.avatar || '/avatars/default.png'}
                  alt={post.author.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>

              {/* Post Content */}
              <div className="flex-1 min-w-0">
                {/* Author Info and Actions */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white text-sm">
                      {post.author.username}
                    </span>
                    <span className="text-gray-500 text-sm">
                      @{post.author.username}
                    </span>
                    <span className="text-gray-500 text-sm">·</span>
                    <span className="text-gray-500 text-sm">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handleInteraction}
                      className="p-1.5 rounded-full hover:bg-gray-800 transition-colors focus:outline-none focus:ring-0"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Post Title */}
                <h2 className="text-white text-lg font-medium mb-2 leading-tight">
                  {post.title}
                </h2>

                {/* Post Preview */}
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                  {getPreviewText(post.content)}
                  {post.content.length > 200 && '...'}
                </p>

                {/* Image Thumbnail */}
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

        {/* Engagement Stats Card */}
        <motion.div
          className="p-3 bg-gray-900/30 border border-gray-700 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Engagement Stats */}
          <div className="flex items-center justify-between max-w-md">
            <button
              onClick={handleCommentClick}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group focus:outline-none focus:ring-0"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <MessageCircle className="h-4 w-4" />
              </div>
              <span className="text-sm">{commentCount}</span>
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

            <button
              onClick={handleInteraction}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group focus:outline-none focus:ring-0"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <Share className="h-4 w-4" />
              </div>
            </button>

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

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 border-t border-gray-800 pt-4" onClick={(e) => e.stopPropagation()}>
              {/* Comment Form */}
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
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                        rows={2}
                      />
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="absolute bottom-2 right-2 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-colors"
                      >
                        <Send className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
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
