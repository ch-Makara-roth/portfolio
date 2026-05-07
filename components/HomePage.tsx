'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import ShinyText from '@/components/animations/ShinyText/ShinyText';
import StarryBackground from '@/components/animations/StarryBackground';
import Link from 'next/link'
import { ArrowRight, Mail, Github, Linkedin, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react';

const SKILLS = [
  { category: 'Frontend', icon: '⚡', skills: 'React, Next.js, Vue, TypeScript' },
  { category: 'Backend',  icon: '🛠️', skills: 'Node.js, Laravel, PostgreSQL' },
  { category: 'Design',   icon: '🎨', skills: 'Figma, Tailwind CSS, Framer Motion' },
  { category: 'DevOps',   icon: '🚀', skills: 'Docker, CI/CD, GitHub' },
  { category: 'Mobile',   icon: '📱', skills: 'React Native,' },
]

export default function HomePage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-24 sm:pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Starry Background */}
      <StarryBackground
        speed={0.8}
        starCount={150}
        nebulaColor="#4a0e4f"
        className="z-0"
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Hero content */}
      <div className="max-w-4xl w-full mx-auto text-center relative z-20 pt-24 sm:pt-28">

        {/* Available badge */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs sm:text-sm font-medium backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            Available for work
          </span>
        </motion.div>

        {/* Name - H1 for SEO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-5 px-2 leading-tight">
            <ShinyText
              text="Chhuon Makara Roth"
              speed={2.5}
              className="inline"
            />
          </h1>
        </motion.div>

        {/* Role badge */}
        <motion.div
          className="flex justify-center mb-5 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-secondary/40 bg-secondary/10 text-secondary text-sm sm:text-base md:text-lg font-semibold tracking-wide">
            Full Stack Developer
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-sm sm:text-base md:text-lg text-text/70 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          I craft modern web experiences using cutting-edge technologies.
          Specializing in React, Next.js, and full-stack development.
          Based in Phnom Penh, Cambodia, I build scalable applications
          that solve real-world problems with clean, maintainable code.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center px-4 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Link href="/projects" className="w-full xs:w-auto">
            <Button
              className="w-full xs:w-auto bg-accent hover:bg-accent/80 text-bg font-semibold px-7 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg shadow-accent/20 hover:shadow-accent/40"
              size="lg"
            >
              View Projects
              <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </Button>
          </Link>

          <Link href="/contact" className="w-full xs:w-auto">
            <Button
              variant="outline"
              className="w-full xs:w-auto border-secondary/60 text-secondary hover:bg-secondary/10 hover:border-secondary px-7 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              size="lg"
            >
              Hire Me
              <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
            </Button>
          </Link>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex justify-center items-center gap-4 mb-12 sm:mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <a
            href="https://github.com/ch-Makara-roth"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chhuon Makara Roth on GitHub"
            className="p-2 rounded-full text-dimmed hover:text-accent border border-transparent hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/chhuon-makararoth-b66700262/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chhuon Makara Roth on LinkedIn"
            className="p-2 rounded-full text-dimmed hover:text-accent border border-transparent hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
          >
            <Linkedin size={20} />
          </a>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto px-2"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {SKILLS.map((skill, index) => (
            <div
              key={index}
              className="group text-center p-3 sm:p-4 bg-bg/20 backdrop-blur-sm rounded-xl border border-accent/10 hover:border-accent/40 hover:bg-accent/5 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300"
            >
              <div className="text-xl mb-1.5">{skill.icon}</div>
              <h3 className="text-accent font-semibold mb-1.5 text-xs sm:text-sm">{skill.category}</h3>
              <p className="text-dimmed text-xs leading-relaxed">{skill.skills}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {isClient && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-dimmed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={24} className="text-accent/50" />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
