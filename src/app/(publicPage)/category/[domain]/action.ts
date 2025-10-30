"use server"

import prisma from "@/lib/database"
import { StatusCodes } from "http-status-codes"
import { unstable_cache } from "next/cache"

const getCategoryBySlugFromDB = async (slug: string) => {
    return await prisma.categories.findUnique({
        where: { slug },
        select: {
            id: true,
            name: true,
            slug: true,
            _count: {
                select: {
                    userProjects: true
                }
            }
        }
    })
}

const getCachedCategory = (slug: string) => 
    unstable_cache(
        () => getCategoryBySlugFromDB(slug),
        [`category-${slug}`],
        {
            revalidate: 3600,
            tags: ['categories', `category-${slug}`]
        }
    )()

export const getCategoryBySlug = async (slug: string) => {
    try {
        const category = await getCachedCategory(slug)

        if (!category) {
            return {
                status: StatusCodes.NOT_FOUND,
                message: "Kategori tidak ditemukan!"
            }
        }

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data kategori.",
            data: category
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export type GetCategoryBySlugType = Awaited<ReturnType<typeof getCategoryBySlug>>

const getCategoryProjectsFromDB = async (categorySlug: string, skip: number, take: number) => {
    const projects = await prisma.userProject.findMany({
        where: {
            categories: {
                some: {
                    categories: {
                        slug: categorySlug
                    }
                }
            }
        },
        select: {
            domain: true,
            title: true,
            banner: true,
            user: {
                select: {
                    name: true,
                    photo: true
                }
            },
            _count: {
                select: {
                    userProjectViews: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        skip,
        take: take + 1
    })

    const hasMore = projects.length > take
    const items = projects.slice(0, take)

    return { items, hasMore }
}

const getCachedProjects = (categorySlug: string, skip: number, take: number) => 
    unstable_cache(
        () => getCategoryProjectsFromDB(categorySlug, skip, take),
        [`category-projects-${categorySlug}-${skip}-${take}`],
        {
            revalidate: 1800, // 30 menit
            tags: ['projects', `category-${categorySlug}`]
        }
    )()

export const getCategoryProjects = async (categorySlug: string, skip: number = 0, take: number = 8) => {
    try {
        const data = await getCachedProjects(categorySlug, skip, take)

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data proyek.",
            data
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export type GetCategoryProjectsType = Awaited<ReturnType<typeof getCategoryProjects>>

// Kombinasi: Get category + initial projects dalam 1 request
const getCategoryWithProjectsFromDB = async (slug: string, take: number = 10) => {
    // Single query untuk category
    const category = await prisma.categories.findUnique({
        where: { slug },
        select: {
            id: true,
            name: true,
            slug: true,
            _count: {
                select: {
                    userProjects: true
                }
            }
        }
    })

    if (!category) {
        return null
    }

    // Single query untuk projects
    const projects = await prisma.userProject.findMany({
        where: {
            categories: {
                some: {
                    categories: {
                        slug: slug
                    }
                }
            }
        },
        select: {
            domain: true,
            title: true,
            banner: true,
            user: {
                select: {
                    name: true,
                    photo: true
                }
            },
            _count: {
                select: {
                    userProjectViews: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: take + 1
    })

    const hasMore = projects.length > take
    const items = projects.slice(0, take)

    return {
        category,
        projects: {
            items,
            hasMore
        }
    }
}

const getCachedCategoryWithProjects = (slug: string, take: number) => 
    unstable_cache(
        () => getCategoryWithProjectsFromDB(slug, take),
        [`category-with-projects-${slug}-${take}`],
        {
            revalidate: 1800, // 30 menit
            tags: ['categories', `category-${slug}`, 'projects']
        }
    )()

export const getCategoryWithProjects = async (slug: string, take: number = 10) => {
    try {
        const data = await getCachedCategoryWithProjects(slug, take)

        if (!data) {
            return {
                status: StatusCodes.NOT_FOUND,
                message: "Kategori tidak ditemukan!"
            }
        }

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data kategori dan proyek.",
            data
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export type GetCategoryWithProjectsType = Awaited<ReturnType<typeof getCategoryWithProjects>>
