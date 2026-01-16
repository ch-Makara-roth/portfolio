import { NextRequest, NextResponse } from 'next/server'

const CONTACT_API_URL = process.env.CONTACT_API_URL || 'http://localhost:3001/api/v1/contact'

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.error('Turnstile secret key is not configured')
    return false
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

interface ContactFormData {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      subject,
      message,
      turnstileToken,
      phone,
      company,
      website,
      budget,
      timeline
    } = body

    // Validate required fields
    if (!name || !email || !subject || !message || !turnstileToken) {
      return NextResponse.json(
        { error: 'Name, email, subject, message, and Turnstile token are required' },
        { status: 400 }
      )
    }

    // Validate Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Security verification is required' },
        { status: 400 }
      )
    }

    const isValidToken = await verifyTurnstileToken(turnstileToken)
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Security verification failed' },
        { status: 400 }
      )
    }

    // Prepare data for external API
    const contactData: ContactFormData = {
      name,
      email,
      subject,
      message,
    }

    // Add optional fields if provided
    if (phone) contactData.phone = phone
    if (company) contactData.company = company
    if (website) contactData.website = website
    if (budget) contactData.budget = budget
    if (timeline) contactData.timeline = timeline

    // Forward to external API
    const response = await fetch(CONTACT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('External API error:', result)
      return NextResponse.json(
        { error: result.message || 'Failed to submit contact form' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      data: result
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form. Please try again later.' },
      { status: 500 }
    )
  }
}