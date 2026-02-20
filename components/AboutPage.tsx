'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Calendar, MapPin, Coffee, Code, Link, Download, Phone, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { AboutData } from '@/lib/mockData'

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/about')
        const result = await response.json()

        if (result.success) {
          setAboutData(result.data)
        } else {
          setError(result.error || 'Failed to fetch about data')
        }
      } catch (err) {
        setError('Failed to fetch about data')
        console.error('Error fetching about data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-dimmed">Loading about data...</p>
        </div>
      </div>
    )
  }

  if (error || !aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => isClient && window.location.reload()}
            className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/80"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { personalInfo, skills, experiences, education } = aboutData
  return (
    <div className="min-h-screen max-sm:pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
              <User size={14} className="text-secondary" />
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">Get to know me</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter">
              Behind the <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
                code.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dimmed leading-relaxed">
              Learn more about my journey, the skills I've gathered along the way, and my passion for crafting digital experiences.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-start mb-16 sm:mb-24">
          {/* Left Column: Profile & Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 space-y-6 sm:space-y-8"
          >
            {/* Profile Image Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-accent to-secondary rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
              <div className="relative p-2 bg-bg/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden">
                  <Image
                    src={personalInfo.profileImage}
                    alt={`${personalInfo.name} - ${personalInfo.title}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEnyLFwzRQV0zFNHqZZLi6yIJhyZCFnJNUKs5lGF7hZm0fRYdDGrXSLDTJVuFZHhZuN7VGWwSzUFGwU4Kp/9k="
                  />
                  {/* Inner Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />

                  {/* Floating Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{personalInfo.name}</h2>
                    <p className="text-secondary font-medium">{personalInfo.title}</p>
                  </div>
                </div>
              </div>

              {/* Floating Status Badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 15 }}
                className="absolute -right-2 top-8 sm:-right-4 sm:top-10 lg:-right-6 lg:top-12 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-20"
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white">Available for hire</span>
              </motion.div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { icon: MapPin, label: 'Location', value: personalInfo.location, colSpan: '' },
                { icon: Mail, label: 'Email', value: personalInfo.email, colSpan: 'sm:col-span-2' },
                { icon: Phone, label: 'Phone', value: personalInfo.phone, colSpan: '' },
                { icon: Coffee, label: 'Coffee', value: 'Powered by caffeine', colSpan: '' },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className={`group flex flex-col p-4 sm:p-5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300 backdrop-blur-sm ${item.colSpan}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white/5 text-accent group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-300">
                      <item.icon size={16} />
                    </div>
                    <span className="text-xs font-semibold text-dimmed uppercase tracking-wider">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-white/90 break-all sm:break-normal" title={item.value}>{item.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Story & Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-7 space-y-8 sm:space-y-12 lg:pl-8 lg:pt-8"
          >
            {/* Story Section */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6">
                <Code size={14} />
                <span>My Background</span>
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Crafting digital experiences with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">passion & precision</span>
              </h3>

              <div className="space-y-6 text-dimmed text-base sm:text-lg leading-relaxed">
                {personalInfo.story.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    viewport={{ once: true }}
                    className={index === 0 ? "text-white/90 font-medium text-lg sm:text-xl" : ""}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Hobbies / Interests */}
            <div className="pt-8 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">Interests & Hobbies</h4>
              <div className="flex flex-wrap gap-3">
                {personalInfo.hobbies.map((hobby, idx) => (
                  <motion.div
                    key={hobby}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 text-white/70 hover:text-white transition-all duration-300 font-medium text-sm flex items-center gap-2 cursor-default"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    {hobby}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Highlight Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/10 via-bg to-secondary/10 border border-white/10 p-8 group"
            >
              <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-500" />
              <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <Code size={28} className="text-bg" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Building the Future</h4>
                  <p className="text-dimmed leading-relaxed">
                    I believe every line of code is an opportunity to solve a problem and create a meaningful experience. I'm dedicated to building products that matter and scale.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-accent mb-4 sm:mb-6 md:mb-8 text-center">Skills & Technologies</h2>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 justify-center px-2 sm:px-4 md:px-0">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.03, duration: 0.3 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors cursor-default text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-8 sm:mb-12 md:mb-16"
        >
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6 sm:mb-8 md:mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Education
            </span>
          </motion.h2>

          <div className="relative">
            <motion.div
              className="hidden lg:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-accent/30 via-secondary/30 to-accent/30"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
              viewport={{ once: true, margin: "-200px" }}
              style={{ transformOrigin: "top" }}
            />

            <div className="space-y-8 sm:space-y-12 lg:space-y-16">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: index % 2 === 0 ? -100 : 100,
                    y: 50
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    y: 0
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  className={`relative ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12 lg:ml-auto'} lg:w-1/2`}
                >
                  <motion.div
                    className="hidden lg:block absolute top-6 sm:top-8 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-accent to-secondary rounded-full shadow-lg shadow-accent/20 transform -translate-y-1/2 z-10"
                    style={{
                      left: index % 2 === 0 ? 'calc(100% + 1.5rem)' : '-2rem'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.2 + 0.5,
                      ease: "easeOut"
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary rounded-full animate-pulse opacity-60"></div>
                  </motion.div>

                  <motion.div
                    className="relative group"
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-bg/80 to-bg/40 backdrop-blur-xl border border-accent/20 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:border-accent/40">

                      <motion.div
                        className="absolute -top-2 sm:-top-3 left-4 sm:left-6 md:left-8"
                        initial={{ y: -20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.2 + 0.3,
                          ease: "easeOut"
                        }}
                        viewport={{ once: true, margin: "-50px" }}
                      >
                        <span className="bg-gradient-to-r from-accent to-secondary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-bg shadow-lg">
                          {edu.period}
                        </span>
                      </motion.div>

                      <motion.div
                        className="mt-3 sm:mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.2 + 0.4,
                          ease: "easeOut"
                        }}
                        viewport={{ once: true, margin: "-50px" }}
                      >
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-text mb-2 group-hover:text-accent transition-colors duration-300">
                          {edu.degree}
                        </h3>
                        <p className="text-accent/80 font-medium mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
                          {edu.description}
                        </p>

                        <div className="space-y-1.5 sm:space-y-2">
                          <div className="flex items-center gap-2 text-text/80 text-xs sm:text-sm md:text-base">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary rounded-full"></div>
                            <span className="font-semibold">{edu.school}</span>
                          </div>
                          <div className="flex items-center gap-2 text-dimmed text-xs sm:text-sm md:text-base">
                            <MapPin size={12} className="sm:w-[14px] sm:h-[14px] md:w-4 md:h-4 text-accent flex-shrink-0" />
                            <span>{edu.location}</span>
                          </div>
                        </div>
                      </motion.div>

                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <motion.div
            className="mb-6 sm:mb-8 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text mb-2 text-center">
              Work Experience
            </h2>
            <p className="text-dimmed text-xs sm:text-sm md:text-base text-center px-4">
              My professional experience across different companies and roles
            </p>
          </motion.div>

          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="relative bg-bg/60 backdrop-blur-sm border border-dimmed/15 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 transition-all duration-300 group-hover:border-accent/30 group-hover:bg-bg/80 group-hover:shadow-lg">

                  <div className="absolute left-0 top-3 bottom-3 sm:top-4 sm:bottom-4 md:top-6 md:bottom-6 w-0.5 sm:w-1 bg-gradient-to-b from-accent/50 to-secondary/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    <div className="lg:col-span-2 space-y-2 sm:space-y-3 md:space-y-4">
                      <div>
                        <motion.h3
                          className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-text mb-1 group-hover:text-accent transition-colors duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                          viewport={{ once: true, margin: "-50px" }}
                        >
                          {exp.role}
                        </motion.h3>
                        <motion.div
                          className="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-2 text-dimmed"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                          viewport={{ once: true, margin: "-50px" }}
                        >
                          <span className="font-semibold text-text/90 text-xs sm:text-sm md:text-base">{exp.company}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-accent/80 font-medium text-xs sm:text-sm md:text-base">{exp.type}</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-2 text-dimmed mt-1 md:mt-2"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                          viewport={{ once: true, margin: "-50px" }}
                        >
                          <MapPin size={10} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] text-secondary flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{exp.location}</span>
                        </motion.div>
                      </div>

                      {exp.skills && (
                        <motion.div
                          className="space-y-1.5 sm:space-y-2 md:space-y-3"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                          viewport={{ once: true, margin: "-50px" }}
                        >
                          <div className="flex items-center gap-2 text-dimmed">
                            <Code size={10} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium uppercase tracking-wide">Technologies</span>
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                            {exp.skills.map((skill, skillIndex) => (
                              <motion.span
                                key={skill}
                                className="px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 bg-accent/10 text-accent text-xs sm:text-sm rounded-full border border-accent/20 hover:bg-accent/20 hover:border-accent/40 transition-all duration-200 cursor-default"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: index * 0.1 + skillIndex * 0.05 + 0.6,
                                  duration: 0.3
                                }}
                                viewport={{ once: true, margin: "-50px" }}
                                whileHover={{ scale: 1.05 }}
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="lg:col-span-1 flex flex-col items-start lg:items-end justify-start mt-1 sm:mt-2 lg:mt-0">
                      <motion.div
                        className="text-left lg:text-right"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        viewport={{ once: true, margin: "-50px" }}
                      >
                        <div className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 bg-secondary/10 text-secondary px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-secondary/20 font-medium text-xs sm:text-sm">
                          <Calendar size={10} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] flex-shrink-0" />
                          <span className="whitespace-nowrap">{exp.period}</span>
                        </div>
                      </motion.div>

                      <motion.div
                        className="mt-1.5 sm:mt-2 md:mt-4 flex items-center gap-1.5 sm:gap-2 text-dimmed"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                        viewport={{ once: true, margin: "-50px" }}
                      >
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent rounded-full animate-pulse flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm">
                          {index === 0 ? 'Current Role' : 'Previous Role'}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/10 via-secondary/10 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
                </div>

                {index < experiences.length - 1 && (
                  <motion.div
                    className="absolute left-4 sm:left-6 md:left-8 -bottom-2 sm:-bottom-3 md:-bottom-4 w-0.5 h-4 sm:h-6 md:h-8 bg-gradient-to-b from-dimmed/30 to-transparent"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ delay: index * 0.1 + 0.8, duration: 0.5 }}
                    viewport={{ once: true, margin: "-50px" }}
                    style={{ transformOrigin: "top" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center flex justify-center items-center py-8 sm:py-12 md:py-16"
        >
          <div className="relative max-w-4xl mx-auto px-4">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-secondary/5 to-accent/5 blur-3xl rounded-full pointer-events-none"></div>

            <motion.div
              className="relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-4">
                Ready to work together?
              </h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-dimmed mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-2">
                Let's create something amazing together. I'm available for freelance projects,
                full-time opportunities, and consulting work.
              </p>
              <a href="/contact" className="flex justify-center items-center">
                <Button
                  variant="outline"
                  className="justify-center border-secondary text-secondary hover:bg-secondary/10 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm md:text-base"
                >
                  Let's Talk
                  <Link size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </Button>
              </a>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}