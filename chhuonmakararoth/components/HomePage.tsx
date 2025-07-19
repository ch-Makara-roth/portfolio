'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import ShinyText from '@/components/animations/ShinyText/ShinyText';
import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'
import { useState } from 'react';

export default function HomePage() {
  const [skills, setSkills] = useState([
    { category: 'Frontend', skills: 'React, Next.js, Vue, TypeScript' },
    { category: 'Backend', skills: 'Node.js, Laravel, PostgreSQL' },
    { category: 'Design', skills: 'Figma, Tailwind CSS, Framer Motion' },
    { category: 'DevOps', skills: 'Docker, AWS, CI/CD, Git' },
    { category: 'Mobile', skills: 'React Native, Flutter, iOS' }
  ])
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ShinyText 
            text="Chhuon Makara Roth" 
            speed={2.5} 
            className='text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 px-2'
          />
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-dimmed mb-6 sm:mb-8 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Full Stack Developer
          </motion.p>
          
          <motion.p 
            className="text-sm sm:text-base md:text-lg text-text/80 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            I craft modern web experiences using cutting-edge technologies. 
            Specializing in React, Next.js, and full-stack development.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 mb-8 sm:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link href="/projects" className="w-full sm:w-auto">
              <Button 
                className="w-full sm:w-auto bg-accent hover:bg-accent/80 text-bg font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                size="lg"
              >
                View Projects
                <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </Button>
            </Link>
            
            <Link href="/contact" className="w-full sm:w-auto">
              <Button 
                variant="outline"
                className="w-full sm:w-auto border-secondary text-secondary hover:bg-secondary/10 px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                size="lg"
              >
                Hire Me
                <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          { skills ?  skills.map((skill, index) => (
            <div key={index} className="text-center p-3 sm:p-4 bg-bg/20 backdrop-blur-sm rounded-xl border border-accent/10 hover:border-accent/20 transition-all duration-300">
              <h3 className="text-accent font-semibold mb-2 text-xs sm:text-sm lg:text-base">{skill.category}</h3>
              <p className="text-dimmed text-xs sm:text-sm leading-relaxed">{skill.skills}</p>
            </div>
          )): (
            <div className="text-center p-3 sm:p-4 bg-bg/20 backdrop-blur-sm rounded-xl border border-accent/10 col-span-2 sm:col-span-3 lg:col-span-5">
              <h3 className="text-accent font-semibold mb-2 text-xs sm:text-sm lg:text-base">Loading...</h3>
            </div>
          )
          }
        </motion.div>
      </div>
    </div>
  )
} 