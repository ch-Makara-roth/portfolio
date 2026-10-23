'use client'

import { useQueryClient, useMutation } from '@tanstack/react-query'
import { BlogPost, Comment, CreateCommentRequest } from '@/types/blog'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  MessageCircle,
  Share2,
  User,
  Mail,
  Send,
  Send as Telegram,
  Copy,
  Loader2,
  Check,
  ArrowUp,
  Sparkles,
  ShieldCheck,
  X,
  Code,
  Bold,
  Italic,
  Reply,
  CornerDownRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { FacebookIcon as Facebook, TwitterIcon as Twitter, LinkedinIcon as Linkedin, GithubIcon as Github } from '@/components/icons/BrandIcons'
import Link from 'next/link'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { MarkdownRenderer } from './MarkdownRenderer'
import { PostRecommendations } from './PostRecommendations'
import { TableOfContents } from './TableOfContents'
import { useState, useEffect, useRef, useMemo } from 'react'
import {
  usePost,
  useComments,
  useCreateComment,
  useLikeComment,
  usePostLikeStatus,
  useTrackShare,
  QUERY_KEYS
} from '@/hooks/useBlogQueries'
import { useBlogWebSocket } from '@/hooks/useBlogWebSocket'
import blogApiService from '@/lib/api/blogService'
import { getBrowserFingerprint } from '@/lib/fingerprint'
import { getResponsiveImageUrl } from '@/lib/media'
import { toast } from './ui/toast'

// Helper to format author name if user entered raw email
function formatAuthorDisplay(rawName?: string | null): { displayName: string; handle: string } {
  if (!rawName) return { displayName: 'Anonymous', handle: 'anonymous' }
  const clean = rawName.trim()
  if (clean.includes('@')) {
    const handle = clean.split('@')[0]
    return { displayName: handle, handle: `@${handle}` }
  }
  return { displayName: clean, handle: `@${clean.toLowerCase().replace(/\s+/g, '')}` }
}

