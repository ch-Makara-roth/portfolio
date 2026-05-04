'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Code,
  Smartphone,
  Palette,
  Database,
  Globe,
  Shield,
  ArrowRight,
  Briefcase
} from 'lucide-react'
import { mockServices } from '@/lib/mockData'
import Link from 'next/link'

const iconMap: Record<string, any> = {
  Code,
  Smartphone,
  Palette,
  Database,
  Globe,
  Shield
}

const process = [
  {
    step: '01',
    title: 'Discovery',
    description: 'Understanding your requirements and project goals through detailed consultation.'
  },
  {
    step: '02',
    title: 'Planning',
    description: 'Creating a comprehensive project plan with timelines and technical specifications.'
  },
  {
    step: '03',
    title: 'Development',
    description: 'Building your solution with regular updates and continuous communication.'
  },
  {
    step: '04',
    title: 'Delivery',
    description: 'Testing, deployment, and ongoing support to ensure project success.'
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen sm:pb-20 md:pb-32 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
              <Briefcase size={14} className="text-secondary" />
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">What I Do</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter">
              Digital <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
                Services.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dimmed leading-relaxed">
              Comprehensive web development services to bring your digital vision to life, from pixel-perfect frontends to robust backend architectures.
            </p>
          </motion.div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-12 sm:mb-16 md:mb-20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {mockServices.map((service, index) => {
              const Icon = iconMap[service.icon] || Code
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="bg-bg/50 border-dimmed/20 backdrop-blur-sm h-full p-4 sm:p-5 md:p-6 hover:border-accent/40 transition-all duration-300 flex flex-col">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold text-text mb-2 sm:mb-3 group-hover:text-accent transition-colors leading-tight">
                      {service.title}
                    </h3>

                    <p className="text-dimmed text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 md:mb-6 flex-grow">
                      {service.features.slice(0, 4).map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-xs sm:text-sm text-text/80">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent rounded-full flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link href={`/services/${service.slug}`} className="block mt-auto">
                      <Button
                        variant="outline"
                        className="w-full border-accent/40 text-accent hover:bg-accent/10 group-hover:border-accent transition-all duration-300 text-xs sm:text-sm py-2 sm:py-2.5 md:py-3 min-h-[36px] sm:min-h-[40px]"
                      >
                        <span className="mr-2">Learn More</span>
                        <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-accent mb-8 sm:mb-10 md:mb-12 text-center">My Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                className="text-center relative"
              >
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto">
                    <span className="text-bg font-bold text-sm sm:text-base md:text-lg">{step.step}</span>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-6 sm:top-7 md:top-8 left-full w-full h-0.5 bg-gradient-to-r from-accent to-secondary opacity-30" />
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-text mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-dimmed text-xs sm:text-sm leading-relaxed px-2">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center bg-gradient-to-r from-accent/10 to-secondary/10 rounded-2xl p-6 sm:p-8 border border-accent/20"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-text mb-3 sm:mb-4">Ready to Start Your Project?</h2>
          <p className="text-dimmed mb-4 sm:mb-6 max-w-2xl mx-auto text-xs sm:text-sm px-2">
            Let's discuss your ideas and create something amazing together.
            I'm here to help you build the perfect solution for your needs.
          </p>
          <Button
            className="bg-accent hover:bg-accent/80 text-bg font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
            size="lg"
          >
            <span className="mr-2">Get Started</span>
            <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}