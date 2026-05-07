'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, MapPin, Send, Sparkles, CheckCircle2, AlertCircle, ChevronDown, Building2, Globe, Calendar, DollarSign } from 'lucide-react'
import { Github, Linkedin } from '@/components/icons/brand-icons'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'

const EMAIL_ADDRESS = 'chhuonmakara@gmail.com'
const EMAIL_DISPLAY = EMAIL_ADDRESS
const EMAIL_ACTION = `mailto:${EMAIL_ADDRESS}`

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
    url: EMAIL_ACTION,
    gradient: 'from-rose-500 to-pink-600',
    hoverGradient: 'hover:from-rose-400 hover:to-pink-500',
  }
]

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: EMAIL_DISPLAY,
    link: EMAIL_ACTION,
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

  const handleContactAction = (href: string) => {
    window.location.href = href
  }

  return (
    <div className="min-h-screen overflow-hidden bg-bg px-4 py-18 sm:px-6 md:py-16 lg:px-8 lg:py-28">
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
        <div className="mb-12 flex flex-col justify-between gap-6 sm:gap-8 md:mb-24 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1">
              <Sparkles size={14} className="text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Open for collaboration</span>
            </div>
            <h1 className="mb-5 text-4xl font-black leading-[0.95] tracking-tighter sm:text-5xl md:text-7xl lg:text-8xl">
              Let&apos;s build <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
                something great.
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-dimmed sm:text-lg md:text-xl">
              Have a project in mind? Looking for a partner to bring your vision to life?
              I&apos;m currently taking on new projects and would love to hear from you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex shrink-0 flex-col items-start gap-2 md:items-end"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Available now</span>
            </div>
            <p className="text-sm text-dimmed">Response within 24h</p>
          </motion.div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Main Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-7"
          >
            <Card className="overflow-hidden rounded-[1.75rem] border-none bg-gradient-to-br from-accent/20 via-transparent to-secondary/20 p-1 shadow-2xl backdrop-blur-3xl sm:rounded-[2.5rem]">
              <div className="relative h-full overflow-hidden rounded-[1.6rem] bg-bg/90 p-5 sm:rounded-[2.4rem] sm:p-8 md:p-12 lg:p-16">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-6 sm:space-y-8">
                  <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Full Name</label>
                      <input
                        {...register('name')}
                        placeholder="John Doe"
                          className="h-14 w-full border-b-2 border-dimmed/10 bg-bg/50 px-1 text-text outline-none transition-all placeholder:text-dimmed/30 focus:border-accent"
                      />
                      {errors.name && <p className="text-[10px] text-red-400 mt-1 font-bold uppercase">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Email Address</label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="john@example.com"
                          className="h-14 w-full border-b-2 border-dimmed/10 bg-bg/50 px-1 text-text outline-none transition-all placeholder:text-dimmed/30 focus:border-accent"
                      />
                      {errors.email && <p className="text-[10px] text-red-400 mt-1 font-bold uppercase">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Subject</label>
                    <input
                      {...register('subject')}
                      placeholder="Project Inquiry"
                      className="h-14 w-full border-b-2 border-dimmed/10 bg-bg/50 px-1 text-text outline-none transition-all placeholder:text-dimmed/30 focus:border-accent"
                    />
                    {errors.subject && <p className="text-[10px] text-red-400 mt-1 font-bold uppercase">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Message</label>
                    <textarea
                      {...register('message')}
                      placeholder="Tell me about your amazing project..."
                      rows={4}
                      className="w-full resize-none border-b-2 border-dimmed/10 bg-bg/50 px-1 py-4 text-text outline-none transition-all placeholder:text-dimmed/30 focus:border-accent"
                    />
                    {errors.message && <p className="text-[10px] text-red-400 mt-1 font-bold uppercase">{errors.message.message}</p>}
                  </div>

                  {/* Optional project details toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowOptionalFields(v => !v)}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dimmed hover:text-accent transition-colors"
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${showOptionalFields ? 'rotate-180' : ''}`}
                      />
                      {showOptionalFields ? 'Hide' : 'Add'} project details (optional)
                    </button>

                    <AnimatePresence>
                      {showOptionalFields && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                           className="overflow-hidden"
                         >
                           <div className="grid gap-6 pt-6 sm:grid-cols-2 sm:gap-8 sm:pt-8">
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Company</label>
                              <div className="relative">
                                <Building2 size={14} className="absolute left-1 top-1/2 -translate-y-1/2 text-dimmed/40" />
                                <input
                                  {...register('company')}
                                  placeholder="Acme Inc."
                                   className="h-12 w-full border-b-2 border-dimmed/10 bg-bg/50 pl-6 text-text outline-none transition-all placeholder:text-dimmed/30 focus:border-accent"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Phone</label>
                              <input
                                {...register('phone')}
                                type="tel"
                                placeholder="+1 234 567 890"
                                   className="h-12 w-full border-b-2 border-dimmed/10 bg-bg/50 px-1 text-text outline-none transition-all placeholder:text-dimmed/30 focus:border-accent"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Website</label>
                              <div className="relative">
                                <Globe size={14} className="absolute left-1 top-1/2 -translate-y-1/2 text-dimmed/40" />
                                <input
                                  {...register('website')}
                                  type="url"
                                  placeholder="https://yoursite.com"
                                   className="h-12 w-full border-b-2 border-dimmed/10 bg-bg/50 pl-6 text-text outline-none transition-all placeholder:text-dimmed/30 focus:border-accent"
                                />
                              </div>
                              {errors.website && <p className="text-[10px] text-red-400 mt-1 font-bold uppercase">{errors.website.message}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Budget</label>
                              <div className="relative">
                                <DollarSign size={14} className="absolute left-1 top-1/2 -translate-y-1/2 text-dimmed/40 pointer-events-none" />
                                <select
                                  {...register('budget')}
                                   className="h-12 w-full appearance-none border-b-2 border-dimmed/10 bg-bg/50 pl-6 text-text outline-none transition-all focus:border-accent"
                                >
                                  {budgetOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-dimmed ml-1">Timeline</label>
                              <div className="relative">
                                <Calendar size={14} className="absolute left-1 top-1/2 -translate-y-1/2 text-dimmed/40 pointer-events-none" />
                                <select
                                  {...register('timeline')}
                                   className="h-12 w-full appearance-none border-b-2 border-dimmed/10 bg-bg/50 pl-6 text-text outline-none transition-all focus:border-accent"
                                >
                                  {timelineOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex flex-col items-stretch justify-between gap-6 pt-4 sm:flex-row sm:items-center sm:gap-8 sm:pt-6">
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
                      className="group relative h-14 w-full overflow-hidden rounded-full bg-text px-8 font-black text-bg transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:h-16 sm:w-auto sm:px-10 sm:hover:pr-14"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                        {!isSubmitting && <Send size={20} className="group-hover:translate-x-2 transition-transform" />}
                      </span>
                      <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                  </div>

                  {/* Status Overlays */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[1.6rem] bg-bg/95 p-6 text-center sm:rounded-[2.4rem] sm:p-12">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle2 size={40} className="text-bg" />
                        </div>
                        <h3 className="mb-4 text-2xl font-black sm:text-3xl">Message Sparked!</h3>
                        <p className="text-dimmed leading-relaxed">Your message has been sent successfully. I&apos;ll get back to you within 24 hours.</p>
                        <Button onClick={() => setSubmitStatus('idle')} variant="outline" className="mt-8 rounded-full px-8">Send another</Button>
                      </motion.div>
                    )}
                    {submitStatus === 'error' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[1.6rem] bg-bg/95 p-6 text-center sm:rounded-[2.4rem] sm:p-12">
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6">
                          <AlertCircle size={40} className="text-bg" />
                        </div>
                        <h3 className="mb-4 text-2xl font-black sm:text-3xl">Oops! Something went wrong</h3>
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
          <div className="space-y-6 sm:space-y-8 lg:col-span-5">
            {/* Dynamic Status Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative overflow-hidden rounded-[1.5rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 sm:rounded-[2rem] sm:p-8"
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
              <h3 className="mb-2 text-xl font-bold sm:text-2xl">Available for Work</h3>
              <p className="text-dimmed text-sm leading-relaxed max-w-xs">
                I&apos;m currently accepting new freelance and full-time opportunities. Expected response time: <strong className="text-text">Under 24h</strong>.
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
                const isEmailLink = info.link?.startsWith('mailto:')

                return (
                  isEmailLink ? (
                    <button
                      key={info.label}
                      type="button"
                      onClick={() => handleContactAction(info.link!)}
                      aria-label={`Send an email to ${EMAIL_ADDRESS}`}
                      className="group flex w-full flex-col gap-4 rounded-[1.5rem] border border-dimmed/10 bg-bg/50 p-5 text-left transition-all duration-300 hover:border-accent hover:bg-bg/80 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-dimmed/5 transition-all group-hover:scale-110 group-hover:bg-accent/10 sm:h-14 sm:w-14">
                          <Icon size={24} className="text-dimmed group-hover:text-accent" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="mb-1 text-[10px] font-black uppercase tracking-widest text-dimmed">{info.label}</span>
                          <span className="break-all text-sm font-medium text-text transition-transform group-hover:translate-x-1 sm:text-base sm:break-normal">{info.value}</span>
                        </div>
                      </div>
                      <Send size={16} className="transform self-end -rotate-45 text-dimmed/30 transition-all group-hover:text-accent sm:self-auto sm:opacity-0 sm:group-hover:opacity-100" />
                    </button>
                  ) : (
                    <a
                      key={info.label}
                      href={info.link || '#'}
                      className="group flex flex-col gap-4 rounded-[1.5rem] border border-dimmed/10 bg-bg/50 p-5 transition-all duration-300 hover:border-accent hover:bg-bg/80 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-dimmed/5 transition-all group-hover:scale-110 group-hover:bg-accent/10 sm:h-14 sm:w-14">
                          <Icon size={24} className="text-dimmed group-hover:text-accent" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="mb-1 text-[10px] font-black uppercase tracking-widest text-dimmed">{info.label}</span>
                          <span className="break-all text-sm font-medium text-text transition-transform group-hover:translate-x-1 sm:text-base sm:break-normal">{info.value}</span>
                        </div>
                      </div>
                      <Send size={16} className="transform self-end -rotate-45 text-dimmed/30 transition-all group-hover:text-accent sm:self-auto sm:opacity-0 sm:group-hover:opacity-100" />
                    </a>
                  )
                )
              })}
            </motion.div>

            {/* Social Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-3 gap-3 sm:gap-4"
            >
              {socialLinks.map((social) => {
                const Icon = social.icon
                const isEmailLink = social.url.startsWith('mailto:')

                return (
                  isEmailLink ? (
                    <button
                      key={social.name}
                      type="button"
                      onClick={() => handleContactAction(social.url)}
                      aria-label={`Send an email to ${EMAIL_ADDRESS}`}
                      className="group flex aspect-[1.1/1] flex-col items-center justify-center gap-2 rounded-[1.25rem] border border-dimmed/10 bg-bg/50 px-3 text-center transition-all hover:border-text sm:aspect-square sm:gap-3 sm:rounded-[1.5rem]"
                    >
                      <Icon size={24} className="text-dimmed transition-all group-hover:scale-110 group-hover:text-text" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-dimmed group-hover:text-text">{social.name}</span>
                    </button>
                  ) : (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex aspect-[1.1/1] flex-col items-center justify-center gap-2 rounded-[1.25rem] border border-dimmed/10 bg-bg/50 px-3 text-center transition-all hover:border-text sm:aspect-square sm:gap-3 sm:rounded-[1.5rem]"
                    >
                      <Icon size={24} className="text-dimmed transition-all group-hover:scale-110 group-hover:text-text" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-dimmed group-hover:text-text">{social.name}</span>
                    </a>
                  )
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
