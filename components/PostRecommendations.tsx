'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Calendar, Clock, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import { useRecommendedPosts } from '@/hooks/useBlogQueries'
import { Badge } from './ui/badge'
import { MobileContainer } from './ui/mobile-responsive'
import { getResponsiveImageUrl } from '@/lib/media'

interface PostRecommendationsProps {
  currentPost: BlogPost
  className?: string
}

interface RecommendationCardProps {
  post: BlogPost
  index: number
}

const RecommendationCard = ({ post, index }: RecommendationCardProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Recent'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Recent'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const coverImg = getResponsiveImageUrl(
    post.coverImageResponsive,
    'desktop',
    post.coverImage || post.image || post.imageUrl
  )

  const authorName = post.author?.name || 
    `${post.author?.firstName || ''} ${post.author?.lastName || ''}`.trim() || 
    post.author?.username || 
    'Chhuon Makara Roth'
    
  const authorInitial = authorName.charAt(0).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group h-full"
    >
      <Link href={`/blogs/${post.slug}`} className="block h-full">
        <article className="bg-bg/40 border border-dimmed/15 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 hover:border-accent/40 h-full group-hover:bg-bg/60 flex flex-col">
          {coverImg ? (
            <div className="relative h-40 sm:h-48 overflow-hidden flex-shrink-0 bg-bg/60">
              <Image
                src={coverImg}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 288px, 320px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
            </div>
          ) : (
            <div className="relative h-40 sm:h-48 overflow-hidden flex-shrink-0 bg-gradient-to-br from-bg via-bg/80 to-accent/5 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-accent/30" />
            </div>
          )}
          <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs font-mono text-dimmed flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="text-accent/70" />
                  <time dateTime={post.publishedAt || post.createdAt || undefined}>
                    {formatDate(post.publishedAt || post.createdAt)}
                  </time>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-accent/70" />
                  <span>{typeof post.readTime === 'string' ? post.readTime : `${post.readingTime || post.readTime || 5} min read`}</span>
                </div>
              </div>
              
              <h3 className="font-bold text-text group-hover:text-accent transition-colors duration-300 line-clamp-2 text-base sm:text-lg leading-snug">
                {post.title}
              </h3>
              
              <p className="text-dimmed text-xs sm:text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </div>
            
            <div className="pt-2 border-t border-dimmed/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-bold text-[10px] font-mono">
                      {authorInitial}
                    </span>
                  </div>
                  <span className="text-dimmed text-xs font-mono truncate max-w-[120px]">
                    {authorName}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-accent text-xs font-mono font-medium group-hover:gap-2 transition-all duration-300">
                  <span>Read</span>
                  <ArrowRight size={12} />
                </div>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="text-[10px] font-mono bg-accent/10 text-accent border-accent/20 px-2 py-0.5"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {post.tags.length > 2 && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-mono bg-dimmed/10 text-dimmed border-dimmed/20 px-1.5 py-0.5"
                    >
                      +{post.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

const LoadingSkeleton = () => (
  <div className="relative">
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 scroll-smooth">
      <div className="flex gap-4 sm:gap-6 pb-2 min-w-max">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex-none w-72 sm:w-80">
            <div className="bg-bg/40 border border-dimmed/15 backdrop-blur-sm rounded-2xl overflow-hidden animate-pulse">
              <div className="h-40 sm:h-48 bg-dimmed/15" />
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 bg-dimmed/20 rounded w-16 sm:w-20" />
                  <div className="h-3 bg-dimmed/20 rounded w-12 sm:w-16" />
                </div>
                <div className="h-5 sm:h-6 bg-dimmed/20 rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-dimmed/15 rounded w-full" />
                  <div className="h-3 bg-dimmed/15 rounded w-5/6" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-dimmed/20" />
                    <div className="h-3 bg-dimmed/20 rounded w-16 sm:w-20" />
                  </div>
                  <div className="h-3 bg-dimmed/20 rounded w-12 sm:w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="text-dimmed mb-4">
      <Sparkles size={40} className="mx-auto opacity-50 text-accent" />
    </div>
    <h3 className="text-lg font-semibold text-text mb-2">Unable to load recommendations</h3>
    <p className="text-dimmed text-sm mb-4">
      We're having trouble finding related articles right now.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-accent hover:text-accent/80 text-xs font-mono font-medium transition-colors border border-accent/30 rounded-lg px-3 py-1.5 hover:bg-accent/10"
      >
        Try again
      </button>
    )}
  </motion.div>
)

export const PostRecommendations = ({ currentPost, className = '' }: PostRecommendationsProps) => {
  const postIdOrSlug = currentPost.slug || currentPost._id || currentPost.id
  const { data: recommendationsData, isLoading, error, refetch } = useRecommendedPosts(postIdOrSlug, 4)
  const recommendations = useMemo(() => recommendationsData?.data ?? [], [recommendationsData])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [showScrollIndicators, setShowScrollIndicators] = useState(false)

  const checkScrollability = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    setShowScrollIndicators(scrollWidth > clientWidth)
  }

  useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollability)
      const resizeObserver = new ResizeObserver(checkScrollability)
      resizeObserver.observe(container)
      
      return () => {
        container.removeEventListener('scroll', checkScrollability)
        resizeObserver.disconnect()
      }
    }
  }, [recommendations])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    const targetScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    })
  }

  if (isLoading) {
    return (
      <MobileContainer className={className}>
        <section className="py-8 sm:py-12">
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Sparkles className="text-accent" size={20} />
            <h2 className="text-xl sm:text-2xl font-bold text-text">Related Articles</h2>
          </div>
          <LoadingSkeleton />
        </section>
      </MobileContainer>
    )
  }

  if (error) {
    return (
      <MobileContainer className={className}>
        <section className="py-8 sm:py-12">
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Sparkles className="text-accent" size={20} />
            <h2 className="text-xl sm:text-2xl font-bold text-text">Related Articles</h2>
          </div>
          <ErrorState onRetry={() => refetch()} />
        </section>
      </MobileContainer>
    )
  }

  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <MobileContainer className={className}>
      <section className="py-8 sm:py-12" aria-labelledby="related-articles-heading">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Sparkles className="text-accent" size={20} />
            <h2 id="related-articles-heading" className="text-xl sm:text-2xl font-bold text-text">
              Related Articles
            </h2>
          </div>
          
          <div className="relative group">
            {showScrollIndicators && canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute max-sm:hidden left-2 top-1/2 -translate-y-1/2 z-10 bg-bg/90 border border-dimmed/30 rounded-full p-2.5 shadow-xl hover:bg-accent/10 hover:border-accent/40 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-md"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} className="text-text hover:text-accent transition-colors" />
              </button>
            )}
            
            {showScrollIndicators && canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute max-sm:hidden right-2 top-1/2 -translate-y-1/2 z-10 bg-bg/90 border border-dimmed/30 rounded-full p-2.5 shadow-xl hover:bg-accent/10 hover:border-accent/40 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-md"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} className="text-text hover:text-accent transition-colors" />
              </button>
            )}
            
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 scroll-smooth"
            >
              <div className="flex gap-4 sm:gap-6 pb-2 min-w-max">
                {recommendations.map((post, index) => (
                  <div key={post._id || post.id} className="flex-none w-72 sm:w-80">
                    <RecommendationCard post={post} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </MobileContainer>
  )
}