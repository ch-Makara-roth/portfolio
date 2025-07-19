'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FolderOpen, User, Briefcase, Mail, Book } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/about', icon: User, label: 'About' },
  { href: '/services', icon: Briefcase, label: 'Services' },
  { href: '/contact', icon: Mail, label: 'Contact' },
  { href: '/blog', icon: Book, label: 'Blog' },
]

export function DockNavigation() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-2 sm:bottom-4 inset-x-0 flex justify-center z-50 px-3 sm:px-4 w-full"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-end justify-center gap-1 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-bg/95 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-dimmed/20 shadow-lg mx-auto max-w-fit">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href} className="relative group">
              <motion.div
                className={`dock-item relative p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl transition-all duration-200 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] md:min-w-[52px] md:min-h-[52px] flex items-center justify-center ${
                  isActive 
                    ? 'bg-accent/20 text-accent shadow-sm' 
                    : 'text-dimmed hover:text-text hover:bg-text/5 active:bg-text/10'
                }`}
                whileHover={{ 
                  scale: 1.15, 
                  y: -4
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon size={18} className="flex-shrink-0 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-2 max-sm:left-[45%] left-[41%] -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-accent rounded-full shadow-accent/30 shadow-md"
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  />
                )}
                
                {/* Desktop tooltip */}
                <div className="absolute -top-10 sm:-top-12 md:-top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-bg/95 backdrop-blur-sm px-3 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap border border-dimmed/20 shadow-lg pointer-events-none hidden md:block z-10">
                  {item.label}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-dimmed/20"></div>
                </div>
                
                {/* Mobile label - show on touch */}
                <div className="absolute -bottom-8 sm:-bottom-9 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm text-dimmed opacity-0 group-active:opacity-100 transition-opacity duration-150 md:hidden whitespace-nowrap pointer-events-none">
                  {item.label}
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
} 