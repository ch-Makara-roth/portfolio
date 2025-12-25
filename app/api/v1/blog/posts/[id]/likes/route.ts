import { NextRequest, NextResponse } from 'next/server'
import { updatePostLikes, getPostById } from '@/lib/mockData'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  if (!id) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Blog post ID is required' } },
      { status: 400 }
    )
  }

  const exists = getPostById(id)
  if (!exists) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found' } },
      { status: 404 }
    )
  }

  const result = updatePostLikes(id, true)
  return NextResponse.json({ success: true, data: result, message: 'Blog post liked successfully' })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  if (!id) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Blog post ID is required' } },
      { status: 400 }
    )
  }

  const exists = getPostById(id)
  if (!exists) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found' } },
      { status: 404 }
    )
  }

  const result = updatePostLikes(id, false)
  return NextResponse.json({ success: true, data: result, message: 'Blog post unliked successfully' })
}