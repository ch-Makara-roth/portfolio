import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/mockData'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Post slug is required' },
        { status: 400 }
      )
    }

    const post = await getPostBySlug(slug)

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        _count: {
          comments: post.comments || 0,
          likes: post.likes || 0
        }
      }
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}
