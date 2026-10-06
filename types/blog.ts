export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data: T
  meta?: BlogListMeta
}

export interface Author {
  _id?: string
  id?: string
  name: string
  email?: string
  avatar: string | null
  title?: string
  bio?: string
  website?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
  }
  username?: string // For backward compatibility
  firstName?: string // For backward compatibility
  lastName?: string // For backward compatibility
}

export interface CoverImageResponsive {
  thumbnail?: string
  mobile?: string
  tablet?: string
  desktop?: string
  original?: string
}

export interface BlogPost {
  _id?: string
  id: string
  title: string
  slug: string
  excerpt: string
  content?: string
  coverImage?: string | null
  coverImageResponsive?: CoverImageResponsive | null
  imageUrl?: string | null // For backward compatibility
  image?: string | null // For backward compatibility
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  isFeatured?: boolean
  author: Author
  authorId?: string
  publishedAt: string | null
  likes?: number
  commentsCount?: number
  comments?: Comment[]
  shares?: number
  views?: number
  readTime?: string | number
  readingTime?: number | null // For backward compatibility
  tags: string[]
  createdAt: string
  updatedAt?: string
  metaTitle?: string | null
  metaDescription?: string | null
  likesAggregate?: {
    likeCount: number
  }
  _count?: {
    comments: number
    likes?: number
  }
}

export interface TagCount {
  tag: string
  count: number
}

export interface BlogListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface BlogPostsResponse {
  success: boolean
  message?: string
  data: BlogPost[]
  meta?: BlogListMeta
  pagination?: BlogListMeta // For backward compatibility
}

export interface SingleBlogPostResponse {
  success: boolean
  message?: string
  data: BlogPost
}

export interface BlogTagsResponse {
  success: boolean
  message?: string
  data: TagCount[]
}

export interface Comment {
  _id?: string
  id?: string
  blogId?: string
  blogTitle?: string
  content: string
  authorName: string
  authorEmail?: string
  authorAvatar?: string | null
  authorUrl?: string
  isAuthor?: boolean
  parentId?: string | null
  replies?: Comment[]
  likesCount?: number
  likes?: number
  hasLiked?: boolean
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM'
  createdAt: string
  updatedAt?: string
  postId?: string
}

export interface CommentsResponse {
  success: boolean
  message?: string
  data: Comment[]
  pagination?: BlogListMeta
  meta?: BlogListMeta
}

export interface CreateCommentRequest {
  authorName: string
  authorEmail: string
  content: string
  postId?: string
  parentId?: string | null
  authorUrl?: string
}

export interface CreateCommentResponse {
  success: boolean
  message?: string
  data: Comment
}

export interface LikeCommentResponse {
  success: boolean
  message?: string
  data: {
    hasLiked: boolean
    likesCount: number
  }
}

export interface LikeRequest {
  fingerprint?: string
  action?: 'toggle' | 'like' | 'unlike'
}

export interface LikeResponse {
  success: boolean
  message?: string
  data: {
    hasLiked: boolean
    likes: number
  }
}

export interface LikeStatusResponse {
  success: boolean
  message?: string
  data: {
    hasLiked: boolean
    likes: number
  }
}

export interface TrackViewRequest {
  fingerprint?: string
}

export interface TrackViewResponse {
  success: boolean
  message?: string
  data: {
    views: number
  }
}

export interface ShareResponse {
  success: boolean
  message?: string
  data: {
    shares: number
  }
}

export interface HealthCheckResponse {
  success: boolean
  message?: string
  data: {
    status: string
    runtime?: string
    timestamp: string
    service?: string
  }
}

export interface ContactMessageRequest {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
  company?: string
  website?: string
  budget?: string
  timeline?: string
}

export interface ContactMessageResponse {
  success: boolean
  message?: string
  data: {
    id: string
  }
}

export interface ResponsiveMediaVariant {
  url: string
  width: number
  height: number
}

export interface ResponsiveMediaVariants {
  thumbnail?: ResponsiveMediaVariant
  mobile?: ResponsiveMediaVariant
  tablet?: ResponsiveMediaVariant
  desktop?: ResponsiveMediaVariant
  original?: ResponsiveMediaVariant
}

export interface MediaItem {
  id: string
  url: string
  path: string
  filename: string
  originalName: string
  mimetype: string
  size: number
  width?: number
  height?: number
  folder: string
  alt?: string
  responsive?: ResponsiveMediaVariants
  createdAt: string
}

export interface UploadMediaResponse {
  success: boolean
  message?: string
  data: MediaItem
}

export interface BlogQueryParams {
  page?: number
  limit?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'all'
  tag?: string
  tags?: string
  authorId?: string
  featured?: boolean
  isFeatured?: boolean
  search?: string
  q?: string
  sort?: string
  sortBy?: 'createdAt' | 'publishedAt' | 'title' | 'views' | 'likes'
  sortOrder?: 'asc' | 'desc'
  fields?: 'summary' | string
}

// WebSocket types
export interface WebSocketMessage<T = any> {
  type?: string
  event?: string
  payload?: T
}

export interface PostLikedPayload {
  blogId: string
  likes: number
}

export interface PostViewedPayload {
  blogId: string
  views: number
}

export interface CommentLikedPayload {
  commentId: string
  likesCount: number
  blogId?: string
}

export type WebSocketEventHandler<T = any> = (payload: T) => void