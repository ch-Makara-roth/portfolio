'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ListTree, X } from 'lucide-react'

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
  const [isOpen, setIsOpen] = useState(false)

  // Extract headings from markdown content
  useEffect(() => {
    const headingRegex = /^(#{1,4})\s+(.+)$/gm
    const extractedItems: TableOfContentsItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const rawText = match[2].trim()
      // Remove any markdown formatting inside heading text
      const cleanText = rawText.replace(/[*_~`]/g, '').trim()
      const id = cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      if (cleanText) {
        extractedItems.push({ id, text: cleanText, level })
      }
    }

    setItems(extractedItems)
  }, [content])

  // Track active heading based on scroll position
  const handleScroll = useCallback(() => {
    const headings = items.map(item => document.getElementById(item.id)).filter(Boolean)
    const scrollPosition = window.scrollY + 120

    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i]
      if (heading && heading.offsetTop <= scrollPosition) {
        setActiveId(items[i].id)
        return
      }
    }

    if (window.scrollY < 120) {
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
      const offsetTop = element.offsetTop - 90
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
      setIsOpen(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <>
      {/* ─── Desktop Floating Indicator & Quick-Expand (Fixed Right Edge) ─── */}
      <div
        className={`fixed right-6 top-32 z-40 hidden lg:block ${className}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Collapsed Bar Indicators */}
        <div className="flex flex-col items-end gap-1.5 p-2 bg-bg/50 backdrop-blur-md rounded-full border border-dimmed/15 cursor-pointer hover:border-accent/30 transition-all duration-300">
          <ListTree size={14} className="text-dimmed hover:text-accent transition-colors mb-0.5" />
          {items.slice(0, 10).map((item) => (
            <div
              key={item.id}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                item.id === activeId 
                  ? 'bg-accent shadow-[0_0_8px_rgba(100,255,218,0.6)] w-5' 
                  : 'bg-dimmed/30 hover:bg-dimmed/60'
              }`}
              style={{ 
                width: item.id === activeId ? '20px' : item.level === 1 ? '16px' : item.level === 2 ? '12px' : '8px',
              }}
              title={item.text}
              onClick={() => scrollToHeading(item.id)}
            />
          ))}
        </div>

        {/* Expanded Floating Navigation Popover */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 15, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-0 bg-bg/95 backdrop-blur-xl border border-dimmed/20 rounded-2xl shadow-2xl p-5 min-w-[260px] max-w-[320px] max-h-[70vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-dimmed/15">
                <div className="flex items-center gap-2">
                  <ListTree className="h-4 w-4 text-accent" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-text">
                    Table of Contents
                  </span>
                </div>
                <span className="text-[10px] font-mono text-dimmed">
                  {items.length} sections
                </span>
              </div>

              <nav className="space-y-1" aria-label="Table of contents navigation">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToHeading(item.id)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all duration-200 text-xs font-mono truncate flex items-center gap-1.5 ${
                      item.id === activeId
                        ? 'bg-accent/15 text-accent font-semibold border-l-2 border-accent'
                        : 'text-dimmed hover:text-text hover:bg-bg/60'
                    }`}
                    style={{
                      paddingLeft: `${Math.max(8, (item.level - 1) * 10 + 10)}px`,
                    }}
                    title={item.text}
                  >
                    {item.id === activeId && (
                      <ChevronRight className="h-3 w-3 flex-shrink-0 text-accent" />
                    )}
                    <span className="truncate">{item.text}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Mobile Floating Toggle Button & Bottom Drawer ─── */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Table of Contents"
          className="fixed bottom-20 sm:bottom-24 right-4 z-40 p-3 rounded-full bg-bg/90 border border-dimmed/25 text-accent shadow-xl backdrop-blur-md active:scale-95 transition-transform"
        >
          <ListTree size={18} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Higher z-index to sit above the global bottom dock (z-50) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60] lg:hidden"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 260 }}
                className="fixed bottom-0 left-0 right-0 max-h-[80vh] bg-bg/98 backdrop-blur-2xl border-t border-dimmed/20 rounded-t-3xl p-6 z-[65] overflow-y-auto custom-scrollbar lg:hidden shadow-2xl overscroll-contain"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)' }}
              >
                {/* Visual Grab Handle */}
                <div className="w-10 h-1 bg-dimmed/30 rounded-full mx-auto mb-4" />

                <div className="flex items-center justify-between pb-4 mb-4 border-b border-dimmed/15">
                  <div className="flex items-center gap-2">
                    <ListTree className="h-5 w-5 text-accent" />
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-text">
                      Table of Contents
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close table of contents"
                    className="p-1.5 rounded-lg border border-dimmed/20 text-dimmed hover:text-text hover:border-accent/40 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <nav className="space-y-2 pb-6">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToHeading(item.id)}
                      className={`w-full text-left py-2.5 px-3 rounded-xl transition-all duration-200 text-xs sm:text-sm font-mono truncate flex items-center gap-2 ${
                        item.id === activeId
                          ? 'bg-accent/15 text-accent font-semibold border border-accent/35 shadow-sm'
                          : 'text-dimmed hover:text-text hover:bg-bg/60 border border-transparent'
                      }`}
                      style={{
                        paddingLeft: `${Math.max(12, (item.level - 1) * 12 + 12)}px`,
                      }}
                    >
                      {item.id === activeId && (
                        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
                      )}
                      <span className="truncate">{item.text}</span>
                    </button>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
