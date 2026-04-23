import { NextRequest, NextResponse } from 'next/server'
import { getPaginatedPosts, getPostBySlug } from '@/lib/mockData'

export const dynamic = 'force-dynamic'

// Map mock data to BlogPost type structure
function mapPostToBlogPost(post: any) {
  return {
    ...post,
    imageUrl: post.image || null,
    readingTime: post.readTime || 5,
    status: 'PUBLISHED' as const,
    metaTitle: post.title || null,
    metaDescription: post.excerpt || null,
    author: {
      ...post.author,
      firstName: post.author.name?.split(' ')[0] || '',
      lastName: post.author.name?.split(' ')[1] || '',
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const slug = searchParams.get('slug')
    const tag = searchParams.get('tags')

    // If slug is provided, return single post
    if (slug) {
      const post = await getPostBySlug(slug)
      
      if (!post) {
        return NextResponse.json(
          { success: false, error: 'Post not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: [mapPostToBlogPost(post)]
      })
    }

    // Otherwise return paginated posts
    const result = await getPaginatedPosts(page, limit, tag || undefined)

    return NextResponse.json({
      success: true,
      data: result.posts.map(mapPostToBlogPost),
      pagination: {
        page: result.metadata.currentPage,
        limit: result.metadata.limit,
        total: result.metadata.total,
        totalPages: result.metadata.totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
