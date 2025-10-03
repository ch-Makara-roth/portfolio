'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Github, Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type ContactForm = z.infer<typeof contactSchema>

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com/ch-Makara-roth',
    color: 'hover:text-gray-400'
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/in/chhuon-makararoth-b66700262/',
    color: 'hover:text-blue-400'
  },
  {
    name: 'Email',
    icon: Mail,
    url: 'mailto:chhuonmakara@gmail.com',
    color: 'hover:text-red-400'
  }
]

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'chhuonmakara@gmail.com',
    link: 'mailto:chhuonmakara@gmail.com'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+855 81693071',
    link: 'tel:+85581693071'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Phnom Penh, Cambodia',
    link: null
  }
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitStatus('success')
        reset()
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent px-2">
            Contact
          </h1>
          <p className="text-base sm:text-lg text-dimmed max-w-2xl mx-auto px-4 leading-relaxed">
            Ready to start your project? Let's discuss your ideas and create something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Card className="bg-bg/50 border-dimmed/20 backdrop-blur-sm p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-accent mb-4 sm:mb-6">Get In Touch</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div>
                  <Input
                    {...register('name')}
                    placeholder="Your Name"
                    className="w-full bg-bg/50 border-dimmed/40 text-text placeholder-dimmed h-10 sm:h-12 text-sm sm:text-base"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-bg/50 border-dimmed/40 text-text placeholder-dimmed h-10 sm:h-12 text-sm sm:text-base"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Input
                    {...register('subject')}
                    placeholder="Subject"
                    className="w-full bg-bg/50 border-dimmed/40 text-text placeholder-dimmed h-10 sm:h-12 text-sm sm:text-base"
                  />
                  {errors.subject && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <textarea
                    {...register('message')}
                    placeholder="Your Message"
                    rows={4}
                    className="w-full bg-bg/50 border border-dimmed/40 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-text placeholder-dimmed focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-sm sm:text-base resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent/80 text-bg font-semibold py-2.5 sm:py-3 md:py-4 rounded-xl disabled:opacity-50 text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span>Send Message</span>
                    </div>
                  )}
                </Button>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-center text-sm sm:text-base"
                  >
                    Message sent successfully! I'll get back to you soon.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-center text-sm sm:text-base"
                  >
                    Something went wrong. Please try again later.
                  </motion.div>
                )}
              </form>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            <Card className="bg-bg/50 border-dimmed/20 backdrop-blur-sm p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-accent mb-4 sm:mb-6">Contact Information</h3>
              <div className="space-y-3 sm:space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon
                  return (
                    <div key={info.label} className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="sm:w-5 sm:h-5 text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-dimmed text-xs sm:text-sm">{info.label}</p>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-text hover:text-accent transition-colors text-sm sm:text-base break-words"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-text text-sm sm:text-base">{info.value}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="bg-bg/50 border-dimmed/20 backdrop-blur-sm p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-accent mb-4 sm:mb-6">Follow Me</h3>
              <div className="flex gap-3 sm:gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 sm:w-12 sm:h-12 bg-dimmed/10 rounded-xl flex items-center justify-center text-dimmed hover:bg-accent/10 transition-all duration-300 ${social.color} min-w-[40px] sm:min-w-[48px]`}
                    >
                      <Icon size={18} className="sm:w-5 sm:h-5" />
                    </a>
                  )
                })}
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-accent/10 to-secondary/10 border-accent/20 backdrop-blur-sm p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-text mb-3 sm:mb-4">Let's Build Something Great</h3>
              <p className="text-dimmed text-xs sm:text-sm leading-relaxed">
                I'm always excited to work on new projects and collaborate with amazing people. 
                Whether you have a specific idea in mind or just want to explore possibilities, 
                I'd love to hear from you.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 