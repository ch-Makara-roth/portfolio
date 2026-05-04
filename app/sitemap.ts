import { MetadataRoute } from 'next'
import { baseMetadata } from '@/lib/metadata'
import { mockServices } from '@/lib/mockData'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = baseMetadata.siteUrl
  const lastModified = new Date('2026-05-04')
  const projectIds = ['1', '2']

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...projectIds.map((id) => ({
      url: `${baseUrl}/projects/${id}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/contact/`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...mockServices.map((service) => ({
      url: `${baseUrl}/services/${service.slug}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    {
      url: `${baseUrl}/blogs/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
}
