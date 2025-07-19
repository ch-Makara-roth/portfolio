'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Calendar, MapPin, Coffee, Code, Link, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

const skills = [
  'React', 'Redux', 'Redux Toolkit', 'React Native', 'Next.js', 'TypeScript', 'JavaScript', 'Vue.js', 'Node.js',
  'Laravel', 'PHP', 'Python', 'PostgreSQL', 'MongoDB', 'Cpanel',
  'Docker', 'Vercel', 'Tailwind CSS', 'SCSS', 'Framer Motion',
  'REST APIs', 'GraphQL', 'Socket.io', 'Git', 'Figma', 'Trello',
]

const experiences = [
  {
    role: 'Full Stack Developer',
    type: 'Full Time',
    company: 'Acmcert indochina (Cambodia) co.ltd',
    period: '2024 - Present',
    location: 'Phnom Penh, Cambodia',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Tailwind CSS']
  },
  {
    role: 'Frontend Developer',
    type: 'Full Time ( Internship )',
    company: 'Kilo IT',
    period: '2023 - 2024',
    location: 'Phnom Penh, Cambodia',
    skills: ['React', 'Redux', 'JavaScript', 'Vue.js', 'SCSS', 'Git', 'Figma', 'REST APIs']
  },
  {
    role: 'Game IT',
    type: 'Full Time',
    company: '32nd SEA Games & 12th ASEAN Para Games',
    period: '5 - 16 June, 2023 &&  3 - 9 June, 2023',
    location: 'Phnom Penh, Cambodia',
    skills: ['JavaScript', 'PHP', 'Laravel', 'MongoDB', 'Socket.io', 'Git', 'Trello']
  }
]

const education = [
  {
    degree: 'Bachelor of Computer Science',
    school: 'Royal University of Phnom Penh',
    period: '2020 - 2024',
    location: 'Phnom Penh, Cambodia',
    description: 'Major in Software Engineering'
  },
  {
    degree: 'High School Diploma',
    school: 'Preah Sisowath High School',
    period: '2017 - 2020',
    location: 'Phnom Penh, Cambodia',
    description: 'Science Stream'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 sm:mb-6 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent px-2">
            About Me
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-dimmed max-w-2xl mx-auto px-2 sm:px-4 leading-relaxed">
            Get to know more about my journey, skills, and passion for creating digital experiences.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col items-center lg:items-start"
          >
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 mx-auto lg:mx-0 mb-4 sm:mb-6 md:mb-8">
              <Image
                src="https://via.placeholder.com/400x400?text=Makara"
                alt="Chhuon Makara Roth - Full Stack Developer portrait"
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 320px"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEnyLFwzRQV0zFNHqZZLi6yIJhyZCFnJNUKs5lGF7hZm0fRYdDGrXSLDTJVuFZHhZuN7VGWwSzUFGwU4Kp/9k="
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent rounded-2xl" />
            </div>
            
            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center lg:text-left w-full">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-dimmed text-xs sm:text-sm md:text-base">
                <MapPin size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] flex-shrink-0" />
                <span>Phnom Penh, Cambodia</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-dimmed text-xs sm:text-sm md:text-base">
                <Calendar size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] flex-shrink-0" />
                <span>3+ Years Experience</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-dimmed text-xs sm:text-sm md:text-base">
                <Coffee size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] flex-shrink-0" />
                <span>Coffee Lover</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-dimmed text-xs sm:text-sm md:text-base">
                <Code size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] flex-shrink-0" />
                <span className="text-center lg:text-left">Research, Learning, Music, Reading, Traveling</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-accent mb-3 sm:mb-4 md:mb-6 text-center lg:text-left">My Story</h2>
            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-text/80 leading-relaxed text-xs sm:text-sm md:text-base px-2 sm:px-0">
              <p>
                Hi! I'm Makara, a passionate full-stack developer with over 3 years of experience 
                building modern web applications. I love creating intuitive user experiences and 
                robust backend systems.
              </p>
              <p>
                My journey started with a curiosity for how websites work, which led me to dive 
                deep into JavaScript and modern web technologies. I've worked with startups and 
                established companies, helping them bring their digital ideas to life.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, contributing to 
                open-source projects, or enjoying a good cup of coffee while reading about the 
                latest in web development.
              </p>
              <p>
                I believe in writing clean, maintainable code and creating user-centered solutions 
                that make a real impact. Let's build something amazing together!
              </p>
            </div>
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