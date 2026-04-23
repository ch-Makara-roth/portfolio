'use client'

import { useEffect } from 'react'
import BlogPostDetailPage from "@/components/BlogPostDetailPage";

export default function Page({ params }: { params: { slug: string } }) {
  useEffect(() => {
    console.log('Blog page loaded, slug:', params.slug)
  }, [params.slug])
  
  return (
    <div className="container mx-auto p-4 sm:pb-20 md:pb-32 custom-scrollbar">
      <BlogPostDetailPage slug={params.slug} />
    </div>
  );
}