// Render comment text with inline code pill styling
function renderCommentContent(text: string) {
  if (!text) return null
  const parts = text.split(/(`[^`]+`)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 mx-0.5 rounded bg-accent/10 border border-accent/25 text-accent font-mono text-xs font-semibold"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function formatCommentDate(dateString?: string) {
  if (!dateString) return 'Just now'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Just now'
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Build nested tree if flat list is returned
function buildCommentTree(rawComments: Comment[]): Comment[] {
  if (!Array.isArray(rawComments)) return []
  
  // If comments already come structured with replies, return them
  const hasPopulatedReplies = rawComments.some(c => Array.isArray(c.replies) && c.replies.length > 0)
  if (hasPopulatedReplies) {
    return rawComments.filter(c => !c.parentId)
  }

  const idMap = new Map<string, Comment>()
  const roots: Comment[] = []

  rawComments.forEach((c) => {
    const id = String(c.id || c._id || '')
    if (id) {
      idMap.set(id, { ...c, replies: [] })
    }
  })

  rawComments.forEach((c) => {
    const id = String(c.id || c._id || '')
    const parentId = c.parentId ? String(c.parentId) : null
    const node = idMap.get(id) || { ...c, replies: [] }

    if (parentId && idMap.has(parentId)) {
      const parent = idMap.get(parentId)!
      parent.replies = parent.replies || []
      if (!parent.replies.some(r => (r.id || r._id) === id)) {
        parent.replies.push(node)
      }
    } else if (!parentId) {
      if (!roots.some(r => (r.id || r._id) === id)) {
        roots.push(node)
      }
    }
  })

  return roots.length > 0 ? roots : rawComments
}

// Subcomponent: CommentItem (with nested reply support)
interface CommentItemProps {
  comment: Comment
  postAuthorName: string
  postIdOrSlug: string
  onReplySubmit: (parentId: string, content: string, name: string, email: string) => Promise<boolean>
  onLikeToggle: (commentId: string) => void
  isSubmittingReply: boolean
  isNested?: boolean
  defaultAuthorName?: string
  defaultAuthorEmail?: string
}

function CommentItem({
  comment,
  postAuthorName,
  postIdOrSlug,
  onReplySubmit,
  onLikeToggle,
  isSubmittingReply,
  isNested = false,
  defaultAuthorName = '',
  defaultAuthorEmail = '',
}: CommentItemProps) {
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [replyName, setReplyName] = useState(defaultAuthorName)
  const [replyEmail, setReplyEmail] = useState(defaultAuthorEmail)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const commentId = String(comment.id || comment._id || '')
  const { displayName, handle } = formatAuthorDisplay(comment.authorName)
  
  // Author verification: check backend isAuthor boolean or match author name
  const isPostAuthor = comment.isAuthor === true || 
    displayName.toLowerCase() === postAuthorName.toLowerCase() || 
    displayName.toLowerCase().includes('makara')

  const likes = comment.likesCount ?? comment.likes ?? 0
  const hasLiked = !!comment.hasLiked

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !replyName.trim() || !replyEmail.trim()) return

    setIsSubmitting(true)
    const success = await onReplySubmit(commentId, replyContent.trim(), replyName.trim(), replyEmail.trim())
    setIsSubmitting(false)

    if (success) {
      setReplyContent('')
      setShowReplyBox(false)
    }
  }

  const handleCopyText = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(comment.content)
        setCopied(true)
        toast.success('Comment copied!')
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl transition-all duration-300 ${
        isNested
          ? 'p-4 sm:p-5 bg-bg/60 border border-dimmed/15 hover:border-accent/30'
          : isPostAuthor
          ? 'p-5 sm:p-6 bg-accent/[0.03] border border-accent/30 hover:border-accent/50 shadow-md shadow-accent/5'
          : 'p-5 sm:p-6 bg-bg/40 border border-dimmed/15 hover:border-accent/30 hover:bg-bg/60 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-sm flex-shrink-0 overflow-hidden ${
              isPostAuthor
                ? 'border-2 border-accent bg-accent/20 text-accent shadow-accent/20 shadow-md'
                : 'border border-accent/40 bg-gradient-to-tr from-accent/20 via-bg to-secondary/20 text-accent'
            }`}
          >
            {comment.authorAvatar ? (
              <Image
                src={comment.authorAvatar}
                alt={displayName}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>

          {/* Author Details */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-bold ${isPostAuthor ? 'text-accent' : 'text-text'}`}>
                {displayName}
              </span>

              {/* Verified Author Badge */}
              {isPostAuthor && (
                <span className="text-[10px] font-mono text-accent bg-accent/15 border border-accent/35 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 shadow-sm">
                  <Check size={10} className="stroke-[3]" />
                  Author
                </span>
              )}

              <span className="text-xs font-mono text-dimmed/60">
                {handle}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-dimmed/70 mt-0.5">
              <Clock size={11} className="text-accent/60" />
              <span>{formatCommentDate(comment.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Moderation Status */}
        {comment.status === 'PENDING' && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/25 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Awaiting Moderation
          </span>
        )}
      </div>

      {/* Content */}
      <div className="pl-0 sm:pl-12 my-3 text-sm text-text/90 leading-relaxed font-mono">
        {renderCommentContent(comment.content)}
      </div>

      {/* Footer Micro-Actions */}
      <div className="pl-0 sm:pl-12 pt-2.5 flex items-center gap-4 text-xs font-mono text-dimmed border-t border-dimmed/10">
        {/* Like Button */}
        <button
          type="button"
          onClick={() => onLikeToggle(commentId)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
            hasLiked
              ? 'border-secondary/40 bg-secondary/15 text-secondary font-semibold'
              : 'border-transparent hover:border-dimmed/20 hover:text-accent hover:bg-accent/5'
          }`}
        >
          <Heart size={13} className={hasLiked ? 'fill-secondary text-secondary' : ''} />
          <span>{likes > 0 ? likes : 'Like'}</span>
        </button>

        {/* Reply Toggle */}
        <button
          type="button"
          onClick={() => setShowReplyBox(prev => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
            showReplyBox
              ? 'border-accent/40 bg-accent/10 text-accent font-semibold'
              : 'border-transparent hover:border-dimmed/20 hover:text-accent hover:bg-accent/5'
          }`}
        >
          <Reply size={13} />
          <span>{showReplyBox ? 'Cancel' : 'Reply'}</span>
        </button>

        {/* Copy Text */}
        <button
          type="button"
          onClick={handleCopyText}
          className="flex items-center gap-1 hover:text-accent transition-colors ml-auto p-1 text-dimmed/60 hover:text-dimmed"
          title="Copy comment text"
        >
          {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
        </button>
      </div>

      {/* Inline Reply Form */}
      <AnimatePresence>
        {showReplyBox && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSendReply}
            className="pl-0 sm:pl-12 mt-4 pt-3 border-t border-dimmed/15 space-y-3"
          >
            <div className="flex items-center gap-1.5 text-xs font-mono text-accent">
              <CornerDownRight size={13} />
              <span>Replying to @{displayName}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
                placeholder="Your Name *"
                required
                className="w-full px-3 py-1.5 bg-bg/90 border border-dimmed/20 rounded-lg text-text placeholder-dimmed/50 focus:outline-none focus:border-accent/50 text-xs font-mono"
              />
              <input
                type="email"
                value={replyEmail}
                onChange={(e) => setReplyEmail(e.target.value)}
                placeholder="Your Email (kept private) *"
                required
                className="w-full px-3 py-1.5 bg-bg/90 border border-dimmed/20 rounded-lg text-text placeholder-dimmed/50 focus:outline-none focus:border-accent/50 text-xs font-mono"
              />
            </div>

            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Write your reply to @${displayName}...`}
              rows={2}
              maxLength={1000}
              required
              className="w-full p-3 bg-bg/90 border border-dimmed/20 rounded-lg text-text placeholder-dimmed/50 focus:outline-none focus:border-accent/50 text-xs font-mono resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-dimmed/50">
                {replyContent.length} / 1000
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowReplyBox(false)}
                  className="px-3 py-1 text-xs font-mono text-dimmed hover:text-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!replyContent.trim() || !replyName.trim() || !replyEmail.trim() || isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-accent text-black font-mono text-xs font-bold hover:bg-accent/90 disabled:opacity-40 flex items-center gap-1.5 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={12} className="animate-spin text-black" />
                      <span>Replying...</span>
                    </>
                  ) : (
                    <>
                      <span>Post Reply</span>
                      <Send size={11} className="text-black" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Nested Replies Section (Indented Tree) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 pt-2 border-l-2 border-accent/25 pl-3 sm:pl-5 ml-2 sm:ml-4 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id || reply._id}
              comment={reply}
              postAuthorName={postAuthorName}
              postIdOrSlug={postIdOrSlug}
              onReplySubmit={onReplySubmit}
              onLikeToggle={onLikeToggle}
              isSubmittingReply={isSubmittingReply}
              isNested={true}
              defaultAuthorName={defaultAuthorName}
              defaultAuthorEmail={defaultAuthorEmail}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

const BlogPostDetailPage = ({ slug }: { slug: string }) => {
  const queryClient = useQueryClient()
  const [showShareModal, setShowShareModal] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showFloatingActions, setShowFloatingActions] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Comments form state
  const [newComment, setNewComment] = useState('')
  const [commentAuthorName, setCommentAuthorName] = useState('')
  const [commentAuthorEmail, setCommentAuthorEmail] = useState('')

  const commentsSectionRef = useRef<HTMLDivElement>(null)
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null)

  const { data: post, isLoading, error } = usePost(slug)
  const postId = String(post?._id || post?.id || '')

  // 1. WebSocket subscriptions for real-time stats & approved comments
  useBlogWebSocket({ blogId: postId, slug: post?.slug || slug, enabled: !!postId || !!slug })

  // 2. Query reader like status
  const { data: likeStatusData } = usePostLikeStatus(slug || postId, !!(slug || postId))

  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [viewsCount, setViewsCount] = useState<number>(0)

  // 3. Tracking mutations
  const trackShareMutation = useTrackShare()

  // Comments queries and mutations
  const { data: comments = [], isLoading: commentsLoading } = useComments(postId || slug)
  const [pendingComments, setPendingComments] = useState<Comment[]>([])
  const createCommentMutation = useCreateComment()
  const likeCommentMutation = useLikeComment()

  // Remember author credentials in localStorage for convenience
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedName = localStorage.getItem('blog_author_name')
        const savedEmail = localStorage.getItem('blog_author_email')
        if (savedName) setCommentAuthorName(savedName)
        if (savedEmail) setCommentAuthorEmail(savedEmail)
      }
    } catch {}
  }, [])

  // Track unique view on article mount
  const viewTrackedRef = useRef<string | null>(null)
  useEffect(() => {
    if (!slug || viewTrackedRef.current === slug) return
    viewTrackedRef.current = slug

    const fingerprint = getBrowserFingerprint()
    blogApiService.trackView(slug, fingerprint)
      .then((res) => {
        if (res?.success && typeof res?.data?.views === 'number') {
          setViewsCount(res.data.views)
          queryClient.setQueryData(QUERY_KEYS.post(slug), (oldData: any) => {
            if (!oldData) return oldData
            const postData = oldData.data ? oldData.data : oldData
            const updated = { ...postData, views: res.data.views }
            return oldData.data ? { ...oldData, data: updated } : updated
          })
        }
      })
      .catch((err) => {
        console.warn('Failed to track post view:', err)
      })
  }, [slug, queryClient])

  // Scroll Progress & Floating Dock Visibility
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (windowHeight > 0) {
        const currentProgress = (totalScroll / windowHeight) * 100
        setScrollProgress(currentProgress)
      }
      setShowFloatingActions(totalScroll > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (post) {
      const count = post.likes ?? post.likesAggregate?.likeCount ?? post._count?.likes ?? 0
      setLikesCount(count as number)
      if (typeof post.views === 'number' && post.views > 0) {
        setViewsCount((prev) => Math.max(prev, post.views as number))
      }
    }
  }, [post])

  useEffect(() => {
    if (likeStatusData !== undefined) {
      const liked = likeStatusData.hasLiked ?? likeStatusData.liked ?? false
      setIsLiked(liked)
      const count = likeStatusData.likesCount ?? likeStatusData.likes
      if (typeof count === 'number') {
        setLikesCount(count)
      }
    }
  }, [likeStatusData])

  const getPostUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/blogs/${slug}`
    }
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/blogs/${slug}`
  }

  const likeMutation = useMutation({
    mutationFn: (action: 'toggle' | 'like' | 'unlike' = 'toggle') => {
      const target = slug || postId
      const fingerprint = getBrowserFingerprint()
      return blogApiService.likePost(target, action, fingerprint)
    },
    onMutate: async (action = 'toggle') => {
      const previous = { isLiked, likesCount }
      const willBeLiked = action === 'toggle' ? !isLiked : action === 'like'
      setIsLiked(willBeLiked)
      setLikesCount((c) => Math.max(0, c + (willBeLiked ? 1 : -1)))
      return { previous }
    },
    onError: (_err, _action, context) => {
      if (context?.previous) {
        setIsLiked(context.previous.isLiked)
        setLikesCount(context.previous.likesCount)
      }
    },
    onSuccess: (json) => {
      if (json?.data) {
        const hasLiked = json.data.hasLiked ?? json.data.liked ?? false
        const count = json.data.likesCount ?? json.data.likes ?? 0
        setIsLiked(hasLiked)
        setLikesCount(count)
      }
    },
    onSettled: () => {
      if (postId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(postId) })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.likeStatus(postId) })
      }
      if (slug) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(slug) })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.likeStatus(slug) })
      }
    }
  })

  const handleLikeClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if ((!postId && !slug) || likeMutation.isPending) return
    likeMutation.mutate('toggle')
  }

  const triggerShareTracking = () => {
    const target = postId || slug
    if (target) {
      trackShareMutation.mutate(target)
    }
  }

  const handleShareClick = async () => {
    triggerShareTracking()
    const url = getPostUrl()
    const title = post?.title || 'Blog Post'

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out "${title}" by Chhuon Makara Roth`,
          url,
        })
        return
      } catch (err) {
        // Fallback to custom modal if canceled/unsupported
      }
    }
    setShowShareModal(true)
  }

  const shareToFacebook = () => {
    triggerShareTracking()
    const url = encodeURIComponent(getPostUrl())
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=450')
    setShowShareModal(false)
  }

  const shareToTwitter = () => {
    triggerShareTracking()
    const url = encodeURIComponent(getPostUrl())
    const text = encodeURIComponent(`${post?.title} — by @chhuonmakararoth`)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=450')
    setShowShareModal(false)
  }

  const shareToLinkedIn = () => {
    triggerShareTracking()
    const url = encodeURIComponent(getPostUrl())
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=450')
    setShowShareModal(false)
  }

  const shareToTelegram = () => {
    triggerShareTracking()
    const url = encodeURIComponent(getPostUrl())
    const text = encodeURIComponent(post?.title || '')
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'width=600,height=450')
    setShowShareModal(false)
  }

  const copyLink = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    triggerShareTracking()
    const url = getPostUrl()
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
      } else {
        throw new Error('Clipboard API unavailable')
      }
      setCopiedLink(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      try {
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.setAttribute('readonly', '')
        textArea.style.position = 'fixed'
        textArea.style.top = '0'
        textArea.style.left = '0'
        textArea.style.width = '1px'
        textArea.style.height = '1px'
        textArea.style.opacity = '0'
        textArea.style.pointerEvents = 'none'
        document.body.appendChild(textArea)
        textArea.select()
        textArea.setSelectionRange(0, textArea.value.length)
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopiedLink(true)
        toast.success('Link copied to clipboard!')
        setTimeout(() => setCopiedLink(false), 2000)
      } catch (err) {
        toast.error('Failed to copy link.')
      }
    }
  }

  const scrollToComments = () => {
    commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Formatting helpers for comment editor
  const insertFormatting = (prefix: string, suffix = prefix) => {
    const textarea = commentTextareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = newComment.substring(start, end) || 'text'
    const updated = newComment.substring(0, start) + prefix + selected + suffix + newComment.substring(end)
    setNewComment(updated)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length)
    }, 0)
  }

  // Handle Comment Like toggle via backend endpoint
  const handleCommentLikeToggle = (commentId: string) => {
    const targetBlogId = postId || slug
    likeCommentMutation.mutate({
      idOrSlug: targetBlogId,
      commentId,
      action: 'toggle',
    })
  }

  // Handle Main Comment submit
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !commentAuthorName.trim() || !commentAuthorEmail.trim() || !post) return

    const targetPostId = postId || slug
    const commentData: CreateCommentRequest = {
      content: newComment.trim(),
      authorName: commentAuthorName.trim(),
      authorEmail: commentAuthorEmail.trim(),
      postId: targetPostId,
      parentId: null,
    }

    // Persist credentials
    try {
      localStorage.setItem('blog_author_name', commentAuthorName.trim())
      localStorage.setItem('blog_author_email', commentAuthorEmail.trim())
    } catch {}

    createCommentMutation.mutate(
      { postId: targetPostId, comment: commentData },
      {
        onSuccess: (res: any) => {
          setNewComment('')
          if (res?.data) {
            setPendingComments((prev) => [res.data, ...prev])
          }
          toast.success('Your comment has been submitted and is awaiting moderation.')
        },
        onError: () => {
          toast.error('Failed to submit comment. Please try again.')
        }
      }
    )
  }

  // Handle Inline Reply submit
  const handleReplySubmit = async (parentId: string, content: string, name: string, email: string): Promise<boolean> => {
    const targetPostId = postId || slug
    const commentData: CreateCommentRequest = {
      content,
      authorName: name,
      authorEmail: email,
      postId: targetPostId,
      parentId,
    }

    try {
      localStorage.setItem('blog_author_name', name)
      localStorage.setItem('blog_author_email', email)
    } catch {}

    try {
      const res: any = await createCommentMutation.mutateAsync({ postId: targetPostId, comment: commentData })
      if (res?.data) {
        setPendingComments((prev) => [...prev, res.data])
      }
      toast.success('Your reply has been submitted and is awaiting moderation.')
      return true
    } catch {
      toast.error('Failed to submit reply.')
      return false
    }
  }

  const authorName = post?.author?.name || 
    `${post?.author?.firstName || ''} ${post?.author?.lastName || ''}`.trim() || 
    post?.author?.username || 
    'Chhuon Makara Roth'

  const authorTitle = post?.author?.title || 'Full Stack Engineer & Author'
  const authorAvatar = post?.author?.avatar || '/avatars/default.png'
  const authorInitial = authorName.charAt(0).toUpperCase()
  const authorBio = post?.author?.bio || 'Building scalable full-stack web applications, microservices, and elegant developer tools with modern web technologies.'

  const coverUrl = post ? getResponsiveImageUrl(
    post.coverImageResponsive,
    'desktop',
    post.coverImage || post.image || post.imageUrl
  ) : ''

  const readTime = typeof post?.readTime === 'string'
    ? post.readTime
    : `${post?.readingTime || post?.readTime || 5} min read`

  const allComments = useMemo(() => {
    const existingIds = new Set(comments.map((c) => c.id || c._id))
    const uniquePending = pendingComments.filter((p) => !existingIds.has(p.id || p._id))
    return [...uniquePending, ...comments]
  }, [comments, pendingComments])

  const commentTree = buildCommentTree(allComments)
  const commentsCount = (post?.commentsCount ?? post?._count?.comments ?? comments.length) + pendingComments.length

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full mx-auto"
          />
          <p className="text-dimmed text-sm font-mono">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="max-w-md w-full text-center py-16 px-6 bg-bg/40 border border-dimmed/15 rounded-2xl space-y-4">
          <h2 className="text-2xl font-bold text-text">Article Not Found</h2>
          <p className="text-dimmed text-sm">
            {error instanceof Error ? error.message : 'The requested article could not be loaded or does not exist.'}
          </p>
          <Link href="/blogs">
            <Button variant="outline" size="sm" className="border-accent/30 text-accent hover:bg-accent/10">
              <ArrowLeft size={15} className="mr-2" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg relative">
      {/* ─── 0. Reading Progress Bar (Top) ─── */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-secondary to-accent z-[100] origin-left"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-4xl">
        {/* ─── 1. Back Navigation ─── */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link href="/blogs">
            <Button
              variant="ghost"
              size="sm"
              className="text-dimmed hover:text-accent hover:bg-accent/5 font-mono text-xs group transition-all"
            >
              <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Articles
            </Button>
          </Link>
        </motion.div>

        {/* ─── 2. Article Header ─── */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 mb-10"
        >
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-accent bg-accent/10 border border-accent/25 px-3 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-text tracking-tight leading-[1.15]">
            {post.title}
          </h1>

          {/* Author & Publication Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-dimmed/15">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-dimmed/30 bg-bg/80 flex items-center justify-center flex-shrink-0">
                {authorAvatar && authorAvatar !== '/avatars/default.png' ? (
                  <Image
                    src={authorAvatar}
                    alt={authorName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm font-mono font-bold text-accent">
                    {authorInitial}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-text">{authorName}</p>
                <p className="text-xs font-mono text-dimmed">{authorTitle}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono text-dimmed">
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-accent" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-accent" />
                {readTime}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye size={13} className="text-accent" />
                {viewsCount} views
              </span>
            </div>
          </div>

          {/* Cover Image Banner */}
          {coverUrl && (
            <div className="relative w-full h-64 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden border border-dimmed/20 shadow-2xl bg-bg/60">
              <Image
                src={coverUrl}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
              />
            </div>
          )}
        </motion.header>

        {/* ─── 3. Table of Contents & Article Content ─── */}
        <div className="relative">
          <TableOfContents content={post.content || ''} />

          <motion.article
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-14"
          >
            <MarkdownRenderer content={post.content || ''} />
          </motion.article>
        </div>

        {/* ─── 4. Article Footer & Author Bio Box ─── */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-dimmed/15 pt-10 space-y-8"
        >
          {/* Author Bio Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-dimmed/15 bg-bg/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent/40 bg-bg/80 flex items-center justify-center flex-shrink-0">
              {authorAvatar && authorAvatar !== '/avatars/default.png' ? (
                <Image
                  src={authorAvatar}
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-xl font-mono font-bold text-accent">
                  {authorInitial}
                </span>
              )}
            </div>
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-text">{authorName}</h4>
                  <p className="text-xs font-mono text-dimmed">{authorTitle}</p>
                </div>
                {/* Social links */}
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/makararoth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-dimmed/20 text-dimmed hover:text-accent hover:border-accent/40 transition-colors"
                  >
                    <Github size={14} />
                  </a>
                  <a
                    href="https://linkedin.com/in/makararoth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-dimmed/20 text-dimmed hover:text-accent hover:border-accent/40 transition-colors"
                  >
                    <Linkedin size={14} />
                  </a>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-dimmed leading-relaxed">
                {authorBio}
              </p>
            </div>
          </div>

          {/* Interaction Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-dimmed/15 bg-bg/40">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLikeClick}
                className={`font-mono text-xs transition-all duration-300 ${
                  isLiked
                    ? 'border-secondary/50 bg-secondary/15 text-secondary'
                    : 'border-dimmed/25 text-dimmed hover:border-secondary/40 hover:text-secondary'
                }`}
              >
                <Heart size={14} className={`mr-2 ${isLiked ? 'fill-current' : ''}`} />
                <span>{isLiked ? 'Liked' : 'Like'}</span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-bg/60 text-[10px]">
                  {likesCount}
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={scrollToComments}
                className="border-dimmed/25 text-dimmed hover:border-accent/40 hover:text-accent font-mono text-xs"
              >
                <MessageCircle size={14} className="mr-2" />
                <span>Comments</span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-bg/60 text-[10px]">
                  {commentsCount}
                </span>
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShareClick}
              className="border-dimmed/25 text-dimmed hover:border-accent/40 hover:text-accent font-mono text-xs"
            >
              <Share2 size={14} className="mr-2" />
              <span>Share Article</span>
            </Button>
          </div>
        </motion.footer>

        {/* ─── 5. Upgraded Discussion & Comments Section ─── */}
        <section ref={commentsSectionRef} className="mt-16 pt-12 border-t border-dimmed/15 space-y-8">
          
          {/* Discussion Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dimmed/15">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-accent/10 border border-accent/25 text-accent shadow-sm shadow-accent/10">
                <MessageSquare size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-text">
                    Discussion
                  </h3>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                    {commentsCount} {commentsCount === 1 ? 'thought' : 'thoughts'}
                  </span>
                </div>
                <p className="text-xs font-mono text-dimmed mt-0.5">
                  Share insights, ask questions, or discuss architecture
                </p>
              </div>
            </div>

            {/* AI Verified Badge */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-dimmed bg-bg/60 border border-dimmed/20 px-3.5 py-1.5 rounded-full backdrop-blur-md self-start sm:self-auto">
              <ShieldCheck size={14} className="text-accent" />
              <span>AI Verified & Spam Protected</span>
            </div>
          </div>

          {/* Double-Bezel Main Comment Form */}
          <div className="p-1 rounded-3xl bg-gradient-to-b from-white/[0.08] via-dimmed/10 to-transparent shadow-2xl">
            <form
              onSubmit={handleCommentSubmit}
              className="bg-[#141414]/95 rounded-[calc(1.5rem-2px)] p-6 sm:p-7 space-y-4 backdrop-blur-xl border border-white/[0.04]"
            >
              {/* Form Title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-text">
                    Leave a Comment
                  </h4>
                </div>
              </div>

              {/* Name & Email inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Name */}
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dimmed/60" />
                  <input
                    type="text"
                    value={commentAuthorName}
                    onChange={(e) => setCommentAuthorName(e.target.value)}
                    placeholder="Your Name *"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-bg/80 border border-dimmed/20 rounded-xl text-text placeholder-dimmed/60 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/25 text-xs font-mono transition-all"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dimmed/60" />
                  <input
                    type="email"
                    value={commentAuthorEmail}
                    onChange={(e) => setCommentAuthorEmail(e.target.value)}
                    placeholder="Your Email (kept private) *"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-bg/80 border border-dimmed/20 rounded-xl text-text placeholder-dimmed/60 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/25 text-xs font-mono transition-all"
                  />
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="relative rounded-xl border border-dimmed/20 bg-bg/80 focus-within:border-accent/60 focus-within:ring-1 focus-within:ring-accent/25 transition-all overflow-hidden">
                <textarea
                  ref={commentTextareaRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your perspective or ask a technical question..."
                  rows={3}
                  maxLength={1000}
                  required
                  className="w-full p-4 bg-transparent text-text placeholder-dimmed/60 focus:outline-none text-sm font-mono resize-none leading-relaxed"
                />

                {/* Formatting Quick Toolbar */}
                <div className="flex items-center justify-between px-3 py-2 border-t border-dimmed/10 bg-bg/40 text-[11px] font-mono text-dimmed">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-dimmed/50 mr-1 hidden xs:inline">Format:</span>
                    <button
                      type="button"
                      onClick={() => insertFormatting('`', '`')}
                      className="px-2 py-0.5 rounded hover:bg-accent/10 hover:text-accent border border-dimmed/15 transition-colors flex items-center gap-1"
                      title="Inline Code"
                    >
                      <Code size={11} /> <span>`code`</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      className="px-2 py-0.5 rounded hover:bg-accent/10 hover:text-accent border border-dimmed/15 transition-colors flex items-center gap-1"
                      title="Bold"
                    >
                      <Bold size={11} /> <span>**bold**</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*')}
                      className="px-2 py-0.5 rounded hover:bg-accent/10 hover:text-accent border border-dimmed/15 transition-colors flex items-center gap-1"
                      title="Italic"
                    >
                      <Italic size={11} /> <span>*italic*</span>
                    </button>
                  </div>

                  {/* Character Counter */}
                  <span className="text-[10px] font-mono text-dimmed/60">
                    {newComment.length} / 1000
                  </span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-[11px] font-mono text-dimmed/60">
                  Constructive discussions welcome. Moderated with automated security.
                </p>

                <button
                  type="submit"
                  disabled={!newComment.trim() || !commentAuthorName.trim() || !commentAuthorEmail.trim() || createCommentMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-accent text-black font-mono text-xs font-bold hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 self-end sm:self-auto"
                >
                  {createCommentMutation.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-black" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <span>Post Comment</span>
                      <Send size={13} className="text-black" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Comments List (with Nested Threaded Replies) */}
          <div className="space-y-4 pt-2">
            {commentsLoading ? (
              <div className="py-12 text-center flex items-center justify-center gap-3 text-dimmed text-sm font-mono bg-bg/30 rounded-2xl border border-dimmed/10">
                <Loader2 size={18} className="animate-spin text-accent" />
                <span>Loading discussion thread...</span>
              </div>
            ) : commentTree.length > 0 ? (
              commentTree.map((comment) => (
                <CommentItem
                  key={comment.id || comment._id}
                  comment={comment}
                  postAuthorName={authorName}
                  postIdOrSlug={postId || slug}
                  onReplySubmit={handleReplySubmit}
                  onLikeToggle={handleCommentLikeToggle}
                  isSubmittingReply={createCommentMutation.isPending}
                  defaultAuthorName={commentAuthorName}
                  defaultAuthorEmail={commentAuthorEmail}
                />
              ))
            ) : (
              <div className="text-center py-16 px-6 border border-dashed border-dimmed/20 rounded-2xl bg-bg/20 space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent">
                  <MessageSquare size={20} />
                </div>
                <h4 className="text-base font-bold text-text">No thoughts shared yet</h4>
                <p className="text-xs font-mono text-dimmed max-w-sm mx-auto">
                  Be the first developer to start the discussion on this article!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ─── 6. Recommendations ─── */}
        <PostRecommendations
          currentPost={post}
          className="mt-16 border-t border-dimmed/15 pt-12"
        />
      </div>

      {/* ─── 7. Floating Reader Action Dock ─── */}
      <AnimatePresence>
        {showFloatingActions && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-20 sm:bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1.5 bg-bg/90 backdrop-blur-2xl border border-dimmed/25 rounded-full shadow-2xl"
          >
            {/* Like */}
            <button
              onClick={() => handleLikeClick()}
              aria-label="Like post"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono transition-all ${
                isLiked
                  ? 'bg-secondary/20 text-secondary border border-secondary/30'
                  : 'text-dimmed hover:text-secondary hover:bg-bg/80'
              }`}
            >
              <Heart size={15} className={isLiked ? 'fill-current' : ''} />
              <span>{likesCount}</span>
            </button>

            {/* Comments */}
            <button
              onClick={scrollToComments}
              aria-label="Jump to comments"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono text-dimmed hover:text-accent hover:bg-bg/80 transition-all"
            >
              <MessageCircle size={15} />
              <span>{commentsCount}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShareClick}
              aria-label="Share article"
              className="p-2 rounded-full text-dimmed hover:text-accent hover:bg-bg/80 transition-all"
            >
              <Share2 size={15} />
            </button>

            <div className="w-px h-4 bg-dimmed/20 mx-0.5" />

            {/* Scroll Top */}
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="p-2 rounded-full text-dimmed hover:text-accent hover:bg-bg/80 transition-all"
            >
              <ArrowUp size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 8. Share Modal ─── */}
      <AnimatePresence>
        {showShareModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-bg/98 backdrop-blur-xl border border-dimmed/20 rounded-3xl p-6 z-[75] shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-dimmed/15">
                <div className="flex items-center gap-2">
                  <Share2 size={16} className="text-accent" />
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-text">
                    Share Article
                  </h4>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 rounded-lg text-dimmed hover:text-text transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={shareToTwitter}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-dimmed/15 bg-bg/60 hover:border-accent/40 hover:bg-accent/5 text-dimmed hover:text-text transition-all text-xs font-mono"
                >
                  <Twitter size={16} className="text-blue-400" />
                  <span>Twitter / X</span>
                </button>
                <button
                  onClick={shareToLinkedIn}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-dimmed/15 bg-bg/60 hover:border-accent/40 hover:bg-accent/5 text-dimmed hover:text-text transition-all text-xs font-mono"
                >
                  <Linkedin size={16} className="text-blue-600" />
                  <span>LinkedIn</span>
                </button>
                <button
                  onClick={shareToTelegram}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-dimmed/15 bg-bg/60 hover:border-accent/40 hover:bg-accent/5 text-dimmed hover:text-text transition-all text-xs font-mono"
                >
                  <Telegram size={16} className="text-sky-400" />
                  <span>Telegram</span>
                </button>
                <button
                  onClick={shareToFacebook}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-dimmed/15 bg-bg/60 hover:border-accent/40 hover:bg-accent/5 text-dimmed hover:text-text transition-all text-xs font-mono"
                >
                  <Facebook size={16} className="text-blue-500" />
                  <span>Facebook</span>
                </button>
              </div>

              {/* Copy URL */}
              <div className="pt-2">
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-mono font-semibold transition-all"
                >
                  {copiedLink ? (
                    <>
                      <Check size={14} />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BlogPostDetailPage
