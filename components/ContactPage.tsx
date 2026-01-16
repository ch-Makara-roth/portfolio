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

  // Ensure particles only render after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      turnstileToken: '',
      phone: '',
      company: '',
      website: '',
      budget: '',
      timeline: '',
    }
  })

  const onSubmit = async (data: ContactForm) => {
    if (!turnstileToken) {
      setTurnstileError('Please complete the security verification')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          turnstileToken
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        reset()
        setTurnstileToken('')
        setTurnstileError('')
        turnstileRef.current?.reset()
      } else {
        const result = await response.json()
        setSubmitStatus('error')
        console.error('Form submission error:', result)
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Form submission error:', error)
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

  const InputWrapper = ({ children, icon: Icon, error }: { children: React.ReactNode, icon: LucideIcon, error?: string }) => (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dimmed/60 group-focus-within:text-accent transition-colors z-10">
        <Icon size={18} />
      </div>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mt-2 flex items-center gap-1"
        >
          <AlertCircle size={12} />
          {error}
        </motion.p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        {isMounted && particlePositions.map((pos, i) => (
          <FloatingParticle key={i} delay={i * 0.5} left={pos.left} xOffset={pos.xOffset} />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
          >
            <Sparkles size={16} className="text-accent" />
            <span className="text-sm text-accent font-medium">Let&apos;s Connect</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-6">
            <span className="bg-gradient-to-r from-text via-accent to-secondary bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
              Get In Touch
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-dimmed max-w-2xl mx-auto leading-relaxed">
            Ready to bring your ideas to life? Let&apos;s discuss your project and create something extraordinary together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Form - Takes 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lg:col-span-3"
          >
            <Card className="relative bg-gradient-to-br from-bg/80 via-bg/60 to-bg/80 border-dimmed/10 backdrop-blur-xl p-6 sm:p-8 md:p-10 overflow-hidden">
              {/* Decorative corner gradients */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/10 to-transparent rounded-tr-full" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center shadow-lg shadow-accent/20">
                    <Send size={20} className="text-bg" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-text">Send a Message</h2>
                    <p className="text-dimmed text-sm">I&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Required Fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputWrapper icon={User} error={errors.name?.message}>
                      <Input
                        {...register('name')}
                        placeholder="Your Name"
                        className="w-full bg-bg/60 border-dimmed/20 text-text placeholder-dimmed/50 h-12 pl-12 rounded-xl focus:border-accent/50 focus:ring-accent/20 transition-all"
                      />
                    </InputWrapper>

                    <InputWrapper icon={AtSign} error={errors.email?.message}>
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="Your Email"
                        className="w-full bg-bg/60 border-dimmed/20 text-text placeholder-dimmed/50 h-12 pl-12 rounded-xl focus:border-accent/50 focus:ring-accent/20 transition-all"
                      />
                    </InputWrapper>
                  </div>

                  <InputWrapper icon={FileText} error={errors.subject?.message}>
                    <Input
                      {...register('subject')}
                      placeholder="Subject"
                      className="w-full bg-bg/60 border-dimmed/20 text-text placeholder-dimmed/50 h-12 pl-12 rounded-xl focus:border-accent/50 focus:ring-accent/20 transition-all"
                    />
                  </InputWrapper>

                  {/* Optional Fields Toggle */}
                  <motion.button
                    type="button"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    className="flex items-center gap-2 text-sm text-dimmed hover:text-accent transition-colors group"
                  >
                    <motion.div
                      animate={{ rotate: showOptionalFields ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                    <span>Additional Details (Optional)</span>
                    <div className="h-px flex-1 bg-dimmed/20 group-hover:bg-accent/20 transition-colors" />
                  </motion.button>

                  {/* Optional Fields Section */}
                  <AnimatePresence>
                    {showOptionalFields && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div className="grid sm:grid-cols-2 gap-4">
                          <InputWrapper icon={Phone}>
                            <Input
                              {...register('phone')}
                              type="tel"
                              placeholder="Phone Number"
                              className="w-full bg-bg/60 border-dimmed/20 text-text placeholder-dimmed/50 h-12 pl-12 rounded-xl focus:border-accent/50 focus:ring-accent/20 transition-all"
                            />
                          </InputWrapper>

                          <InputWrapper icon={Building2}>
                            <Input
                              {...register('company')}
                              placeholder="Company Name"
                              className="w-full bg-bg/60 border-dimmed/20 text-text placeholder-dimmed/50 h-12 pl-12 rounded-xl focus:border-accent/50 focus:ring-accent/20 transition-all"
                            />
                          </InputWrapper>
                        </div>

                        <InputWrapper icon={Globe} error={errors.website?.message}>
                          <Input
                            {...register('website')}
                            type="url"
                            placeholder="Website URL"
                            className="w-full bg-bg/60 border-dimmed/20 text-text placeholder-dimmed/50 h-12 pl-12 rounded-xl focus:border-accent/50 focus:ring-accent/20 transition-all"
                          />
                        </InputWrapper>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dimmed/60 group-focus-within:text-accent transition-colors z-10">
                              <DollarSign size={18} />
                            </div>
                            <select
                              {...register('budget')}
                              className="w-full bg-bg/60 border border-dimmed/20 text-text h-12 pl-12 pr-4 rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer"
                            >
                              {budgetOptions.map((option) => (
                                <option key={option.value} value={option.value} className="bg-bg text-text">
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dimmed/60 group-focus-within:text-accent transition-colors z-10">
                              <Calendar size={18} />
                            </div>
                            <select
                              {...register('timeline')}
                              className="w-full bg-bg/60 border border-dimmed/20 text-text h-12 pl-12 pr-4 rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer"
                            >
                              {timelineOptions.map((option) => (
                                <option key={option.value} value={option.value} className="bg-bg text-text">
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Message Field */}
                  <div className="relative group">
                    <div className="absolute left-4 top-4 text-dimmed/60 group-focus-within:text-accent transition-colors">
                      <MessageSquare size={18} />
                    </div>
                    <textarea
                      {...register('message')}
                      placeholder="Tell me about your project..."
                      rows={5}
                      className="w-full bg-bg/60 border border-dimmed/20 rounded-xl pl-12 pr-4 py-4 text-text placeholder-dimmed/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                    />
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-2 flex items-center gap-1"
                      >
                        <AlertCircle size={12} />
                        {errors.message.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Turnstile Widget */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                        options={{
                          theme: 'dark',
                          size: 'normal',
                        }}
                        onSuccess={handleTurnstileSuccess}
                        onError={handleTurnstileError}
                        onExpire={handleTurnstileExpire}
                      />
                      {/* Loading overlay when siteKey is missing */}
                      {!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                        <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <p className="text-red-400 text-sm text-center px-4">
                            Turnstile not configured.<br />Check NEXT_PUBLIC_TURNSTILE_SITE_KEY
                          </p>
                        </div>
                      )}
                    </div>
                    {(errors.turnstileToken || turnstileError) && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs flex items-center gap-1"
                      >
                        <AlertCircle size={12} />
                        {turnstileError || errors.turnstileToken?.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting || !turnstileToken}
                      className="w-full bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 text-bg font-semibold py-4 h-14 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Send size={18} />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>

                  {/* Status Messages */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                      >
                        <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={20} />
                        <p className="text-emerald-400 text-sm">
                          Message sent successfully! I&apos;ll get back to you soon.
                        </p>
                      </motion.div>
                    )}

                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                      >
                        <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                        <p className="text-red-400 text-sm">
                          Something went wrong. Please try again later.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </Card>
          </motion.div>

          {/* Right Sidebar - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Information */}
            <Card className="relative bg-gradient-to-br from-bg/80 via-bg/60 to-bg/80 border-dimmed/10 backdrop-blur-xl p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full" />

              <h3 className="text-lg font-semibold text-text mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Phone size={16} className="text-violet-400" />
                </div>
                Contact Info
              </h3>

              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="group"
                    >
                      <div className={`flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r ${info.gradient} hover:scale-[1.02] transition-transform`}>
                        <div className="w-10 h-10 rounded-xl bg-bg/50 flex items-center justify-center flex-shrink-0">
                          <Icon size={18} className={info.iconColor} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-dimmed text-xs uppercase tracking-wide">{info.label}</p>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-text hover:text-accent transition-colors text-sm font-medium truncate block"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-text text-sm font-medium">{info.value}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="relative bg-gradient-to-br from-bg/80 via-bg/60 to-bg/80 border-dimmed/10 backdrop-blur-xl p-6 overflow-hidden">
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full" />

              <h3 className="text-lg font-semibold text-text mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Globe size={16} className="text-blue-400" />
                </div>
                Connect With Me
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br ${social.gradient} ${social.hoverGradient} transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      <Icon size={22} className="text-white" />
                      <span className="text-xs text-white/80 font-medium">{social.name}</span>
                    </motion.a>
                  )
                })}
              </div>
            </Card>

            {/* CTA Card */}
            <Card className="relative bg-gradient-to-br from-accent/10 via-secondary/10 to-accent/5 border-accent/20 backdrop-blur-xl p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-secondary/5" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                    <Sparkles size={18} className="text-bg" />
                  </div>
                  <h3 className="text-lg font-semibold text-text">Let&apos;s Create Magic</h3>
                </div>

                <p className="text-dimmed text-sm leading-relaxed mb-4">
                  I&apos;m passionate about building innovative solutions. Whether you have a specific project in mind or just want to explore possibilities, I&apos;d love to hear from you.
                </p>

                <div className="flex items-center gap-2 text-accent text-sm font-medium">
                  <span>Response time: 24h</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </Card>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
            >
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div>
                <p className="text-emerald-400 font-medium text-sm">Available for Work</p>
                <p className="text-dimmed text-xs">Open for freelance projects</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}