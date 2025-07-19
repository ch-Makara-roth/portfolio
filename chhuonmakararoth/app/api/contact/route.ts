import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = contactSchema.parse(body)
    
    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send to third-party service (like EmailJS, Resend, etc.)
    
    // For now, we'll just simulate processing
    console.log('Contact form submission:', validatedData)
    
    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real application, you might want to:
    // - Send an email using services like Resend, SendGrid, or Nodemailer
    // - Store the message in a database
    // - Send notifications to Slack or Discord
    
    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        success: true 
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Invalid form data',
          errors: error.errors,
          success: false 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        message: 'Internal server error',
        success: false 
      },
      { status: 500 }
    )
  }
}

// Handle GET requests (optional)
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Contact API is working',
      methods: ['POST'],
      success: true 
    },
    { status: 200 }
  )
} 