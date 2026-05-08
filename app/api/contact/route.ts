import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CONTACT_API_URL =
  process.env.CONTACT_API_URL || "http://localhost:3001/api/v1/contact";

// Zod schema for contact form validation
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).trim(),
  email: z.string().email("Invalid email address").max(255),
  subject: z.string().min(1, "Subject is required").max(200).trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000)
    .trim(),
  phone: z.string().max(50).optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  website: z
    .string()
    .url("Invalid website URL")
    .max(500)
    .optional()
    .or(z.literal("")),
  budget: z.string().max(100).optional().or(z.literal("")),
  timeline: z.string().max(100).optional().or(z.literal("")),
  turnstileToken: z.string().min(1, "Security verification is required"),
});

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error("Turnstile secret key is not configured");
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      },
    );

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  website?: string;
  budget?: string;
  timeline?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: result.error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 },
      );
    }

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
      timeline,
    } = result.data;

    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      return NextResponse.json(
        { error: "Security verification failed" },
        { status: 400 },
      );
    }

    // Prepare data for external API
    const contactData: ContactFormData = {
      name,
      email,
      subject,
      message,
    };

    // Add optional fields if provided
    if (phone) contactData.phone = phone;
    if (company) contactData.company = company;
    if (website) contactData.website = website;
    if (budget) contactData.budget = budget;
    if (timeline) contactData.timeline = timeline;

    // Forward to external API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const result = await response.json();

      if (!response.ok) {
        console.error("External API error:", response.status);
        return NextResponse.json(
          { error: "Failed to submit contact form" },
          { status: response.status },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Message sent successfully!",
        data: result,
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timeout. Please try again later." },
          { status: 504 },
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form. Please try again later." },
      { status: 500 },
    );
  }
}
