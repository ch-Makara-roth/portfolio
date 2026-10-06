"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import Image from "next/image";
import { Check, Copy, Terminal } from "lucide-react";
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

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join("");
  if (React.isValidElement(children) && (children.props as any)?.children) {
    return extractTextFromChildren((children.props as any).children);
  }
  return "";
}

function CodeBlock({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1].toUpperCase() : "CODE";
  const rawCode = extractTextFromChildren(children);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(rawCode);
      } else {
        throw new Error("Clipboard API unavailable");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Safe fallback that avoids triggering any window scroll or viewport jump
      try {
        const textarea = document.createElement("textarea");
        textarea.value = rawCode;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.left = "0";
        textarea.style.width = "1px";
        textarea.style.height = "1px";
        textarea.style.padding = "0";
        textarea.style.border = "none";
        textarea.style.outline = "none";
        textarea.style.boxShadow = "none";
        textarea.style.background = "transparent";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }
  };

  return (
    <div className="group relative my-6 rounded-xl border border-dimmed/20 bg-bg/90 overflow-hidden shadow-xl backdrop-blur-md">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-dimmed/15 bg-bg/95">
        <div className="flex items-center gap-2">
          {/* Terminal Dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
          </div>
          <Terminal size={13} className="text-dimmed" />
          <span className="text-[11px] font-mono font-medium tracking-wider text-accent uppercase">
            {language}
          </span>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md border border-dimmed/20 bg-bg/60 text-dimmed hover:text-accent hover:border-accent/40 hover:bg-accent/10 transition-all duration-200"
        >
          {copied ? (
            <>
              <Check size={12} className="text-accent" />
              <span className="text-accent text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed custom-scrollbar bg-transparent m-0">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

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
          // Custom heading styles with IDs and scroll margins
          h1: ({ children, ...props }) => {
            const id = createHeadingId(extractTextFromChildren(children));
            return (
              <h1
                id={id}
                className="text-3xl sm:text-4xl font-bold text-text mb-6 mt-10 first:mt-0 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent scroll-mt-24"
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2: ({ children, ...props }) => {
            const id = createHeadingId(extractTextFromChildren(children));
            return (
              <h2
                id={id}
                className="text-2xl sm:text-3xl font-semibold text-text mb-4 mt-8 first:mt-0 border-b border-dimmed/20 pb-2 scroll-mt-24"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const id = createHeadingId(extractTextFromChildren(children));
            return (
              <h3
                id={id}
                className="text-xl sm:text-2xl font-semibold text-text mb-3 mt-6 first:mt-0 scroll-mt-24"
                {...props}
              >
                {children}
              </h3>
            );
          },
          h4: ({ children, ...props }) => {
            const id = createHeadingId(extractTextFromChildren(children));
            return (
              <h4
                id={id}
                className="text-lg sm:text-xl font-semibold text-text mb-2 mt-4 first:mt-0 scroll-mt-24"
                {...props}
              >
                {children}
              </h4>
            );
          },
          // Custom paragraph styles
          p: ({ children }) => (
            <p className="text-text/90 leading-relaxed mb-5 text-base sm:text-lg">
              {children}
            </p>
          ),
          // Custom link styles
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-accent hover:text-secondary transition-colors underline decoration-accent/40 hover:decoration-secondary/50 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Custom list styles
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-5 text-text/90 ml-2 sm:ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-5 text-text/90 ml-2 sm:ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-base sm:text-lg leading-relaxed text-text/90">
              {children}
            </li>
          ),
          // Custom blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent/60 pl-6 py-2 my-6 bg-bg/40 rounded-r-xl italic text-text/80 backdrop-blur-sm border border-y-0 border-r-0 border-dimmed/10">
              {children}
            </blockquote>
          ),
          // Custom code styles: handles inline code or block code
          code: ({ className, children, ...props }) => {
            const isInline = !className?.includes("language-");
            if (isInline) {
              return (
                <code
                  className="bg-bg/70 text-accent px-1.5 py-0.5 rounded text-sm font-mono border border-dimmed/20"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <CodeBlock className={className} {...props}>
                {children}
              </CodeBlock>
            );
          },
          // Pre element wrapper passthrough for CodeBlock
          pre: ({ children }) => <>{children}</>,
          // Custom table styles
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-xl border border-dimmed/20 bg-bg/40 backdrop-blur-sm">
              <table className="min-w-full divide-y divide-dimmed/20">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-bg/60">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-mono font-bold tracking-wider text-accent uppercase border-b border-dimmed/20">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-text/90 border-b border-dimmed/10 font-mono">
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
              <figure className="my-8">
                <div className="rounded-xl overflow-hidden border border-dimmed/20 shadow-xl bg-bg/50">
                  <Image
                    src={imageSrc}
                    alt={alt || ""}
                    width={800}
                    height={450}
                    className="w-full h-auto object-cover"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                {alt && (
                  <figcaption className="text-center text-xs font-mono text-dimmed mt-2">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
