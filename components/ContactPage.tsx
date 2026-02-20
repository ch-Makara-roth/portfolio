'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Github, Linkedin, Mail, Phone, MapPin, Send, Sparkles, CheckCircle2, AlertCircle, ChevronDown, Building2, Globe, Calendar, DollarSign, User, AtSign, FileText, MessageSquare, LucideIcon } from 'lucide-react'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'
import Image from 'next/image'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  turnstileToken: z.string().min(1, 'Please complete the security verification'),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  budget: z.string().optional(),
  timeline: z.string().optional(),
})

type ContactForm = z.infer<typeof contactSchema>

const budgetOptions = [
  { value: '', label: 'Select budget range' },
  { value: '$1000-$5000', label: '$1,000 - $5,000' },
  { value: '$5000-$10000', label: '$5,000 - $10,000' },
  { value: '$10000-$20000', label: '$10,000 - $20,000' },
  { value: '$20000-$50000', label: '$20,000 - $50,000' },
  { value: '$50000+', label: '$50,000+' },
]

const timelineOptions = [
  { value: '', label: 'Select timeline' },
  { value: '1-2 weeks', label: '1-2 weeks' },
  { value: '2-4 weeks', label: '2-4 weeks' },
  { value: '1-2 months', label: '1-2 months' },
  { value: '3-4 months', label: '3-4 months' },
  { value: '6+ months', label: '6+ months' },
]

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com/ch-Makara-roth',
    gradient: 'from-gray-600 to-gray-800',
    hoverGradient: 'hover:from-gray-500 hover:to-gray-700',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/in/chhuon-makararoth-b66700262/',
    gradient: 'from-blue-500 to-blue-700',
    hoverGradient: 'hover:from-blue-400 hover:to-blue-600',
  },
  {
    name: 'Email',
    icon: Mail,
    url: 'mailto:chhuonmakara@gmail.com',
    gradient: 'from-rose-500 to-pink-600',
    hoverGradient: 'hover:from-rose-400 hover:to-pink-500',
  }
]

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'chhuonmakara@gmail.com',
    link: 'mailto:chhuonmakara@gmail.com',
    gradient: 'from-rose-500/20 to-pink-500/20',
    iconColor: 'text-rose-400',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+855 81693071',
    link: 'tel:+85581693071',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Phnom Penh, Cambodia',
    link: null,
    gradient: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-400',
  }
]

// Pre-calculated particle positions to avoid hydration mismatch
const particlePositions = [
  { left: 8, xOffset: 15 },
  { left: 16, xOffset: -12 },
  { left: 25, xOffset: 8 },
  { left: 33, xOffset: -18 },
  { left: 42, xOffset: 12 },
  { left: 50, xOffset: -8 },
  { left: 58, xOffset: 18 },
  { left: 67, xOffset: -15 },
  { left: 75, xOffset: 10 },
  { left: 83, xOffset: -10 },
  { left: 91, xOffset: 5 },
  { left: 97, xOffset: -5 },
]

