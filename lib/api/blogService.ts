import { 
  ApiResponse,
  BlogPost, 
  BlogPostsResponse, 
  SingleBlogPostResponse, 
  BlogTagsResponse,
  Comment, 
  CommentsResponse, 
  CreateCommentRequest, 
  CreateCommentResponse, 
  LikeCommentResponse,
  BlogQueryParams,
  LikeResponse,
  LikeStatusResponse,
  TrackViewResponse,
  ShareResponse,
  HealthCheckResponse,
  ContactMessageRequest,
  ContactMessageResponse,
  UploadMediaResponse,
  MediaItem
} from '@/types/blog'
import { getBrowserFingerprint } from '@/lib/fingerprint'

const BASE_URL: string = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:5050/api/v1'

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

export function normalizePost(post: any): BlogPost {
  if (!post) return post
  const id = String(post._id || post.id || '')
  const coverImage = post.coverImage || post.imageUrl || post.image || null
  const commentsCount = typeof post.commentsCount === 'number'
    ? post.commentsCount
    : (post._count?.comments ?? (Array.isArray(post.comments) ? post.comments.length : 0))
  const likes = typeof post.likes === 'number'
    ? post.likes
    : (post._count?.likes ?? (post.likesAggregate?.likeCount ?? 0))

  return {
    ...post,
    id,
    _id: post._id || id,
    coverImage,
    coverImageResponsive: post.coverImageResponsive || null,
    imageUrl: coverImage,
    image: coverImage,
    likes,
    views: post.views ?? 0,
    shares: post.shares ?? 0,
    commentsCount,
    readTime: post.readTime ?? (post.readingTime ? `${post.readingTime} min read` : '5 min read'),
    readingTime: typeof post.readingTime === 'number'
      ? post.readingTime
      : (parseInt(String(post.readTime || '5')) || 5),
    _count: {
      comments: commentsCount,
      likes,
      ...post._count,
    },
    author: {
      ...post.author,
      name: post.author?.name || post.author?.username || `${post.author?.firstName || ''} ${post.author?.lastName || ''}`.trim() || 'Anonymous',
      username: post.author?.username || post.author?.name || 'anonymous',
    }
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
    
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    }

    // Do not set Content-Type if body is FormData
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    const config: RequestInit = {
      ...options,
      headers,
      signal,
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

  /**
   * Health check for system & runtime status
   */
  async checkHealth(signal?: AbortSignal): Promise<HealthCheckResponse> {
    try {
      return await this.request<HealthCheckResponse>('/health', {}, signal)
    } catch {
      // Fallback for root /health or /api/v1/health
      return this.request<HealthCheckResponse>('', {}, signal)
    }
  }

  /**
   * List published blog posts with pagination & filtering
   */
  async getPosts(params: BlogQueryParams = {}, signal?: AbortSignal): Promise<BlogPostsResponse> {
    const searchParams = new URLSearchParams()
    
    if (params.page !== undefined) searchParams.append('page', String(params.page))
    if (params.limit !== undefined) searchParams.append('limit', String(params.limit))
    if (params.status !== undefined) searchParams.append('status', params.status)
    if (params.tag || params.tags) searchParams.append('tag', params.tag || params.tags!)
    if (params.authorId) searchParams.append('authorId', params.authorId)
    if (params.featured !== undefined) searchParams.append('featured', String(params.featured))
    else if (params.isFeatured !== undefined) searchParams.append('featured', String(params.isFeatured))
    if (params.search || params.q) searchParams.append('search', params.search || params.q!)
    
    if (params.sort) {
      searchParams.append('sort', params.sort)
    } else if (params.sortBy) {
      const prefix = params.sortOrder === 'asc' ? '' : '-'
      searchParams.append('sort', `${prefix}${params.sortBy}`)
    }

    if (params.fields) {
      searchParams.append('fields', params.fields)
    }

    const query = searchParams.toString()
    const endpoint = `/blogs${query ? `?${query}` : ''}`
    const response = await this.request<any>(endpoint, {}, signal)

    const rawData = response.data || []
    const data = Array.isArray(rawData) ? rawData.map(normalizePost) : []
    const meta = response.meta || response.pagination || {
      page: params.page || 1,
      limit: params.limit || data.length,
      total: data.length,
      totalPages: 1,
    }

    return {
      success: response.success ?? true,
      message: response.message,
      data,
      meta,
      pagination: meta,
    }
  }

  /**
   * Get single blog post by MongoDB ID or slug
   */
  async getPost(idOrSlug: string, signal?: AbortSignal): Promise<SingleBlogPostResponse> {
    const response = await this.request<any>(`/blogs/${encodeURIComponent(idOrSlug)}`, {}, signal)
    return {
      success: response.success ?? true,
      message: response.message,
      data: normalizePost(response.data),
    }
  }

  /**
   * Get featured blog posts
   */
  async getFeaturedPosts(limit: number = 5, signal?: AbortSignal): Promise<BlogPostsResponse> {
    const response = await this.request<any>(`/blogs/featured?limit=${limit}`, {}, signal)
    const rawData = response.data || []
    const data = Array.isArray(rawData) ? rawData.map(normalizePost) : []
    return {
      success: response.success ?? true,
      message: response.message,
      data,
      meta: { page: 1, limit, total: data.length, totalPages: 1 },
      pagination: { page: 1, limit, total: data.length, totalPages: 1 },
    }
  }

  /**
   * Get trending blog posts
   */
  async getTrendingPosts(limit: number = 5, signal?: AbortSignal): Promise<BlogPostsResponse> {
    const response = await this.request<any>(`/blogs/trending?limit=${limit}`, {}, signal)
    const rawData = response.data || []
    const data = Array.isArray(rawData) ? rawData.map(normalizePost) : []
    return {
      success: response.success ?? true,
      message: response.message,
      data,
      meta: { page: 1, limit, total: data.length, totalPages: 1 },
      pagination: { page: 1, limit, total: data.length, totalPages: 1 },
    }
  }

  /**
   * Get tag cloud with article counts
   */
  async getTags(signal?: AbortSignal): Promise<BlogTagsResponse> {
    return this.request<BlogTagsResponse>('/blogs/tags', {}, signal)
  }

  /**
   * Get related blog posts
   */
  async getRelatedPosts(idOrSlug: string, limit: number = 3, signal?: AbortSignal): Promise<BlogPostsResponse> {
    const response = await this.request<any>(`/blogs/${encodeURIComponent(idOrSlug)}/related?limit=${limit}`, {}, signal)
    const rawData = response.data || []
    const data = Array.isArray(rawData) ? rawData.map(normalizePost) : []
    return {
      success: response.success ?? true,
      message: response.message,
      data,
      meta: { page: 1, limit: data.length, total: data.length, totalPages: 1 },
      pagination: { page: 1, limit: data.length, total: data.length, totalPages: 1 },
    }
  }

  /**
   * Fallback-enabled recommended posts
   */
  async getRecommendedPosts(
    currentPostIdOrSlug: string, 
    limit: number = 4, 
    signal?: AbortSignal
  ): Promise<BlogPostsResponse> {
    try {
      const related = await this.getRelatedPosts(currentPostIdOrSlug, limit, signal)
      if (related.data && related.data.length > 0) {
        return related
      }
    } catch {
      // Fall back to general posts feed if related endpoint fails
    }

    const params = new URLSearchParams({
      limit: String(limit),
      sort: '-publishedAt',
    })

    return this.request<BlogPostsResponse>(`/blogs?${params.toString()}`, {}, signal)
  }

  /**
   * Like / Toggle like on a blog post
   */
  async likePost(
    idOrSlug: string,
    action: 'toggle' | 'like' | 'unlike' = 'toggle',
    fingerprint?: string,
    signal?: AbortSignal
  ): Promise<LikeResponse> {
    const fp = fingerprint || getBrowserFingerprint()
    return this.request<LikeResponse>(
      `/blogs/${encodeURIComponent(idOrSlug)}/like`,
      {
        method: 'POST',
        body: JSON.stringify({ fingerprint: fp, action }),
      },
      signal
    )
  }

  /**
   * Get reader like status for a blog post
   */
  async getLikeStatus(
    idOrSlug: string,
    fingerprint?: string,
    signal?: AbortSignal
  ): Promise<LikeStatusResponse> {
    const fp = fingerprint || getBrowserFingerprint()
    return this.request<LikeStatusResponse>(
      `/blogs/${encodeURIComponent(idOrSlug)}/like-status?fingerprint=${encodeURIComponent(fp)}`,
      {},
      signal
    )
  }

  /**
   * Track unique view count for a blog post
   */
  async trackView(
    idOrSlug: string,
    fingerprint?: string,
    signal?: AbortSignal
  ): Promise<TrackViewResponse> {
    const fp = fingerprint || getBrowserFingerprint()
    return this.request<TrackViewResponse>(
      `/blogs/${encodeURIComponent(idOrSlug)}/view`,
      {
        method: 'POST',
        body: JSON.stringify({ fingerprint: fp }),
      },
      signal
    )
  }

  /**
   * Increment share counter
   */
  async trackShare(
    idOrSlug: string,
    signal?: AbortSignal
  ): Promise<ShareResponse> {
    return this.request<ShareResponse>(
      `/blogs/${encodeURIComponent(idOrSlug)}/share`,
      {
        method: 'POST',
      },
      signal
    )
  }

  /**
   * Get approved comments for a blog post (returns tree structure with replies)
   */
  async getComments(postIdOrSlug: string, signal?: AbortSignal): Promise<CommentsResponse> {
    return this.request<CommentsResponse>(`/blogs/${encodeURIComponent(postIdOrSlug)}/comments?format=tree`, {}, signal)
  }

  /**
   * Submit a comment or reply (supports parentId, awaiting moderation queue)
   */
  async createComment(
    postIdOrData: string | CreateCommentRequest,
    commentData?: { authorName: string; authorEmail: string; content: string; parentId?: string | null; authorUrl?: string },
    signal?: AbortSignal
  ): Promise<CreateCommentResponse> {
    let targetPostId = ''
    let payload: { authorName: string; authorEmail: string; content: string; parentId?: string | null; authorUrl?: string }

    if (typeof postIdOrData === 'string') {
      targetPostId = postIdOrData
      payload = commentData!
    } else {
      targetPostId = postIdOrData.postId || ''
      payload = {
        authorName: postIdOrData.authorName,
        authorEmail: postIdOrData.authorEmail,
        content: postIdOrData.content,
        parentId: postIdOrData.parentId || null,
        authorUrl: postIdOrData.authorUrl,
      }
    }

    return this.request<CreateCommentResponse>(
      `/blogs/${encodeURIComponent(targetPostId)}/comments`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      signal
    )
  }

  /**
   * Like / Toggle like on a comment
   */
  async likeComment(
    idOrSlug: string,
    commentId: string,
    action: 'toggle' | 'like' | 'unlike' = 'toggle',
    fingerprint?: string,
    signal?: AbortSignal
  ): Promise<LikeCommentResponse> {
    const fp = fingerprint || getBrowserFingerprint()
    return this.request<LikeCommentResponse>(
      `/blogs/${encodeURIComponent(idOrSlug)}/comments/${encodeURIComponent(commentId)}/like`,
      {
        method: 'POST',
        body: JSON.stringify({ fingerprint: fp, action }),
      },
      signal
    )
  }

  /**
   * Get interaction like status for a comment
   */
  async getCommentLikeStatus(
    idOrSlug: string,
    commentId: string,
    fingerprint?: string,
    signal?: AbortSignal
  ): Promise<LikeCommentResponse> {
    const fp = fingerprint || getBrowserFingerprint()
    return this.request<LikeCommentResponse>(
      `/blogs/${encodeURIComponent(idOrSlug)}/comments/${encodeURIComponent(commentId)}/like-status?fingerprint=${encodeURIComponent(fp)}`,
      {},
      signal
    )
  }

  /**
   * Delete a comment (admin or author)
   */
  async deleteComment(commentId: string, signal?: AbortSignal): Promise<ApiResponse<{ id: string }>> {
    return this.request<ApiResponse<{ id: string }>>(
      `/comments/${encodeURIComponent(commentId)}`,
      {
        method: 'DELETE',
      },
      signal
    )
  }

  /**
   * Submit contact form message
   */
  async submitContactForm(
    data: ContactMessageRequest,
    signal?: AbortSignal
  ): Promise<ContactMessageResponse> {
    return this.request<ContactMessageResponse>(
      `/forms/contact`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      signal
    )
  }

  /**
   * Upload single image with responsive variants
   */
  async uploadImage(
    file: File | Blob,
    folder: string = 'general',
    alt?: string,
    signal?: AbortSignal
  ): Promise<UploadMediaResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    if (alt) formData.append('alt', alt)

    return this.request<UploadMediaResponse>(
      `/uploads`,
      {
        method: 'POST',
        body: formData,
      },
      signal
    )
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: (File | Blob)[],
    folder: string = 'general',
    signal?: AbortSignal
  ): Promise<ApiResponse<MediaItem[]>> {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    formData.append('folder', folder)

    return this.request<ApiResponse<MediaItem[]>>(
      `/uploads/multiple`,
      {
        method: 'POST',
        body: formData,
      },
      signal
    )
  }

  /**
   * List uploaded media
   */
  async getMediaList(
    params: { page?: number; limit?: number; folder?: string; search?: string } = {},
    signal?: AbortSignal
  ): Promise<ApiResponse<MediaItem[]>> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append('page', String(params.page))
    if (params.limit) searchParams.append('limit', String(params.limit))
    if (params.folder) searchParams.append('folder', params.folder)
    if (params.search) searchParams.append('search', params.search)

    const query = searchParams.toString()
    return this.request<ApiResponse<MediaItem[]>>(`/uploads${query ? `?${query}` : ''}`, {}, signal)
  }

  /**
   * Get media record by ID
   */
  async getMediaById(id: string, signal?: AbortSignal): Promise<ApiResponse<MediaItem>> {
    return this.request<ApiResponse<MediaItem>>(`/uploads/${encodeURIComponent(id)}`, {}, signal)
  }

  /**
   * Backward-compatibility wrapper for like action
   */
  async likeArticle(
    payload: { article_id: string; action: 'like' | 'unlike'; localStorage_key?: string },
    signal?: AbortSignal
  ): Promise<any> {
    return this.likePost(payload.article_id, payload.action, payload.localStorage_key, signal)
  }

  async bookmarkPost(postId: string, signal?: AbortSignal): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(
      `/blogs/${postId}/bookmark`,
      { method: 'POST' },
      signal
    )
  }

  async unbookmarkPost(postId: string, signal?: AbortSignal): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(
      `/blogs/${postId}/bookmark`,
      { method: 'DELETE' },
      signal
    )
  }
}

export const blogApiService = new BlogApiService()
export default blogApiService