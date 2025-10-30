"use server"

import prisma from "@/lib/database"
import { StatusCodes } from "http-status-codes"
import { unstable_cache } from "next/cache"

const getCategoriesFromDB = async () => {
    return await prisma.categories.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            _count: {
                select: {
                    userProjects: true
                }
            }
        },
        orderBy: {
            userProjects: {
                _count: 'desc'
            }
        }
    })
}

const getCachedCategories = unstable_cache(
    getCategoriesFromDB,
    ['categories-list'],
    {
        revalidate: 3600,
        tags: ['categories']
    }
)

export const getCategories = async () => {
    try {
        const categories = await getCachedCategories()

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data kategori.",
            data: categories
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export type GetCategoriesType = Awaited<ReturnType<typeof getCategories>>
