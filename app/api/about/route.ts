import { NextResponse } from 'next/server'
import { getAboutData } from '@/lib/mockData'

export async function GET() {
  try {
    const aboutData = await getAboutData()

    return NextResponse.json({
      success: true,
      data: aboutData
    })
  } catch (error) {
    console.error('Error fetching about data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch about data'
      },
      { status: 500 }
    )
  }
}