import { NextRequest, NextResponse } from 'next/server'

const BACKEND_BASE_URL = 'http://localhost:31111/api/v1'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const response = await fetch(`${BACKEND_BASE_URL}/blog/posts/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching post from backend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}