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
    if (!dateString) return 'Unknown date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/blogs/${post.slug}`} className="block h-full">
        <article className="bg-bg/50 border border-dimmed/20 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-accent/40 h-full group-hover:bg-bg/60 flex flex-col">
          {post.image && (
            <div className="relative h-40 sm:h-48 overflow-hidden flex-shrink-0">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 288px, 320px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
          <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col">
            <div className="flex items-center gap-3 text-xs text-dimmed flex-shrink-0">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <time dateTime={post.publishedAt || undefined}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{post.readingTime || 5} min read</span>
              </div>
            </div>
            
            <h3 className="font-bold text-text group-hover:text-accent transition-colors duration-300 line-clamp-2 text-base sm:text-lg flex-shrink-0">
              {post.title}
            </h3>
            
            <p className="text-dimmed text-xs sm:text-sm leading-relaxed line-clamp-2 group-hover:text-text/80 transition-colors duration-300 flex-1">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between pt-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                   <span className="text-accent font-semibold text-xs">
                     {post.author.username.charAt(0)}
                   </span>
                 </div>
                <span className="text-dimmed text-xs font-medium truncate">
                   {post.author.username}
                 </span>
              </div>
              
              <div className="flex items-center gap-1 text-accent text-xs font-medium group-hover:gap-2 transition-all duration-300 flex-shrink-0">
                <span>Read</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2 flex-shrink-0">
                {post.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                  <Badge
                    key={tagIndex}
                    variant="secondary"
                    className="text-xs bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30 transition-colors duration-300 px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-dimmed/20 text-dimmed border-dimmed/30 px-2 py-1"
                  >
                    +{post.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
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
            <div className="bg-bg/50 border border-dimmed/20 backdrop-blur-sm rounded-xl overflow-hidden animate-pulse">
              <div className="h-40 sm:h-48 bg-dimmed/30" />
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 bg-dimmed/30 rounded w-16 sm:w-20" />
                  <div className="h-3 bg-dimmed/30 rounded w-12 sm:w-16" />
                </div>
                <div className="h-5 sm:h-6 bg-dimmed/30 rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-dimmed/30 rounded w-full" />
                  <div className="h-3 bg-dimmed/30 rounded w-5/6" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-dimmed/30 rounded-full" />
                    <div className="h-3 bg-dimmed/30 rounded w-16 sm:w-20" />
                  </div>
                  <div className="h-3 bg-dimmed/30 rounded w-12 sm:w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    {/* Scroll indicators for loading state */}
    {/* <div className="absolute left-0 top-0 bottom-0 w-8  pointer-events-none opacity-60" />
    <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none opacity-60" /> */}
  </div>
)

const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="text-dimmed mb-4">
      <Sparkles size={48} className="mx-auto opacity-50" />
    </div>
    <h3 className="text-lg font-semibold text-text mb-2">Unable to load recommendations</h3>
    <p className="text-dimmed text-sm mb-4">
      We're having trouble finding related articles right now.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
      >
        Try again
      </button>
    )}
  </motion.div>
)

export const PostRecommendations = ({ currentPost, className = '' }: PostRecommendationsProps) => {
  const { data: recommendationsData, isLoading, error, refetch } = useRecommendedPosts(currentPost.id, 4)
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
          
          <div className="relative group ">
            {showScrollIndicators && canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute max-sm:hidden left-2 top-1/2 -translate-y-1/2 z-10 bg-bg border border-dimmed/30 rounded-full p-2 shadow-lg hover:bg-accent/10 hover:border-accent/40 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} className="text-text hover:text-accent transition-colors duration-300" />
              </button>
            )}
            
            {showScrollIndicators && canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute max-sm:hidden right-2 top-1/2 -translate-y-1/2 z-10 bg-bg border border-dimmed/30 rounded-full p-2 shadow-lg hover:bg-accent/10 hover:border-accent/40 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} className="text-text hover:text-accent transition-colors duration-300" />
              </button>
            )}
            
            {showScrollIndicators && canScrollLeft && (
              <div className="absolute sm:hidden left-0 top-0 bottom-0 w-8 pointer-events-none z-[5]" />
            )}
            
            {showScrollIndicators && canScrollRight && (
              <div className="absolute sm:hidden right-0 top-0 bottom-0 w-8 pointer-events-none z-[5]" />
            )}
            
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 scroll-smooth"
            >
              <div className="flex gap-4 sm:gap-6 pb-2 min-w-max">
                {recommendations.map((post, index) => (
                  <div key={post.id} className="flex-none w-72 sm:w-80">
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