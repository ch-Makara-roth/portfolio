'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Code,
    Smartphone,
    Palette,
    Database,
    Globe,
    Shield,
    ArrowLeft,
    CheckCircle2,
    ArrowRight,
    Zap,
    Layers,
    Sparkles
} from 'lucide-react'
import { mockServices } from '@/lib/mockData'
import { useRef } from 'react'

const iconMap: Record<string, any> = {
    Code,
    Smartphone,
    Palette,
    Database,
    Globe,
    Shield
}

interface PageProps {
    params: {
        slug: string
    }
}

export default function ServiceDetailPage({ params }: PageProps) {
    const service = mockServices.find(s => s.slug === params.slug)
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [0, 100])

    if (!service) {
        return null
    }

    const Icon = iconMap[service.icon] || Code

    return (
        <div className="relative min-h-screen bg-bg overflow-hidden" ref={containerRef}>
            {/* Dynamic Background */}
            <ServiceBackground color={service.color} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                {/* Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 sm:mb-12"
                >
                    <Button asChild variant="ghost" className="group text-dimmed hover:text-text hover:bg-white/5 pl-2 pr-4 rounded-full transition-all">
                        <Link href="/services">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-2 group-hover:bg-accent group-hover:text-white transition-colors">
                                <ArrowLeft className="h-4 w-4" />
                            </div>
                            Back to Services
                        </Link>
                    </Button>
                </motion.div>

                {/* Hero Section */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center mb-14 sm:mb-20 lg:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${service.color} bg-opacity-10 border border-accent/20 mb-5 sm:mb-6 text-accent/80 text-xs sm:text-sm font-medium`}
                        >
                            <Sparkles size={13} />
                            <span>Premium Service</span>
                        </motion.div>

                        <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight">
                            {service.title.split(' ').map((word, i) => (
                                <span key={i} className="block bg-clip-text text-transparent bg-gradient-to-r from-text via-text/90 to-dimmed">
                                    {word}
                                </span>
                            ))}
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-dimmed leading-relaxed mb-6 sm:mb-8 max-w-xl">
                            {service.description}
                        </p>

                        <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                            <Button asChild size="lg" className={`bg-gradient-to-r ${service.color} text-white hover:opacity-90 border-0 shadow-lg shadow-accent/20 rounded-xl px-6 sm:px-8 text-sm sm:text-base w-full xs:w-auto`}>
                                <Link href="/contact">
                                    Start Project
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-dimmed/20 hover:bg-white/5 rounded-xl px-6 sm:px-8 text-sm sm:text-base w-full xs:w-auto">
                                <Link href="/projects">
                                    View Portfolio
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Desktop: Decorative feature card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-[3rem] blur-3xl transform rotate-6" />
                        <Card className="relative bg-bg/40 backdrop-blur-xl border-white/10 p-12 rounded-[2.5rem] shadow-2xl overflow-hidden group hover:border-accent/30 transition-colors duration-500">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Icon size={200} />
                            </div>
                            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-8 shadow-inner`}>
                                <Icon size={48} className="text-white drop-shadow-md" />
                            </div>
                            <div className="space-y-4">
                                {service.features.map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                                        <span className="text-text/90 font-medium">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Mobile/Tablet: Inline features grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="block lg:hidden"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                                <Icon size={22} className="text-white" />
                            </div>
                            <h2 className="text-sm font-semibold text-dimmed uppercase tracking-widest">What's Included</h2>
                        </div>
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
                            {service.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                    <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
                                    <span className="text-sm text-text/90">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Workflow Steps */}
                <div className="mb-14 sm:mb-20 lg:mb-32 relative">
                    <div className="text-center mb-10 sm:mb-14 lg:mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-2xl sm:text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-secondary inline-block mb-3 sm:mb-4"
                        >
                            Workflow
                        </motion.h2>
                        <p className="text-sm sm:text-base text-dimmed max-w-2xl mx-auto">
                            A transparent, agile process designed to deliver exceptional results.
                        </p>
                    </div>

                    {/* Mobile: left-rail timeline */}
                    <div className="block lg:hidden">
                        <div className="relative pl-8">
                            {/* Vertical rail */}
                            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-accent/30 to-transparent" />
                            <div className="space-y-6">
                                {service.workflow.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="relative"
                                    >
                                        {/* Node */}
                                        <div className="absolute -left-8 top-4 flex items-center justify-center w-6 h-6">
                                            <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(100,255,218,0.5)] z-10" />
                                            <div className="absolute w-5 h-5 rounded-full border border-accent/30 animate-pulse" />
                                        </div>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-accent/30 transition-all duration-300">
                                            <h3 className="text-base font-bold text-text mb-1.5">{item.title}</h3>
                                            <p className="text-dimmed text-sm leading-relaxed">{item.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop: zig-zag layout */}
                    <div className="hidden lg:block">
                        <div className="space-y-0 relative">
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent transform -translate-x-1/2" />
                            {service.workflow.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6 }}
                                    className={`flex flex-row gap-8 items-center ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className="flex-1 w-1/2 flex justify-end">
                                        <div className={`w-full max-w-md p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 group ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                            <h3 className="text-xl font-bold text-text mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                                            <p className="text-dimmed text-sm leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
                                        <div className="w-4 h-4 rounded-full bg-accent shadow-[0_0_15px_rgba(100,255,218,0.5)] z-10" />
                                        <div className="absolute w-12 h-12 rounded-full border border-accent/20 animate-pulse" />
                                    </div>
                                    <div className="flex-1 w-1/2" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Process Bento Grid */}
                <section className="mb-14 sm:mb-20 lg:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-8 sm:mb-12"
                    >
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-1 sm:mb-2">Detailed Process</h2>
                            <p className="text-sm sm:text-base text-dimmed">Step-by-step execution plan</p>
                        </div>
                        <Layers className="text-accent/50 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                        {service.process.map((step, index) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl blur-xl" />
                                <Card className="relative h-full bg-bg/60 backdrop-blur-md border border-white/5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-accent/40 transition-all duration-500 hover:-translate-y-1">
                                    <div className="absolute -right-3 -top-3 text-[80px] sm:text-[120px] font-bold text-white/[0.02] group-hover:text-accent/[0.05] transition-colors leading-none select-none">
                                        {step.step}
                                    </div>
                                    <div className="relative z-10">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                            <span className="font-bold text-xs sm:text-sm">{step.step}</span>
                                        </div>
                                        <h3 className="text-base sm:text-lg font-bold text-text mb-2 sm:mb-3">{step.title}</h3>
                                        <p className="text-xs sm:text-sm text-dimmed group-hover:text-text/80 transition-colors leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-10`} />
                    <div className="absolute inset-0 backdrop-blur-3xl" />
                    <div className="relative z-10 px-5 py-10 sm:px-10 sm:py-16 lg:px-12 lg:py-20 text-center">
                        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 text-text">
                            Ready to <span className="text-accent">Build?</span>
                        </h2>
                        <p className="text-sm sm:text-lg lg:text-xl text-dimmed max-w-2xl mx-auto mb-7 sm:mb-10 leading-relaxed px-2">
                            Transform your digital presence with our expert {service.title} services.
                            Let's create something extraordinary together.
                        </p>
                        <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center">
                            <Button asChild className="h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-text text-bg hover:bg-accent hover:text-white text-sm sm:text-lg font-medium transition-all duration-300 shadow-xl hover:shadow-accent/25 w-full xs:w-auto">
                                <Link href="/contact">
                                    Start Your Project
                                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" className="h-12 sm:h-14 px-6 sm:px-8 rounded-full text-dimmed hover:text-text hover:bg-white/5 text-sm sm:text-lg w-full xs:w-auto">
                                <Link href="/projects">
                                    See Our Work
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

function ServiceBackground({ color }: { color: string }) {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-bg">
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Primary Gradient Orb - Top Left */}
            <motion.div
                initial={{ opacity: 0.1, scale: 0.8 }}
                animate={{
                    scale: [1, 1.1, 1],
                    x: [-20, 20, -20],
                    y: [-20, 20, -20],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ willChange: "transform" }}
                className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] rounded-full bg-gradient-to-br ${color} blur-[80px] opacity-20`}
            />

            {/* Secondary Gradient Orb - Bottom Right */}
            <motion.div
                initial={{ opacity: 0.1, scale: 0.8 }}
                animate={{
                    scale: [1.1, 1, 1.1],
                    x: [20, -20, 20],
                    y: [20, -20, 20],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                style={{ willChange: "transform" }}
                className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] rounded-full bg-gradient-to-tl from-secondary via-accent to-purple-500 blur-[80px] opacity-15"
            />

            {/* Accent Orb - Floating */}
            <motion.div
                initial={{ opacity: 0.1 }}
                animate={{
                    x: [0, 30, -30, 0],
                    y: [0, -30, 30, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{ willChange: "transform" }}
                className={`absolute top-[30%] left-[30%] w-[30vw] h-[30vh] rounded-full bg-gradient-to-tr ${color} blur-[60px] opacity-10 mix-blend-overlay`}
            />

            {/* Static Noise Texture - Optimized */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '150px 150px'
                }}
            />
        </div>
    )
}
