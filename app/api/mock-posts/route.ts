import { NextRequest, NextResponse } from 'next/server'
import { getPaginatedPosts } from '@/lib/mockData'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '2')

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const result = getPaginatedPosts(page, limit)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}