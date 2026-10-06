import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import BlogsPage from "@/components/BlogsPage";
import { QueryProvider } from '@/components/QueryProvider'

export const metadata: Metadata = generateMetadata({
  title: 'Blogs',
  description: 'Read the latest articles and insights on web development, programming, and technology by Chhuon Makara Roth.',
  path: '/blogs',
})

export default function Page() {
  return (
    <>
      {/* Server-rendered H1 for SEO */}
      <h1 className="sr-only">Blog - Web Development Articles by Chhuon Makara Roth</h1>
      <QueryProvider>
        <BlogsPage />
      </QueryProvider>
    </>
  );
}