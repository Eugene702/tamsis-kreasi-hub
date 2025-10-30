"use server"

import prisma from "@/lib/database"
import { StatusCodes } from "http-status-codes"
import { unstable_cache } from "next/cache"

const getCachedCategories = unstable_cache(
    async () => {
        return await prisma.categories.findMany({
            take: 10,
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                slug: true
            }
        })
    },
    ['homepage-categories'],
    { 
        revalidate: 3600,
        tags: ['categories']
    }
)

export type GETType = Awaited<ReturnType<typeof GET>>
export const GET = async () => {
    try{
        const [categories, userProjects] = await Promise.all([
            getCachedCategories(),

            prisma.userProject.findMany({
                take: 20,
                orderBy: { createdAt: "desc" },
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
                }
            })
        ])

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data!",
            data: { 
                categories, 
                userProjects,
                hasMore: userProjects.length === 20
            }
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export type LoadMoreType = Awaited<ReturnType<typeof loadMore>>
export const loadMore = async (skip: number) => {
    try{
        const userProjects = await prisma.userProject.findMany({
            take: 20,
            skip,
            orderBy: { createdAt: "desc" },
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
            }
        })

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data!",
            data: {
                userProjects,
                hasMore: userProjects.length === 20
            }
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}