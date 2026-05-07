'use client'

import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { Github } from '@/components/icons/brand-icons'
import { Project } from '@/app/api/projects/route'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  viewMode?: 'grid' | 'list'
  className?: string
  isLarge?: boolean
}

export function ProjectCard({ project, viewMode = 'grid', className = '', isLarge = false }: ProjectCardProps) {
  const router = useRouter()

  const handleNavigateToProject = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) return
    router.push(`/projects/${project.id}`)
  }

  const LinkButtons = ({ size = 15 }: { size?: number }) => (
    <div className="flex gap-2">
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-dimmed/20 text-dimmed hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-200"
        >
          <Github size={size} />
        </a>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-dimmed/20 text-dimmed hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-200"
        >
          <ExternalLink size={size} />
        </a>
      )}
    </div>
  )

  /* ─── Large / Featured card (horizontal) ─── */
  if (isLarge) {
    return (
      <motion.div
        onClick={handleNavigateToProject}
        className={cn(
          'group relative rounded-2xl overflow-hidden border border-dimmed/10 bg-bg/40 cursor-pointer',
          'md:grid md:grid-cols-5',
          'hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500',
          className
        )}
      >
        {/* Image — 3 of 5 cols on desktop */}
        <div className="relative h-64 md:h-full md:col-span-3 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-bg/10 to-transparent md:hidden" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-bg/80 hidden md:block" />

          {project.featured && (
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] font-mono tracking-widest bg-accent/15 border border-accent/30 text-accent px-3 py-1 rounded-full">
                ★ FEATURED
              </span>
            </div>
          )}
        </div>

        {/* Content — 2 of 5 cols on desktop */}
        <div className="flex flex-col justify-between p-7 md:col-span-2 md:p-9">
          <div className="space-y-4">
            {project.category && (
              <span className="text-[10px] font-mono tracking-widest text-dimmed uppercase">
                {project.category}
              </span>
            )}
            <div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text leading-tight group-hover:text-accent transition-colors duration-300">
                {project.title}
              </h3>
              {(project.role || project.timeline) && (
                <p className="text-xs font-mono text-dimmed/50 mt-2">
                  {[project.role, project.timeline].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            <p className="text-dimmed leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono text-dimmed/70 bg-dimmed/5 border border-dimmed/10 px-2.5 py-1 rounded-md group-hover:border-dimmed/20 transition-colors duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-8">
            <span className="text-xs font-mono text-accent flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
              VIEW PROJECT <ArrowRight size={13} />
            </span>
            <LinkButtons size={15} />
          </div>
        </div>
      </motion.div>
    )
  }

  /* ─── List card ─── */
  if (viewMode === 'list') {
    return (
      <motion.div
        onClick={handleNavigateToProject}
        className={cn(
          'group flex gap-5 rounded-xl border border-dimmed/10 bg-bg/40 cursor-pointer p-4',
          'hover:border-accent/30 hover:bg-bg/60 transition-all duration-300',
          className
        )}
      >
        <div className="relative w-36 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
        </div>

        <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-text group-hover:text-accent transition-colors duration-300 truncate leading-tight">
                {project.title}
              </h3>
              {project.category && (
                <span className="text-[9px] font-mono text-dimmed/60 shrink-0 mt-0.5">{project.category}</span>
              )}
            </div>
            <p className="text-sm text-dimmed line-clamp-2 leading-relaxed">{project.description}</p>
          </div>

          <div className="flex items-center gap-3 pt-1.5">
            <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
              {project.techStack.slice(0, 4).map((tech) => (
                <span key={tech} className="text-[9px] font-mono text-dimmed/60 bg-dimmed/5 border border-dimmed/10 px-2 py-0.5 rounded-md">
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="text-[9px] font-mono text-dimmed/40">+{project.techStack.length - 4}</span>
              )}
            </div>
            <LinkButtons size={13} />
          </div>
        </div>
      </motion.div>
    )
  }

  /* ─── Grid card ─── */
  return (
    <motion.div
      onClick={handleNavigateToProject}
      className={cn(
        'group relative rounded-2xl overflow-hidden border border-dimmed/10 bg-bg/40 cursor-pointer flex flex-col',
        'hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500',
        className
      )}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
          {project.category && (
            <span className="text-[9px] font-mono tracking-wider bg-bg/70 backdrop-blur-sm border border-dimmed/20 text-dimmed px-2.5 py-1 rounded-full uppercase">
              {project.category}
            </span>
          )}
          {project.featured && (
            <span className="text-[9px] font-mono bg-accent/15 border border-accent/30 text-accent px-2.5 py-1 rounded-full ml-auto">
              ★ Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-text group-hover:text-accent transition-colors duration-300 leading-tight">
            {project.title}
          </h3>
          {(project.role || project.timeline) && (
            <p className="text-[11px] font-mono text-dimmed/50 mt-1">
              {[project.role, project.timeline].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        <p className="text-sm text-dimmed leading-relaxed line-clamp-2 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span key={tech} className="text-[9px] font-mono text-dimmed/70 bg-dimmed/5 border border-dimmed/10 px-2 py-0.5 rounded-md">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-dimmed/8">
          <span className="text-[11px] font-mono text-accent flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
            VIEW CASE STUDY <ArrowRight size={11} />
          </span>
          <LinkButtons size={14} />
        </div>
      </div>
    </motion.div>
  )
}
