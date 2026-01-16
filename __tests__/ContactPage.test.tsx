/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ContactPage from '@/components/ContactPage'

jest.mock('@marsidev/react-turnstile', () => ({
  Turnstile: require('react').forwardRef(({ onSuccess }: any, ref: any) => {
    require('react').useImperativeHandle(ref, () => ({
      reset: jest.fn()
    }))
    return (
      <div data-testid="turnstile-widget">
        <button type="button" onClick={() => onSuccess('mock-token')}>Complete Captcha</button>
      </div>
    )
  }),
}))

// Mock fetch
global.fetch = jest.fn()

describe('ContactPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
      ; (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
  })

  it('renders contact form with all fields', () => {
    render(<ContactPage />)

    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Subject')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tell me about your project...')).toBeInTheDocument()
    expect(screen.getByTestId('turnstile-widget')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('displays validation errors for empty required fields', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    // Complete captcha first to enable submit button
    const captchaButton = screen.getByText('Complete Captcha')
    await user.click(captchaButton)

    const submitButton = screen.getByRole('button', { name: /send message/i })

    // Try to submit without filling any fields
    await user.click(submitButton)

    // Wait for validation errors to appear
    await waitFor(() => {
      const errors = screen.getAllByText(/must be at least|please enter a valid/i)
      expect(errors.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it.skip('displays validation error for invalid email format', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    const emailInput = screen.getByPlaceholderText('Your Email')
    await user.type(emailInput, 'invalid-email')

    // Complete captcha to enable submit button
    const captchaButton = screen.getByText('Complete Captcha')
    await user.click(captchaButton)

    // Trigger validation by trying to submit
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    // Wait for any validation error to appear
    await waitFor(() => {
      const errors = screen.getAllByText(/must be at least|please enter a valid/i)
      expect(errors.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it('enables submit button after completing captcha', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    const submitButton = screen.getByRole('button', { name: /send message/i })
    expect(submitButton).toBeDisabled()

    const captchaButton = screen.getByText('Complete Captcha')
    await user.click(captchaButton)

    expect(submitButton).not.toBeDisabled()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    // Fill out form
    await user.type(screen.getByPlaceholderText('Your Name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Your Email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Subject'), 'Test Subject')
    await user.type(screen.getByPlaceholderText('Tell me about your project...'), 'This is a test message with more than 20 characters')

    // Complete captcha
    const captchaButton = screen.getByText('Complete Captcha')
    await user.click(captchaButton)

    // Submit form
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }))
    })

    // Verify the body content separately to avoid key ordering issues
    const fetchCall = (fetch as jest.Mock).mock.calls[0]
    const body = JSON.parse(fetchCall[1].body)
    expect(body).toEqual(expect.objectContaining({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      phone: '',
      company: '',
      website: '',
      budget: '',
      timeline: '',
      message: 'This is a test message with more than 20 characters',
      turnstileToken: 'mock-token',
    }))
  })

  it('displays success message after successful submission', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    // Fill out form and submit
    await user.type(screen.getByPlaceholderText('Your Name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Your Email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Subject'), 'Test Subject')
    await user.type(screen.getByPlaceholderText('Tell me about your project...'), 'This is a test message with more than 20 characters')

    const captchaButton = screen.getByText('Complete Captcha')
    await user.click(captchaButton)

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    })
  })

  it('displays error message when submission fails', async () => {
    const user = userEvent.setup()
    // Suppress expected console.error during this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

      ; (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Server error' }),
      })

    render(<ContactPage />)

    // Fill out form and submit
    await user.type(screen.getByPlaceholderText('Your Name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Your Email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Subject'), 'Test Subject')
    await user.type(screen.getByPlaceholderText('Tell me about your project...'), 'This is a test message with more than 20 characters')

    const captchaButton = screen.getByText('Complete Captcha')
    await user.click(captchaButton)

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it('resets form after successful submission', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    const nameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement
    const emailInput = screen.getByPlaceholderText('Your Email') as HTMLInputElement
    const subjectInput = screen.getByPlaceholderText('Subject') as HTMLInputElement
    const messageInput = screen.getByPlaceholderText('Tell me about your project...') as HTMLTextAreaElement

    // Fill out form
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(subjectInput, 'Test Subject')
    await user.type(messageInput, 'This is a test message with more than 20 characters')

    const captchaButton = screen.getByText('Complete Captcha')
    await user.click(captchaButton)

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    // Re-query inputs after reset to get updated values
    await waitFor(() => {
      const updatedNameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement
      const updatedEmailInput = screen.getByPlaceholderText('Your Email') as HTMLInputElement
      const updatedSubjectInput = screen.getByPlaceholderText('Subject') as HTMLInputElement
      const updatedMessageInput = screen.getByPlaceholderText('Tell me about your project...') as HTMLTextAreaElement

      expect(updatedNameInput.value).toBe('')
      expect(updatedEmailInput.value).toBe('')
      expect(updatedSubjectInput.value).toBe('')
      expect(updatedMessageInput.value).toBe('')
    }, { timeout: 3000 })
  })

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup()
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
      ; (fetch as jest.Mock).mockReturnValue(promise)

    render(<ContactPage />)

    // Fill out form
    await user.type(screen.getByPlaceholderText('Your Name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Your Email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Subject'), 'Test Subject')
    await user.type(screen.getByPlaceholderText('Tell me about your project...'), 'This is a test message with more than 20 characters')

    const captchaButton = screen.getByText('Complete Captcha')
    await user.click(captchaButton)

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    expect(screen.getByText(/sending/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // Resolve the promise
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true }),
    })

    await waitFor(() => {
      expect(screen.queryByText(/sending/i)).not.toBeInTheDocument()
    })
  })
})