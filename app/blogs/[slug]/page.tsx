import { Metadata } from 'next'
import { generateMetadata as getMetadata } from '@/lib/metadata'
import { QueryProvider } from '@/components/QueryProvider'
import BlogPostDetailPage from '@/components/BlogPostDetailPage'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const formattedTitle = params.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return getMetadata({
    title: formattedTitle,
    description: `Read "${formattedTitle}" on web development, architecture, and technology by Chhuon Makara Roth.`,
    path: `/blogs/${params.slug}`,
    type: 'article',
  })
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <QueryProvider>
      <BlogPostDetailPage slug={params.slug} />
    </QueryProvider>
  )
}
