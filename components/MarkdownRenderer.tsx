"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import Image from "next/image";
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Helper function to create URL-friendly IDs
const createHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight, rehypeRaw]}
        components={{
          // Custom heading styles with IDs
          h1: ({ children, ...props }) => {
            const id = createHeadingId(String(children));
            return (
              <h1
                id={id}
                className="text-3xl sm:text-4xl font-bold text-text mb-6 mt-8 first:mt-0 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent scroll-mt-20"
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2: ({ children, ...props }) => {
            const id = createHeadingId(String(children));
            return (
              <h2
                id={id}
                className="text-2xl sm:text-3xl font-semibold text-text mb-4 mt-8 first:mt-0 border-b border-dimmed/20 pb-2 scroll-mt-20"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const id = createHeadingId(String(children));
            return (
              <h3
                id={id}
                className="text-xl sm:text-2xl font-semibold text-text mb-3 mt-6 first:mt-0 scroll-mt-20"
                {...props}
              >
                {children}
              </h3>
            );
          },
          h4: ({ children, ...props }) => {
            const id = createHeadingId(String(children));
            return (
              <h4
                id={id}
                className="text-lg sm:text-xl font-semibold text-text mb-2 mt-4 first:mt-0 scroll-mt-20"
                {...props}
              >
                {children}
              </h4>
            );
          },
          // Custom paragraph styles
          p: ({ children }) => (
            <p className="text-text/90 leading-relaxed mb-4 text-base sm:text-lg">
              {children}
            </p>
          ),
          // Custom link styles
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-accent hover:text-secondary transition-colors underline decoration-accent/50 hover:decoration-secondary/50"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Custom list styles
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-text/90 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-text/90 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-base sm:text-lg leading-relaxed">{children}</li>
          ),
          // Custom blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent/50 pl-6 py-2 my-6 bg-bg/30 rounded-r-lg italic text-text/80">
              {children}
            </blockquote>
          ),
          // Custom code styles
          code: ({ className, children, ...props }) => {
            const isInline = !className?.includes("language-");
            if (isInline) {
              return (
                <code
                  className="bg-bg/50 text-accent px-2 py-1 rounded text-sm font-mono border border-dimmed/20"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className={`${className || ""} block bg-bg/80 p-4 rounded-lg border border-dimmed/20 overflow-x-auto text-sm`}
                {...props}
              >
                {children}
              </code>
            );
          },
          // Custom pre styles for code blocks
          pre: ({ children }) => (
            <pre className="bg-bg/80 p-4 rounded-lg border border-dimmed/20 overflow-x-auto mb-6 text-sm">
              {children}
            </pre>
          ),
          // Custom table styles
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-dimmed/20 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-bg/50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold text-text border-b border-dimmed/20">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-text/90 border-b border-dimmed/10">
              {children}
            </td>
          ),
          // Custom horizontal rule
          hr: () => (
            <hr className="border-0 h-px bg-gradient-to-r from-transparent via-dimmed/30 to-transparent my-8" />
          ),
          // Custom image styles
          img: ({ src, alt }) => {
            if (!src) return null;
            const imageSrc =
              typeof src === "string" ? src : URL.createObjectURL(src);
            return (
              <Image
                src={imageSrc}
                alt={alt || ""}
                width={800}
                height={400}
                className="rounded-lg border border-dimmed/20 max-w-full h-auto my-6 shadow-lg"
                style={{ width: "auto", height: "auto" }}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
