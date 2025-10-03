import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/mockData'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const post = getPostBySlug(slug)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ data: post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}