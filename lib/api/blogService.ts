import { 
  BlogPost, 
  BlogPostsResponse, 
  SingleBlogPostResponse, 
  Comment, 
  CommentsResponse, 
  CreateCommentRequest, 
  CreateCommentResponse, 
  BlogQueryParams 
} from '@/types/blog'

const BASE_URL: string = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || ''

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class BlogApiService {
  private baseUrl: string

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    signal?: AbortSignal
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal,
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status,
          response.statusText
        )
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was cancelled')
      }
      
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getPosts(params: BlogQueryParams = {}, signal?: AbortSignal): Promise<BlogPostsResponse> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })

    const endpoint = `/blog/?${searchParams.toString()}`
    return this.request<BlogPostsResponse>(endpoint, {}, signal)
  }

  async getPost(slug: string, signal?: AbortSignal): Promise<SingleBlogPostResponse> {
    return this.request<SingleBlogPostResponse>(`/blog/posts/${slug}`, {}, signal)
  }

  async getRecommendedPosts(
    currentPostId: string, 
    limit: number = 4, 
    signal?: AbortSignal
  ): Promise<BlogPostsResponse> {
    const params = new URLSearchParams({
      limit: String(limit),
      exclude: currentPostId,
      sortBy: 'publishedAt',
      sortOrder: 'desc'
    })

    return this.request<BlogPostsResponse>(`/blog/?${params.toString()}`, {}, signal)
  }

  async getComments(postId: string, signal?: AbortSignal): Promise<CommentsResponse> {
    return this.request<CommentsResponse>(`/blog/posts/${postId}/comments`, {}, signal)
  }

  async createComment(
    commentData: CreateCommentRequest, 
    signal?: AbortSignal
  ): Promise<CreateCommentResponse> {
    return this.request<CreateCommentResponse>(
      `/blog/posts/${commentData.postId}/comments`,
      {
        method: 'POST',
        body: JSON.stringify(commentData),
      },
      signal
    )
  }

  async likeArticle(
    payload: { article_id: string; action: 'like' | 'unlike'; localStorage_key: string },
    signal?: AbortSignal
  ): Promise<any> {
    return this.request<any>(
      `/blog/likes`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      signal
    )
  }

  async bookmarkPost(postId: string, signal?: AbortSignal): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(
      `/blog/posts/${postId}/bookmark`,
      { method: 'POST' },
      signal
    )
  }

  async unbookmarkPost(postId: string, signal?: AbortSignal): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(
      `/blog/posts/${postId}/bookmark`,
      { method: 'DELETE' },
      signal
    )
  }
}

export const blogApiService = new BlogApiService()
export default blogApiService