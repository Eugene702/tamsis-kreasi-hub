"use server"

import prisma from "@/lib/database"
import { StatusCodes } from "http-status-codes"
import { unstable_cache } from "next/cache"

const getArtworksFromDB = async (search: string, skip: number, take: number) => {
    const whereClause: any = {}
    
    if (search) {
        whereClause.title = {
            contains: search,
            mode: 'insensitive'
        }
    }

    const artworks = await prisma.userProject.findMany({
        where: whereClause,
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
            userProjectViews: {
                _count: 'desc'
            }
        },
        skip,
        take: take + 1
    })

    const hasMore = artworks.length > take
    const items = artworks.slice(0, take)

    return { items, hasMore }
}

const getCachedArtworks = (search: string, skip: number, take: number) => 
    unstable_cache(
        () => getArtworksFromDB(search, skip, take),
        [`artworks-${search}-${skip}-${take}`],
        {
            revalidate: 1800, // 30 menit
            tags: ['artworks', 'projects']
        }
    )()

export const getArtworks = async (search: string = '', skip: number = 0, take: number = 12) => {
    try {
        const data = await getCachedArtworks(search, skip, take)

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data karya.",
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

export type GetArtworksType = Awaited<ReturnType<typeof getArtworks>>

const getTotalArtworksFromDB = async (search: string) => {
    const whereClause: any = {}
    
    if (search) {
        whereClause.title = {
            contains: search,
            mode: 'insensitive'
        }
    }

    return await prisma.userProject.count({
        where: whereClause
    })
}

const getCachedTotalArtworks = (search: string) => 
    unstable_cache(
        () => getTotalArtworksFromDB(search),
        [`total-artworks-${search}`],
        {
            revalidate: 1800,
            tags: ['artworks', 'projects']
        }
    )()

export const getTotalArtworks = async (search: string = '') => {
    try {
        const total = await getCachedTotalArtworks(search)

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil total karya.",
            data: total
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export type GetTotalArtworksType = Awaited<ReturnType<typeof getTotalArtworks>>

// Kombinasi: Get total + artworks dalam 1 request
const getArtworksWithTotalFromDB = async (search: string, take: number = 12) => {
    const whereClause: any = {}
    
    if (search) {
        whereClause.title = {
            contains: search,
            mode: 'insensitive'
        }
    }

    // Parallel query untuk count dan data
    const [total, artworks] = await Promise.all([
        prisma.userProject.count({ where: whereClause }),
        prisma.userProject.findMany({
            where: whereClause,
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
                userProjectViews: {
                    _count: 'desc'
                }
            },
            take: take + 1
        })
    ])

    const hasMore = artworks.length > take
    const items = artworks.slice(0, take)

    return {
        total,
        artworks: {
            items,
            hasMore
        }
    }
}

const getCachedArtworksWithTotal = (search: string, take: number) => 
    unstable_cache(
        () => getArtworksWithTotalFromDB(search, take),
        [`artworks-with-total-${search}-${take}`],
        {
            revalidate: 1800, // 30 menit
            tags: ['artworks', 'projects']
        }
    )()

export const getArtworksWithTotal = async (search: string = '', take: number = 12) => {
    try {
        const data = await getCachedArtworksWithTotal(search, take)

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data karya dan total.",
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

export type GetArtworksWithTotalType = Awaited<ReturnType<typeof getArtworksWithTotal>>

