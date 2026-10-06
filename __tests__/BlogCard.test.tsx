/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BlogPost } from '@/components/BlogPost'
import { BlogPost as BlogPostType } from '@/types/blog'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

jest.mock('framer-motion', () => ({
  motion: {
    article: ({ children, className, onClick, ...props }: any) => (
      <article className={className} onClick={onClick} {...props}>
        {children}
      </article>
    ),
    div: ({ children, className, onClick, ...props }: any) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, width, height, priority, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      {...props}
    />
  ),
}))

const mockPost: BlogPostType = {
  id: 'blog-1',
  title: 'Mastering NestJS Microservices Architecture',
  slug: 'mastering-nestjs-microservices-architecture',
  excerpt: 'A deep dive into building event-driven microservices with RabbitMQ, Redis, and NestJS.',
  content: '# Mastering NestJS Microservices\n\nDetailed technical content here.',
  status: 'PUBLISHED',
  author: {
    name: 'Chhuon Makara Roth',
    avatar: '/avatars/chhuon.jpg',
    title: 'Full Stack Engineer',
  },
  publishedAt: '2026-02-15T00:00:00.000Z',
  createdAt: '2026-02-15T00:00:00.000Z',
  tags: ['NestJS', 'Microservices', 'Backend'],
  readTime: '6 min read',
  likes: 42,
  views: 1250,
  commentsCount: 5,
}

describe('BlogPost / BlogCard component', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders blog post title, excerpt, and author name in grid mode', () => {
    render(<BlogPost post={mockPost} viewMode="grid" />)

    expect(screen.getByText('Mastering NestJS Microservices Architecture')).toBeInTheDocument()
    expect(screen.getByText(/A deep dive into building event-driven microservices/)).toBeInTheDocument()
    expect(screen.getByText('Chhuon Makara Roth')).toBeInTheDocument()
    expect(screen.getByText('6 min read')).toBeInTheDocument()
  })

  it('renders tags correctly', () => {
    render(<BlogPost post={mockPost} viewMode="grid" />)

    expect(screen.getByText('#NestJS')).toBeInTheDocument()
  })

  it('navigates to blog post slug when clicked', () => {
    const { container } = render(<BlogPost post={mockPost} viewMode="grid" />)
    const articleElement = container.querySelector('article')
    expect(articleElement).toBeInTheDocument()

    fireEvent.click(articleElement!)
    expect(mockPush).toHaveBeenCalledWith('/blogs/mastering-nestjs-microservices-architecture')
  })

  it('renders list view mode when viewMode="list"', () => {
    render(<BlogPost post={mockPost} viewMode="list" />)

    expect(screen.getByText('Mastering NestJS Microservices Architecture')).toBeInTheDocument()
    expect(screen.getByText('#NestJS')).toBeInTheDocument()
    expect(screen.getByText('#Microservices')).toBeInTheDocument()
  })

  it('renders large spotlight hero card when isLarge=true', () => {
    render(<BlogPost post={mockPost} isLarge />)

    expect(screen.getByText('★ FEATURED ARTICLE')).toBeInTheDocument()
    expect(screen.getByText('READ FULL ARTICLE')).toBeInTheDocument()
    expect(screen.getByText('Mastering NestJS Microservices Architecture')).toBeInTheDocument()
  })

  it('displays engagement stats (views, likes, comments)', () => {
    render(<BlogPost post={mockPost} viewMode="grid" />)

    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('1250')).toBeInTheDocument()
  })
})
