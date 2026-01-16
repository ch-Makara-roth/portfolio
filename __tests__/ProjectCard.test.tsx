/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProjectCard } from '@/components/ProjectCard'
import { Project } from '@/app/api/projects/route'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, whileHover, whileTap, onMouseEnter, onMouseLeave, className, onClick, ...props }: any) => (
      <div
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        {children}
      </div>
    ),
  },
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, width, height, priority, placeholder, blurDataURL, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      {...props}
    />
  ),
}))

const mockProject: Project = {
  id: '1',
  title: 'Test Project',
  description: 'This is a test project description',
  image: '/test-image.jpg',
  techStack: ['React', 'TypeScript', 'Jest'],
  githubUrl: 'https://github.com/test/project',
  liveUrl: 'https://test-project.com',
  featured: true,
  category: 'Featured',
  role: 'Developer',
  timeline: '2024'
}

const mockProjectNotFeatured: Project = {
  ...mockProject,
  id: '2',
  title: 'Non-Featured Project',
  featured: false,
  category: 'Web App'
}

describe('ProjectCard', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} />)

    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('This is a test project description')).toBeInTheDocument()
    expect(screen.getByAltText('Test Project')).toBeInTheDocument()
  })

  it('displays featured badge for featured projects', () => {
    render(<ProjectCard project={mockProject} />)

    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('does not display featured badge for non-featured projects', () => {
    render(<ProjectCard project={mockProjectNotFeatured} />)

    expect(screen.queryByText('Featured')).not.toBeInTheDocument()
  })

  it('renders tech stack badges', () => {
    render(<ProjectCard project={mockProject} />)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Jest')).toBeInTheDocument()
  })

  it('renders action buttons and links', () => {
    render(<ProjectCard project={mockProject} />)

    expect(screen.getByText('EXPLORE CASE STUDY')).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links.some(link => link.getAttribute('href') === mockProject.githubUrl)).toBe(true)
    expect(links.some(link => link.getAttribute('href') === mockProject.liveUrl)).toBe(true)
  })

  it('navigates to project detail page when title is clicked', async () => {
    render(<ProjectCard project={mockProject} />)

    const titleElement = screen.getByText('Test Project')
    fireEvent.click(titleElement)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/projects/1')
    })
  })

  it('opens GitHub URL in new tab when GitHub button is clicked', () => {
    render(<ProjectCard project={mockProject} />)

    const links = screen.getAllByRole('link')
    const githubLink = links.find(link => link.getAttribute('href') === 'https://github.com/test/project')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('opens live demo URL in new tab when live demo button is clicked', () => {
    render(<ProjectCard project={mockProject} />)

    const links = screen.getAllByRole('link')
    const liveLink = links.find(link => link.getAttribute('href') === 'https://test-project.com')
    expect(liveLink).toHaveAttribute('target', '_blank')
    expect(liveLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('applies grid view mode by default', () => {
    const { container } = render(<ProjectCard project={mockProject} />)

    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).not.toHaveClass('flex-row')
  })

  it('applies list view mode when specified', () => {
    const { container } = render(<ProjectCard project={mockProject} viewMode="list" />)

    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass('sm:flex-row')
  })

  it('handles mouse hover events', () => {
    render(<ProjectCard project={mockProject} />)

    const card = screen.getByText('Test Project').closest('div')

    fireEvent.mouseEnter(card!)
    fireEvent.mouseLeave(card!)

    // Test passes if no errors are thrown during hover events
    expect(card).toBeInTheDocument()
  })

  it('renders project without GitHub URL', () => {
    const projectWithoutGithub = { ...mockProject, githubUrl: '' }
    render(<ProjectCard project={projectWithoutGithub} />)

    const links = screen.getAllByRole('link')
    expect(links.some(link => link.getAttribute('href') === mockProject.githubUrl)).toBe(false)
  })

  it('renders project without live URL', () => {
    const projectWithoutLive = { ...mockProject, liveUrl: '' }
    render(<ProjectCard project={projectWithoutLive} />)

    const links = screen.getAllByRole('link')
    expect(links.some(link => link.getAttribute('href') === mockProject.liveUrl)).toBe(false)
  })

  it('renders all technologies in the tech stack', () => {
    const projectWithManyTechs = {
      ...mockProject,
      techStack: ['React', 'TypeScript', 'Jest', 'Node.js', 'Express', 'MongoDB']
    }
    render(<ProjectCard project={projectWithManyTechs} />)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Jest')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
    expect(screen.getByText('Express')).toBeInTheDocument()
    expect(screen.getByText('MongoDB')).toBeInTheDocument()
  })
})