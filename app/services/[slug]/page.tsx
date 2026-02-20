'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { notFound } from 'next/navigation'
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
        notFound()
    }

    const Icon = iconMap[service.icon] || Code

    return (
        <div className="relative min-h-screen bg-bg overflow-hidden mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16" ref={containerRef}>
            {/* Dynamic Background */}
            <ServiceBackground color={service.color} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${service.color} bg-opacity-10 border border-accent/20 mb-6 text-accent/80 text-sm font-medium`}
                        >
                            <Sparkles size={14} />
                            <span>Premium Service</span>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight">
                            {service.title.split(' ').map((word, i) => (
                                <span key={i} className="block bg-clip-text text-transparent bg-gradient-to-r from-text via-text/90 to-dimmed">
                                    {word}
                                </span>
                            ))}
                        </h1>

                        <p className="text-lg sm:text-xl text-dimmed leading-relaxed mb-8 max-w-xl">
                            {service.description}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button asChild size="lg" className={`bg-gradient-to-r ${service.color} text-white hover:opacity-90 border-0 shadow-lg shadow-accent/20 rounded-xl px-8`}>
                                <Link href="/contact">
                                    Start Project
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-dimmed/20 hover:bg-white/5 rounded-xl px-8">
                                <Link href="/projects">
                                    View Portfolio
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

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
                </div>

                {/* Workflow Steps - Zig Zag */}
                <div className="mb-32 relative">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-secondary inline-block mb-4"
                        >
                            Workflow
                        </motion.h2>
                        <p className="text-dimmed max-w-2xl mx-auto">
                            A transparent, agile process designed to deliver exceptional results.
                        </p>
                    </div>

                    <div className="space-y-12 lg:space-y-0 relative">
                        {/* Center Line for Desktop */}
                        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent transform -translate-x-1/2" />

                        {service.workflow.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6 }}
                                className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                <div className="flex-1 w-full lg:w-1/2 flex justify-center lg:justify-end">
                                    <div className={`w-full max-w-md p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 group ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                                        <h3 className="text-xl font-bold text-text mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                                        <p className="text-dimmed text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </div>

                                {/* Timeline Node */}
                                <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
                                    <div className="w-4 h-4 rounded-full bg-accent shadow-[0_0_15px_rgba(var(--accent),0.5)] z-10" />
                                    <div className="absolute w-12 h-12 rounded-full border border-accent/20 animate-pulse" />
                                </div>

                                <div className="flex-1 w-full lg:w-1/2 hidden lg:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Process Bento Grid */}
                <section className="mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-12"
                    >
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-2">Detailed Process</h2>
                            <p className="text-dimmed">Step-by-step execution plan</p>
                        </div>
                        <Layers className="text-accent/50 h-10 w-10" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {service.process.map((step, index) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
                                <Card className="relative h-full bg-bg/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl overflow-hidden hover:border-accent/40 transition-all duration-500 hover:-translate-y-1">
                                    <div className="absolute -right-4 -top-4 text-[120px] font-bold text-white/[0.02] group-hover:text-accent/[0.05] transition-colors leading-none select-none">
                                        {step.step}
                                    </div>

                                    <div className="relative z-10">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                            <span className="font-bold text-sm">{step.step}</span>
                                        </div>

                                        <h3 className="text-lg font-bold text-text mb-3">{step.title}</h3>
                                        <p className="text-sm text-dimmed group-hover:text-text/80 transition-colors">
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
                    className="relative rounded-[3rem] overflow-hidden"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-10`} />
                    <div className="absolute inset-0 backdrop-blur-3xl" />
                    <div className="relative z-10 px-6 py-20 sm:px-12 sm:py-24 text-center">
                        <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-text">
                            Ready to <span className="text-accent">Build?</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-dimmed max-w-2xl mx-auto mb-10">
                            Transform your digital presence with our expert {service.title} services.
                            Let's create something extraordinary together.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button asChild className="h-14 px-8 rounded-full bg-text text-bg hover:bg-accent hover:text-white text-lg font-medium transition-all duration-300 shadow-xl hover:shadow-accent/25">
                                <Link href="/contact">
                                    Start Your Project
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" className="h-14 px-8 rounded-full text-dimmed hover:text-text hover:bg-white/5 text-lg">
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
