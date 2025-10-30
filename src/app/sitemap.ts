import { MetadataRoute } from 'next'
import prisma from '@/lib/database'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tamsis-kreasi-hub.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/artwork`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/category`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/star`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ]

    // Parallel query execution untuk performa optimal
    const [categories, projects, users] = await Promise.all([
        // Dynamic categories - minimal select
        prisma.categories.findMany({
            select: {
                slug: true,
            },
        }),
        
        // Dynamic projects - minimal select, no orderBy
        prisma.userProject.findMany({
            select: {
                domain: true,
                updatedAt: true,
            },
        }),
        
        // Dynamic user profiles - minimal select dengan filter
        prisma.user.findMany({
            where: {
                studentUser: {
                    isNot: null,
                },
            },
            select: {
                id: true,
                updatedAt: true,
            },
        }),
    ])

    // Map categories
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }))

    // Map projects
    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
        url: `${baseUrl}/project/${project.domain}`,
        lastModified: project.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
    }))

    // Map user profiles & bio pages
    const userPages: MetadataRoute.Sitemap = users.flatMap((user) => [
        {
            url: `${baseUrl}/${user.id}`,
            lastModified: user.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/${user.id}/bio`,
            lastModified: user.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ])

    return [
        ...staticPages,
        ...categoryPages,
        ...projectPages,
        ...userPages,
    ]
}
