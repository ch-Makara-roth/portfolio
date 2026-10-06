'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Eye, Heart, MessageCircle, ArrowRight, Sparkles } from 'lucide-react'
import { BlogPost as BlogPostType } from '@/types/blog'
import { cn } from '@/lib/utils'
import { getResponsiveImageUrl } from '@/lib/media'

interface BlogPostProps {
  post: BlogPostType
  viewMode?: 'grid' | 'list'
  className?: string
  isLarge?: boolean
}

// Clean markdown syntax for excerpt previews
function cleanExcerpt(content?: string | null, maxChars = 160): string {
  if (!content) return ''
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_~\[\]()]/g, '')
    .replace(/==([^=]+)==/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, maxChars) + (content.length > maxChars ? '...' : '')
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return 'Recent'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Recent'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function BlogPost({ post, viewMode = 'grid', className = '', isLarge = false }: BlogPostProps) {
  const router = useRouter()

  const handleNavigate = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return
    router.push(`/blogs/${post.slug}`)
  }

  const coverUrl = getResponsiveImageUrl(
    post.coverImageResponsive,
    'desktop',
    post.coverImage || post.image || post.imageUrl
  )

  const authorName = post.author?.name || 
    `${post.author?.firstName || ''} ${post.author?.lastName || ''}`.trim() || 
    post.author?.username || 
    'Chhuon Makara Roth'

  const authorAvatar = post.author?.avatar || '/avatars/default.png'
  const authorInitial = authorName.charAt(0).toUpperCase()
  const readTime = typeof post.readTime === 'string' 
    ? post.readTime 
    : `${post.readingTime || post.readTime || 5} min read`

  const likesCount = post.likes ?? post._count?.likes ?? 0
  const commentsCount = post.commentsCount ?? post._count?.comments ?? 0
  const viewsCount = post.views ?? 0

  /* ─── 1. Large Spotlight Hero Card ─── */
  if (isLarge) {
    return (
      <motion.article
        onClick={handleNavigate}
        className={cn(
          'group relative rounded-2xl overflow-hidden border border-dimmed/15 bg-bg/40 cursor-pointer',
          'md:grid md:grid-cols-12',
          'hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500',
          className
        )}
      >
        {/* Cover Image (7 cols on desktop) */}
        <div className="relative h-64 sm:h-80 md:h-full md:col-span-7 overflow-hidden bg-bg/60">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg via-bg/80 to-accent/10">
              <Sparkles className="w-16 h-16 text-accent/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent md:hidden" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-bg/80 hidden md:block" />

          {/* Spotlight Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest bg-accent/20 border border-accent/40 text-accent px-3 py-1 rounded-full backdrop-blur-md font-bold">
              ★ FEATURED ARTICLE
            </span>
          </div>
        </div>

        {/* Content (5 cols on desktop) */}
        <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-5 md:p-8 lg:p-10 space-y-6">
          <div className="space-y-4">
            {/* Meta header */}
            <div className="flex items-center gap-3 text-xs font-mono text-dimmed">
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-accent/70" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-accent/70" />
                {readTime}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-text leading-tight group-hover:text-accent transition-colors duration-300">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-dimmed leading-relaxed text-sm sm:text-base line-clamp-3">
              {cleanExcerpt(post.excerpt || post.content, 200)}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="pt-4 border-t border-dimmed/10 flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-dimmed/30 bg-bg/80 flex items-center justify-center flex-shrink-0">
                {authorAvatar && authorAvatar !== '/avatars/default.png' ? (
                  <Image
                    src={authorAvatar}
                    alt={authorName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xs font-mono font-bold text-accent">
                    {authorInitial}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text truncate">{authorName}</p>
                <p className="text-[10px] font-mono text-dimmed truncate">{post.author?.title || 'Author'}</p>
              </div>
            </div>

            {/* Read Button */}
            <Link
              href={`/blogs/${post.slug}`}
              className="text-xs font-mono text-accent flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300"
            >
              READ FULL ARTICLE <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </motion.article>
    )
  }

  /* ─── 2. List View Card ─── */
  if (viewMode === 'list') {
    return (
      <motion.article
        onClick={handleNavigate}
        className={cn(
          'group flex flex-col sm:flex-row gap-5 rounded-2xl border border-dimmed/10 bg-bg/40 cursor-pointer p-4 sm:p-5',
          'hover:border-accent/30 hover:bg-bg/60 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300',
          className
        )}
      >
        {/* Cover thumbnail */}
        <div className="relative w-full sm:w-48 sm:h-36 h-44 flex-shrink-0 rounded-xl overflow-hidden bg-bg/60">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, 200px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg via-bg/80 to-accent/5">
              <Sparkles className="w-8 h-8 text-accent/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5 space-y-3">
          <div className="space-y-2">
            {/* Meta */}
            <div className="flex items-center gap-2 text-xs font-mono text-dimmed">
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              <span>·</span>
              <span>{readTime}</span>
              {viewsCount > 0 && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} /> {viewsCount}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-lg sm:text-xl text-text group-hover:text-accent transition-colors duration-300 leading-snug">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-dimmed line-clamp-2 leading-relaxed">
              {cleanExcerpt(post.excerpt || post.content, 140)}
            </p>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-dimmed/10">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {post.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action */}
            <span className="text-xs font-mono text-accent flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
              Read <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </motion.article>
    )
  }

  /* ─── 3. Grid View Card (Default) ─── */
  return (
    <motion.article
      onClick={handleNavigate}
      className={cn(
        'group relative rounded-2xl overflow-hidden border border-dimmed/10 bg-bg/40 cursor-pointer flex flex-col',
        'hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover:bg-bg/50 transition-all duration-500',
        className
      )}
    >
      {/* Cover Image (16:9 ratio) */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden flex-shrink-0 bg-bg/60">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg via-bg/80 to-accent/5">
            <Sparkles className="w-10 h-10 text-accent/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />

        {/* Category / Featured Pill */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {post.tags && post.tags[0] ? (
            <span className="text-[10px] font-mono tracking-wider bg-bg/80 backdrop-blur-md border border-accent/30 text-accent px-2.5 py-1 rounded-full uppercase">
              #{post.tags[0]}
            </span>
          ) : (
            <span className="text-[10px] font-mono tracking-wider bg-bg/80 backdrop-blur-md border border-dimmed/20 text-dimmed px-2.5 py-1 rounded-full uppercase">
              Article
            </span>
          )}
          <span className="text-[10px] font-mono bg-bg/80 backdrop-blur-md border border-dimmed/20 text-dimmed px-2.5 py-1 rounded-full">
            {readTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-4 justify-between">
        <div className="space-y-2.5">
          {/* Published Date */}
          <div className="flex items-center gap-2 text-xs font-mono text-dimmed">
            <Calendar size={12} className="text-accent/70" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg sm:text-xl text-text group-hover:text-accent transition-colors duration-300 leading-snug line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-dimmed leading-relaxed line-clamp-2">
            {cleanExcerpt(post.excerpt || post.content, 130)}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-dimmed/10 space-y-3">
          {/* Author & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-dimmed/30 bg-bg/80 flex items-center justify-center flex-shrink-0">
                {authorAvatar && authorAvatar !== '/avatars/default.png' ? (
                  <Image
                    src={authorAvatar}
                    alt={authorName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-mono font-bold text-accent">
                    {authorInitial}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-dimmed truncate max-w-[120px]">
                {authorName}
              </span>
            </div>

            {/* Engagement Metrics */}
            <div className="flex items-center gap-3 text-xs font-mono text-dimmed">
              {likesCount > 0 && (
                <span className="flex items-center gap-1 text-dimmed group-hover:text-secondary transition-colors">
                  <Heart size={12} className="fill-secondary/20" /> {likesCount}
                </span>
              )}
              {commentsCount > 0 && (
                <span className="flex items-center gap-1">
                  <MessageCircle size={12} /> {commentsCount}
                </span>
              )}
              {viewsCount > 0 && (
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {viewsCount}
                </span>
              )}
            </div>
          </div>

          {/* Read CTA */}
          <div className="flex items-center justify-between text-xs font-mono text-accent pt-1">
            <span className="flex items-center gap-1 group-hover:gap-2 transition-all duration-300 font-semibold">
              READ ARTICLE <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default BlogPost
