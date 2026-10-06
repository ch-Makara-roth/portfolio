import { Button } from '@/components/ui/button'
import ShinyText from '@/components/animations/ShinyText/ShinyText'
import Link from 'next/link'
import { ArrowRight, Mail, ChevronDown } from 'lucide-react'
import { GithubIcon as Github, LinkedinIcon as Linkedin } from '@/components/icons/BrandIcons'

const SKILLS = [
  { category: 'Frontend', icon: '⚡', skills: 'React, Next.js, Vue, TypeScript' },
  { category: 'Backend', icon: '🛠️', skills: 'Node.js, Laravel, PostgreSQL' },
  { category: 'Design', icon: '🎨', skills: 'Figma, Tailwind CSS, Framer Motion' },
  { category: 'DevOps', icon: '🚀', skills: 'Docker, CI/CD, GitHub' },
  { category: 'Mobile', icon: '📱', skills: 'React Native' },
]

export default function HomePage() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-24 sm:px-6 sm:pb-28 lg:px-8">
      {/* Static above-the-fold background: no client JS, no hydration work. */}
      <div aria-hidden="true" className="fixed inset-0 -z-20 bg-[#0a0a0a]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #0a0a0a 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 25%, rgba(100,255,218,0.18) 0 1px, transparent 1px), radial-gradient(circle at 80% 15%, rgba(255,255,255,0.22) 0 1px, transparent 1px), radial-gradient(circle at 50% 75%, rgba(255,121,198,0.16) 0 1px, transparent 1px)',
            backgroundSize: '120px 120px, 180px 180px, 220px 220px',
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl pt-24 text-center sm:pt-28">
        {/* Available badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent backdrop-blur-sm sm:text-sm">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for work
          </span>
        </div>

        {/* Name - H1 for SEO and LCP; rendered immediately on the server. */}
        <h1 className="mb-4 px-2 text-3xl font-bold leading-tight xs:text-4xl sm:mb-5 sm:text-5xl md:text-6xl lg:text-8xl">
          <ShinyText text="Chhuon Makara Roth" speed={2.5} className="inline" />
        </h1>

        {/* Role badge */}
        <div className="mb-5 flex justify-center sm:mb-6">
          <span className="inline-block min-h-8 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-secondary sm:text-base md:text-lg">
            Full Stack Developer
          </span>
        </div>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-xl px-4 text-sm leading-relaxed text-text/70 sm:mb-10 sm:text-base md:text-lg">
          I craft modern web experiences using cutting-edge technologies.
          Specializing in React, Next.js, and full-stack development.
          Based in Phnom Penh, Cambodia, I build scalable applications
          that solve real-world problems with clean, maintainable code.
        </p>

        {/* CTA Buttons */}
        <div className="mb-6 flex flex-col items-center justify-center gap-3 px-4 xs:flex-row sm:mb-8 sm:gap-4">
          <Link href="/projects" className="w-full xs:w-auto">
            <Button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3 text-sm font-semibold text-bg shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent/80 hover:shadow-accent/40 xs:w-auto sm:text-base"
              size="lg"
            >
              View Projects
              <ArrowRight size={16} className="sm:h-[18px] sm:w-[18px]" />
            </Button>
          </Link>

          <Link href="/contact" className="w-full xs:w-auto">
            <Button
              variant="outline"
              className="flex w-full items-center justify-center gap-2 rounded-xl border-secondary/60 px-7 py-3 text-sm text-secondary transition-all duration-200 hover:border-secondary hover:bg-secondary/10 xs:w-auto sm:text-base"
              size="lg"
            >
              Hire Me
              <Mail size={16} className="sm:h-[18px] sm:w-[18px]" />
            </Button>
          </Link>
        </div>

        {/* Social links */}
        <div className="mb-12 flex min-h-11 items-center justify-center gap-4 sm:mb-16">
          <a
            href="https://github.com/ch-Makara-roth"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chhuon Makara Roth on GitHub"
            className="rounded-full border border-transparent p-2 text-dimmed transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/chhuon-makararoth-b66700262/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chhuon Makara Roth on LinkedIn"
            className="rounded-full border border-transparent p-2 text-dimmed transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
          >
            <Linkedin size={20} />
          </a>
        </div>

        {/* Skills grid: min-height reserves space for emoji font swaps and avoids CLS. */}
        <h2 id="skills-heading" className="sr-only">
          Core skills
        </h2>
        <ul
          aria-labelledby="skills-heading"
          className="mx-auto grid max-w-4xl grid-cols-2 gap-3 px-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-5"
        >
          {SKILLS.map((skill) => (
            <li
              key={skill.category}
              className="group flex min-h-[8.25rem] flex-col items-center justify-start rounded-xl border border-accent/10 bg-bg/20 p-3 text-center backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:bg-accent/5 hover:shadow-lg hover:shadow-accent/10 sm:min-h-36 sm:p-4"
            >
              <span className="mb-1.5 flex h-8 items-center justify-center text-xl leading-none" aria-hidden="true">
                {skill.icon}
              </span>
              <h3 className="mb-1.5 text-xs font-semibold text-accent sm:text-sm">
                {skill.category}
              </h3>
              <p className="text-xs leading-relaxed text-dimmed">{skill.skills}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Scroll indicator: absolute and server-rendered to avoid client-only insertion. */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-dimmed motion-safe:animate-bounce" aria-hidden="true">
        <ChevronDown size={24} className="text-accent/50" />
      </div>
    </section>
  )
}
