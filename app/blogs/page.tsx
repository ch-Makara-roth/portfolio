import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import BlogsPage from "@/components/BlogsPage";

export const metadata: Metadata = generateMetadata({
  title: 'Blogs',
  description: 'Read the latest articles and insights on web development, programming, and technology by Chhuon Makara Roth.',
  path: '/blogs',
})

export default function Page() {
  return (
    <div className="container mx-auto p-4 sm:pb-20 md:pb-32">
      <BlogsPage />
    </div>
  );
}