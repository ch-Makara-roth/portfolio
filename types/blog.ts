export interface Author {
  id: string
  username: string
  firstName: string
  lastName: string
  name?: string // For backward compatibility
  avatar: string | null
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  tags: string[]
  imageUrl: string | null
  image?: string | null // For backward compatibility
  readingTime: number | null
  metaTitle: string | null
  metaDescription: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  authorId: string
  author: Author
  likes?: number
  views?: number
  comments?: any[]
  likesAggregate?: {
    likeCount: number
  }
  _count: {
    comments: number
    likes?: number // For backward compatibility
  }
}

export interface BlogPostsResponse {
  success: boolean
  data: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SingleBlogPostResponse {
  success: boolean
  data: BlogPost
}

export interface Comment {
  id: string
  content: string
  authorName: string
  authorEmail: string
  authorUrl?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM'
  createdAt: string
  updatedAt: string
  postId: string
}

export interface CommentsResponse {
  success: boolean
  data: Comment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateCommentRequest {
  content: string
  authorName: string
  authorEmail: string
  authorUrl?: string
  postId: string
}

export interface CreateCommentResponse {
  success: boolean
  data: Comment
}

export interface BlogQueryParams {
  page?: number
  limit?: number
  tags?: string
  search?: string
  sortBy?: 'createdAt' | 'publishedAt' | 'title'
  sortOrder?: 'asc' | 'desc'
}