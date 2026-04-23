'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ListTree } from 'lucide-react'

export interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
  className?: string
}

export const TableOfContents = ({ content, className = '' }: TableOfContentsProps) => {
  const [items, setItems] = useState<TableOfContentsItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false)

  // Extract headings from markdown content
  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const extractedItems: TableOfContentsItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      extractedItems.push({ id, text, level })
    }

    setItems(extractedItems)
  }, [content])

  // Track active heading based on scroll position
  const handleScroll = useCallback(() => {
    const headings = items.map(item => document.getElementById(item.id)).filter(Boolean)
    const scrollPosition = window.scrollY + 100

    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i]
      if (heading && heading.offsetTop <= scrollPosition) {
        setActiveId(items[i].id)
        return
      }
    }

    if (window.scrollY < 100) {
      setActiveId('')
    }
  }, [items])

  useEffect(() => {
    if (items.length === 0) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, items])

  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offsetTop = element.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed z-40 hidden lg:flex items-center cursor-pointer group transition-all duration-250 ease-in-out right-6 ${isHovered ? 'top-24' : 'top-1/2 -translate-y-1/2'} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      aria-haspopup="dialog"
      aria-expanded={isHovered}
      aria-controls="table-of-contents-nav"
    >
      {/* Visual indicator bars (always visible) */}
      <div className="flex flex-col items-end gap-1.5">
        {items.slice(0, 9).map((item) => (
          <motion.div
            key={item.id}
            className={`h-0.5 rounded-full transition-all duration-200 ${
              item.id === activeId 
                ? 'bg-accent' 
                : 'bg-gray-600 group-hover:bg-gray-500'
            }`}
            style={{ 
              width: item.level === 1 ? '20px' : item.level === 2 ? '14px' : '10px',
            }}
            animate={{
              backgroundColor: item.id === activeId ? '#64ffda' : undefined,
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Full TOC dropdown (shown only on hover) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            id="table-of-contents-nav"
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 right-6 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-2xl p-4 min-w-[250px] max-w-[300px] max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700/50">
              <ListTree className="h-4 w-4 text-accent flex-shrink-0" />
              <h3 className="text-sm font-semibold text-text uppercase tracking-wide">
                Table of Contents
              </h3>
            </div>

            {/* TOC Items */}
            <nav className="space-y-1" aria-label="Table of contents navigation">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    scrollToHeading(item.id)
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md transition-all duration-200 text-sm truncate ${
                    item.id === activeId
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-gray-400 hover:text-text hover:bg-gray-800/50'
                  }`}
                  style={{
                    paddingLeft: `${(item.level - 1) * 12 + 12}px`,
                  }}
                  title={item.text}
                >
                  <div className="flex items-center gap-1">
                    {item.id === activeId && (
                      <ChevronRight className="h-3 w-3 flex-shrink-0" />
                    )}
                    <span className="truncate">{item.text}</span>
                  </div>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
