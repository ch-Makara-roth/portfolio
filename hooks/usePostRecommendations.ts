import { useQuery } from '@tanstack/react-query'
import { BlogPost } from '@/types/blog'

interface RecommendationParams {
  currentPost: BlogPost
  limit?: number
}

interface RecommendationResponse {
  recommendations: BlogPost[]
  isLoading: boolean
  error: Error | null
}

async function fetchRecommendations(currentPost: BlogPost, limit: number = 4): Promise<BlogPost[]> {
  const response = await fetch('https://api.chhuonmakararoth.site/api/v1/blog/?page=1&limit=20')
  if (!response.ok) {
    throw new Error('Failed to fetch posts for recommendations')
  }
  
  const result = await response.json()
  const allPosts: BlogPost[] = result.data
  
  const filteredPosts = allPosts.filter(post => post.id !== currentPost.id)
  
  const scoredPosts = filteredPosts.map(post => {
    let score = 0
    
    const currentTags = currentPost.tags || []
    const postTags = post.tags || []
    
    const commonTags = currentTags.filter(tag => 
      postTags.some((postTag: string) => postTag.toLowerCase() === tag.toLowerCase())
    )
    score += commonTags.length * 3
    
    const currentTitle = currentPost.title.toLowerCase()
    const postTitle = post.title.toLowerCase()
    const titleWords = currentTitle.split(' ').filter(word => word.length > 3)
    const titleMatches = titleWords.filter(word => postTitle.includes(word))
    score += titleMatches.length * 2
    
    const currentExcerpt = (currentPost.excerpt || '').toLowerCase()
    const postExcerpt = (post.excerpt || '').toLowerCase()
    const excerptWords = currentExcerpt.split(' ').filter(word => word.length > 4)
    const excerptMatches = excerptWords.filter(word => postExcerpt.includes(word))
    score += excerptMatches.length * 1
    
    if (currentPost.author.id === post.author.id) {
      score += 1
    }

    const currentDate = currentPost.publishedAt ? new Date(currentPost.publishedAt) : new Date()
    const postDate = post.publishedAt ? new Date(post.publishedAt) : new Date()
    const daysDiff = Math.abs((currentDate.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff <= 30) {
      score += 0.5
    }
    
    return { post, score }
  })
  
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post)
}

export function usePostRecommendations({ currentPost, limit = 4 }: RecommendationParams): RecommendationResponse {
  const { data: recommendations = [], isLoading, error } = useQuery({
    queryKey: ['post-recommendations', currentPost.id, limit],
    queryFn: () => fetchRecommendations(currentPost, limit),
    enabled: !!currentPost,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  return {
    recommendations,
    isLoading,
    error: error as Error | null,
  }
}