import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ServiceDetailPage from '@/components/ServiceDetailPage'
import { generateMetadata as generateSeoMetadata } from '@/lib/metadata'
import { mockServices } from '@/lib/mockData'

interface ServicePageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
    const service = mockServices.find((item) => item.slug === params.slug)

    if (!service) {
        return generateSeoMetadata({
            title: 'Service Not Found',
            description: 'The requested service could not be found.',
            path: `/services/${params.slug}`,
        })
    }

    return generateSeoMetadata({
        title: service.title,
        description: `${service.description} Work with Chhuon Makara Roth for ${service.title.toLowerCase()} services.`,
        path: `/services/${service.slug}`,
    })
}

export default function ServicePage({ params }: ServicePageProps) {
    const service = mockServices.find((item) => item.slug === params.slug)

    if (!service) {
        notFound()
    }

    return <ServiceDetailPage params={params} />
}

export function generateStaticParams() {
    return mockServices.map((service) => ({
        slug: service.slug,
    }))
}