// Floating particles for background
const FloatingParticle = ({ delay, left, xOffset }: { delay: number, left: number, xOffset: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-accent/30"
    initial={{ opacity: 0, y: 100 }}
    animate={{
      opacity: [0, 1, 0],
      y: [-20, -100],
      x: [0, xOffset],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
    style={{
      left: `${left}%`,
      bottom: 0,
    }}
  />
)

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const [turnstileError, setTurnstileError] = useState<string>('')
  const [showOptionalFields, setShowOptionalFields] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const turnstileRef = useRef<TurnstileInstance>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '', email: '', subject: '', message: '', turnstileToken: '',
      phone: '', company: '', website: '', budget: '', timeline: '',
    }
  })

  const onSubmit = async (data: ContactForm) => {
    if (!turnstileToken) {
      setTurnstileError('Please complete verification')
      return
    }
    setIsSubmitting(true)
    setSubmitStatus('idle')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }),
      })
      if (response.ok) {
        setSubmitStatus('success')
        reset(); setTurnstileToken(''); turnstileRef.current?.reset()
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token)
    setValue('turnstileToken', token)
    setTurnstileError('')
  }

  const handleTurnstileError = () => {
    setTurnstileToken('')
    setValue('turnstileToken', '')
    setTurnstileError('Security verification failed. Please try again.')
  }

  const handleTurnstileExpire = () => {
    setTurnstileToken('')
    setValue('turnstileToken', '')
    setTurnstileError('Verification expired. Please complete it again.')
  }

  return (
    <div className="min-h-screen py-12 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-bg">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
        {isMounted && particlePositions.map((pos, i) => (
          <FloatingParticle key={i} delay={i * 0.5} left={pos.left} xOffset={pos.xOffset} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Sparkles size={14} className="text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Open for collaboration</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter">
              Let&apos;s build <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
                something great.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dimmed leading-relaxed">
              Have a project in mind? Looking for a partner to bring your vision to life?
              I&apos;m currently taking on new projects and would love to hear from you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col items-start md:items-end gap-4"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-bg bg-dimmed/20 overflow-hidden">
                  <Image
                    src={`/avatars/avatar-${i}.png`}
                    alt="client"
                    width={48}
                    height={48}
                    className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-bg bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                +15
              </div>
            </div>
            <p className="text-sm font-medium text-dimmed">Trusted by clients worldwide</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Main Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-7"
          >
            <Card className="p-1 rounded-[2.5rem] bg-gradient-to-br from-accent/20 via-transparent to-secondary/20 overflow-hidden backdrop-blur-3xl border-none shadow-2xl">
              <div className="bg-bg/90 p-8 sm:p-12 md:p-16 rounded-[2.4rem] relative overflow-hidden h-full">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Full Name</label>
                      <input
                        {...register('name')}
                        placeholder="John Doe"
                        className="w-full bg-bg/50 border-b-2 border-dimmed/10 focus:border-accent text-text h-14 outline-none transition-all px-1 placeholder:text-dimmed/30"
                      />
                      {errors.name && <p className="text-[10px] text-red-400 mt-1 font-bold uppercase">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Email Address</label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="john@example.com"
                        className="w-full bg-bg/50 border-b-2 border-dimmed/10 focus:border-accent text-text h-14 outline-none transition-all px-1 placeholder:text-dimmed/30"
                      />
                      {errors.email && <p className="text-[10px] text-red-400 mt-1 font-bold uppercase">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Subject</label>
                    <input
                      {...register('subject')}
                      placeholder="Project Inquiry"
                      className="w-full bg-bg/50 border-b-2 border-dimmed/10 focus:border-accent text-text h-14 outline-none transition-all px-1 placeholder:text-dimmed/30"
                    />
                    {errors.subject && <p className="text-[10px] text-red-400 mt-1 font-bold uppercase">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Message</label>
                    <textarea
                      {...register('message')}
                      placeholder="Tell me about your amazing project..."
                      rows={4}
                      className="w-full bg-bg/50 border-b-2 border-dimmed/10 focus:border-accent text-text py-4 outline-none transition-all px-1 resize-none placeholder:text-dimmed/30"
                    />
                    {errors.message && <p className="text-[10px] text-red-400 mt-1 font-bold uppercase">{errors.message.message}</p>}
                  </div>

                  {/* Anti-Spam & Send */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-6">
                    <div className="w-full sm:w-auto overflow-hidden rounded-xl border border-dimmed/10">
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                        options={{ theme: 'dark', size: 'flexible' }}
                        onSuccess={handleTurnstileSuccess}
                        onError={handleTurnstileError}
                        onExpire={handleTurnstileExpire}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !turnstileToken}
                      className="group relative w-full sm:w-auto h-16 px-10 rounded-full bg-text text-bg font-black overflow-hidden transition-all hover:pr-14 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                        {!isSubmitting && <Send size={20} className="group-hover:translate-x-2 transition-transform" />}
                      </span>
                      <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                  </div>

                  {/* Status Overlays */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-bg/95 flex flex-col items-center justify-center p-12 text-center rounded-[2.4rem] z-50">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle2 size={40} className="text-bg" />
                        </div>
                        <h3 className="text-3xl font-black mb-4">Message Sparked!</h3>
                        <p className="text-dimmed leading-relaxed">Your message has been sent successfully. I&apos;ll get back to you within 24 hours.</p>
                        <Button onClick={() => setSubmitStatus('idle')} variant="outline" className="mt-8 rounded-full px-8">Send another</Button>
                      </motion.div>
                    )}
                    {submitStatus === 'error' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-bg/95 flex flex-col items-center justify-center p-12 text-center rounded-[2.4rem] z-50">
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6">
                          <AlertCircle size={40} className="text-bg" />
                        </div>
                        <h3 className="text-3xl font-black mb-4">Oops! Something went wrong</h3>
                        <p className="text-dimmed leading-relaxed">I couldn&apos;t receive your message. Please try again or email me directly.</p>
                        <Button onClick={() => setSubmitStatus('idle')} variant="outline" className="mt-8 rounded-full px-8">Try again</Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </Card>
          </motion.div>

          {/* Connect Section */}
          <div className="lg:col-span-5 space-y-8">
            {/* Dynamic Status Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Calendar size={120} />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Current Status</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Available for Work</h3>
              <p className="text-dimmed text-sm leading-relaxed max-w-xs">
                I&apos;m currently accepting new freelance and full-time opportunities. Expected response time: **Under 24h**.
              </p>
            </motion.div>

            {/* Quick Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-4"
            >
              {contactInfo.map((info) => {
                const Icon = info.icon
                return (
                  <a
                    key={info.label}
                    href={info.link || '#'}
                    className="group flex items-center justify-between p-6 rounded-[1.5rem] bg-bg/50 border border-dimmed/10 hover:border-accent hover:bg-bg/80 transition-all duration-300"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-dimmed/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/10 transition-all">
                        <Icon size={24} className="text-dimmed group-hover:text-accent" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-dimmed mb-1">{info.label}</span>
                        <span className="text-text font-medium group-hover:translate-x-1 transition-transform">{info.value}</span>
                      </div>
                    </div>
                    <Send size={16} className="text-dimmed/30 opacity-0 group-hover:opacity-100 group-hover:text-accent transform -rotate-45 transition-all" />
                  </a>
                )
              })}
            </motion.div>

            {/* Social Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-3 gap-4"
            >
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square flex flex-col items-center justify-center gap-3 rounded-[1.5rem] bg-bg/50 border border-dimmed/10 hover:border-text transition-all group"
                  >
                    <Icon size={24} className="text-dimmed group-hover:text-text group-hover:scale-110 transition-all" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-dimmed group-hover:text-text">{social.name}</span>
                  </a>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}