import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
    title: 'Services',
    description: 'Comprehensive web development services to bring your digital vision to life. Let\'s discuss your ideas and create something amazing together.',
    path: '/services',
})

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
