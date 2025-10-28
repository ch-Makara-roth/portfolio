const BASE_URL = process.env.BASE_URL ?? "http://localhost:3111/api/v1"

export interface BlogPost {
  id: string
  title: string
  content: string
  slug: string
  excerpt: string
  publishedAt: string
  createdAt: string
  updatedAt: string
  authorId: string
  tags: string[]
  readTime: number
  likes: number
  comments: number
  views: number
  image?: string
  author: {
    id: string
    username: string
    firstName: string
    lastName: string
    email: string
    avatar: string | null
  }
  _count: {
    likes: number
    comments: number
  }
}
export interface BlogData {
  success: boolean
  post: BlogPost
  message: string
}
export interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  avatar?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateCommentRequest {
  author: string
  content: string
}

class BlogApiService {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json() as T
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async getAllPosts(params?: {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<BlogPost>> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)

    const url = `${BASE_URL}/blog/?${searchParams.toString()}`
    return this.fetchWithErrorHandling<PaginatedResponse<BlogPost>>(url)
  }

  async getPostBySlug(slug: string): Promise<BlogData> {
    const url = `${BASE_URL}/blog/posts/${slug}`
    return this.fetchWithErrorHandling<BlogData>(url)
  }

  async getPostById(id: string): Promise<BlogPost> {
    const url = `${BASE_URL}/blog/posts/id/${id}`
    return this.fetchWithErrorHandling<BlogPost>(url)
  }

  async getPostsByTag(tagName: string, params?: {
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<BlogPost>> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())

    const url = `${BASE_URL}/blog/tags/${tagName}?${searchParams.toString()}`
    return this.fetchWithErrorHandling<PaginatedResponse<BlogPost>>(url)
  }

  async getComments(blogId: string, params?: {
    page?: number
    limit?: number
    status?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<Comment>> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)

    const url = `${BASE_URL}/blog/posts/${blogId}/comments?${searchParams.toString()}`
    return this.fetchWithErrorHandling<PaginatedResponse<Comment>>(url)
  }

  async createComment(blogId: string, commentData: CreateCommentRequest): Promise<Comment> {
    const url = `${BASE_URL}/blog/posts/${blogId}/comments`
    return this.fetchWithErrorHandling<Comment>(url, {
      method: 'POST',
      body: JSON.stringify(commentData),
    })
  }
}

export const blogApi = new BlogApiService()