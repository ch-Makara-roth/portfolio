'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, ExternalLink, Calendar, Star, Code, Eye, Users, Clock, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Project } from '@/app/api/projects/route'

interface ProjectDetailPageProps {
  project: Project
}

export default function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  const router = useRouter()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [previewMode, setPreviewMode] = useState<'image' | 'iframe'>(project.liveUrl ? 'iframe' : 'image')

  // Motion variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-bg text-text overflow-x-hidden selection:bg-accent/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-accent/3 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-secondary/3 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Header Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 inset-x-0 z-50 px-6 py-6 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="pointer-events-auto group bg-bg/20 backdrop-blur-3xl border border-dimmed/10 hover:border-accent/40 rounded-2xl px-6 py-6 text-dimmed hover:text-accent transition-all duration-500"
          >
            <ArrowLeft size={20} className="mr-3 transition-transform group-hover:-translate-x-1" />
            <span className="font-mono text-xs tracking-widest uppercase">Back to index</span>
          </Button>

          <div className="pointer-events-auto hidden md:flex items-center gap-6 px-8 py-4 bg-bg/20 backdrop-blur-3xl border border-dimmed/10 rounded-2xl">
            <Link href="/projects" className="text-xs font-mono tracking-widest text-dimmed hover:text-accent transition-colors">PROJECTS</Link>
            <div className="h-1 w-1 bg-dimmed/40 rounded-full" />
            <span className="text-xs font-mono tracking-widest text-text truncate max-w-[200px] uppercase">{project.title}</span>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 pt-32 pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32 items-end">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <Badge className="bg-accent/10 text-accent border border-accent/20 px-4 py-1.5 rounded-full text-[0.7rem] tracking-[0.2em] font-mono uppercase">
                    {project.category || "Case Study"}
                  </Badge>
                  <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.8] text-text">
                    {project.title.split(' ').map((word, i) => (
                      <span key={i} className="block">{word}</span>
                    ))}
                  </h1>
                </div>

                <div className="space-y-8 max-w-xl">
                  <p className="text-xl sm:text-2xl text-dimmed leading-relaxed font-light italic border-l-2 border-accent/30 pl-8">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm font-mono tracking-wider">
                    <div className="space-y-1">
                      <div className="text-dimmed/50 text-[0.6rem] uppercase">Role</div>
                      <div className="text-text">{project.role || "Lead Developer"}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-dimmed/50 text-[0.6rem] uppercase">Timeline</div>
                      <div className="text-text">{project.timeline || "2024"}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-dimmed/50 text-[0.6rem] uppercase">Status</div>
                      <div className="text-accent flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                        </span>
                        Completed
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    {project.githubUrl && (
                      <Button asChild size="lg" className="bg-bg/40 backdrop-blur-xl border border-dimmed/20 hover:border-accent/40 hover:bg-accent/5 text-text rounded-2xl px-8 h-16 group transition-all duration-500">
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github size={20} className="mr-3 group-hover:text-accent transition-colors" />
                          View Source Code
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button asChild size="lg" className="bg-accent text-bg hover:bg-accent/90 rounded-2xl px-10 h-16 shadow-[0_20px_40px_rgba(100,255,218,0.2)] group transition-all duration-500">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          Visit Live Experience
                          <ExternalLink size={20} className="ml-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Interactive Browser Mockup / Parallax Image Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto lg:h-[650px] rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-dimmed/10 flex flex-col bg-bg/40 backdrop-blur-xl group"
              >
                {/* Browser Header Bar */}
                <div className="flex items-center px-4 py-3 border-b border-dimmed/10 bg-black/40 backdrop-blur-md relative z-20 shrink-0">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>

                  <div className="mx-auto flex-1 max-w-[60%] flex justify-center">
                    <div className="w-full max-w-[300px] bg-bg/50 text-dimmed/70 text-[10px] font-mono py-1.5 px-3 rounded-md text-center border border-dimmed/10 flex items-center justify-center gap-2 truncate opacity-70 group-hover:opacity-100 transition-opacity">
                      <span className="shrink-0"><ExternalLink size={10} className="text-emerald-500" /></span>
                      <span className="truncate">{project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '') : `${project.title.toLowerCase().replace(/\s+/g, '-')}.local`}</span>
                    </div>
                  </div>

                  {project.liveUrl && (
                    <div className="flex items-center absolute right-4">
                      <button
                        onClick={() => setPreviewMode(prev => prev === 'image' ? 'iframe' : 'image')}
                        className="text-[10px] uppercase font-mono tracking-wider px-3 py-1.5 rounded-full border border-dimmed/20 hover:border-accent/40 bg-bg/50 hover:bg-accent/10 hover:text-accent transition-all duration-300"
                      >
                        {previewMode === 'image' ? 'Live Preview' : 'Close Preview'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Main Content Area (Image or Iframe) */}
                <div className="relative flex-1 bg-black/50 overflow-hidden w-full h-full">
                  {previewMode === 'iframe' && project.liveUrl ? (
                    <div className="w-full h-full bg-white relative">
                      <iframe
                        src={project.liveUrl}
                        className="w-full h-full border-0 absolute inset-0 z-10 bg-white"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                        title={`${project.title} Preview`}
                      />
                      <div className="absolute inset-0 z-0 flex items-center justify-center bg-bg">
                        <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className={`object-cover object-top transition-all duration-[2s] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-105 group-hover:object-center ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-bg/20 backdrop-blur-2xl">
                          <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </section>

            {/* Project Deep Dive */}
            <section className="space-y-32">
              <motion.div
                {...fadeInUp}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                <div className="lg:col-span-4">
                  <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-accent mb-6 flex items-center gap-4">
                    01 <div className="h-px w-12 bg-accent/30" /> DESCRIPTION
                  </h2>
                  <p className="text-2xl font-medium tracking-tight text-text leading-tight">
                    The vision and execution behind <span className="text-accent">{project.title}</span>.
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <div className="text-lg sm:text-xl text-dimmed/90 leading-relaxed font-light space-y-8 columns-1 md:columns-2 gap-12">
                    {project.longDescription || project.description}
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                {/* Tech Stack Bento */}
                <motion.div {...fadeInUp}>
                  <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-accent mb-8 flex items-center gap-4">
                    02 <div className="h-px w-12 bg-accent/30" /> TECHNOLOGY
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {project.techStack.map((tech, i) => (
                      <div
                        key={tech}
                        className="p-6 bg-bg/20 backdrop-blur-3xl border border-dimmed/10 rounded-3xl group hover:border-accent/40 transition-all duration-500"
                      >
                        <div className="text-dimmed/40 text-[0.6rem] font-mono mb-2">TOOL_{i.toString().padStart(2, '0')}</div>
                        <div className="text-sm font-mono tracking-wider group-hover:text-accent transition-colors">{tech}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Features Bento */}
                <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                  <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-secondary mb-8 flex items-center gap-4">
                    03 <div className="h-px w-12 bg-secondary/30" /> FEATURES
                  </h2>
                  <div className="space-y-4">
                    {(project.features || [
                      'Modern and responsive user interface',
                      'Optimized performance and fast loading times',
                      'Cross-browser compatibility',
                      'Mobile-first design approach',
                      'Accessible and user-friendly experience'
                    ]).map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-6 p-6 bg-bg/20 backdrop-blur-3xl border border-dimmed/10 rounded-3xl hover:border-secondary/40 transition-all duration-500 group"
                      >
                        <div className="h-10 w-10 shrink-0 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-center text-secondary font-mono text-xs group-hover:scale-110 transition-transform">
                          {i + 1}
                        </div>
                        <p className="text-dimmed group-hover:text-text transition-colors">{feature}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Next Project Teaser (Mock) */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-64 text-center space-y-12"
            >
              <div className="h-px w-32 bg-dimmed/10 mx-auto" />
              <div className="space-y-4">
                <p className="text-xs font-mono tracking-widest text-dimmed uppercase">Next Exploration</p>
                <div
                  className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-dimmed/20 hover:text-accent transition-all duration-1000 cursor-pointer select-none py-4"
                  onClick={() => router.push('/projects')}
                >
                  DISCOVER MORE STORIES
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => router.push('/projects')}
                className="group text-dimmed hover:text-accent text-sm font-mono tracking-widest uppercase"
              >
                Back to projects collection
                <ArrowLeft size={16} className="ml-3 rotate-180 transition-transform group-hover:translate-x-2" />
              </Button>
            </motion.section>
          </div>
        </div>
      </main>

      {/* Decorative Blob */}
      <div className="fixed top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-accent/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-secondary/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
    </div>
  )
}