'use client'

import BlogPostDetailPage from "@/components/BlogPostDetailPage";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto p-4">
      <BlogPostDetailPage slug={params.slug} />
    </div>
  );
}
