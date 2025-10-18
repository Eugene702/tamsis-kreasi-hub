"use server"

import { Prisma } from "@/generated/prisma"
import prisma from "@/lib/database"
import { StatusCodes } from "http-status-codes"
import { revalidatePath } from "next/cache"

export const POST = async (value: string, slug: string) => {
    try {
        const exists = await prisma.categories.count({
            where: {
                name: {
                    contains: value,
                    mode: "insensitive"
                }
            }
        })

        if (exists === 0) {
            await prisma.categories.create({
                data: { name: value, slug: slug }
            })

            revalidatePath("/", "layout")
            return {
                status: StatusCodes.OK,
                message: "Kategori berhasil di tambahkan!"
            }
        } else {
            return {
                status: StatusCodes.CONFLICT,
                message: "Kategori sudah ada"
            }
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Terjadi kesalahan pada server"
        }
    }
}

export type GetSearchParams = {
    page?: string,
    search?: string,
}

export type GetTypeResponse = Awaited<ReturnType<typeof GET>>
export const GET = async ({ page, search }: GetSearchParams) => {
    try {
        const whereQuery: Prisma.CategoriesWhereInput = {
            name: {
                contains: search ?? "",
                mode: "insensitive"
            }
        }

        const [categories, totalData] = await Promise.all([
            prisma.categories.findMany({
                relationLoadStrategy: "join",
                take: 10,
                skip: page ? (parseInt(page) - 1) * 10 : 0,
                where: whereQuery,
                include: { _count: { select: { userProjects: true } } },
                orderBy: {
                    userProjects: { _count: "desc" }
                }
            }),

            prisma.categories.count({ where: whereQuery })
        ])

        const pageFill = page == undefined ? 1 : parseInt(page)
        const totalPage = Math.round(totalData / 10)
        const hasNextPage = pageFill < totalPage
        const hasPrevPage = pageFill > 1
        return {
            status: StatusCodes.OK,
            message: "Data berhasil dimuat!",
            data: {
                categories,
                pagination: {
                    totalPage,
                    hasNextPage,
                    hasPrevPage
                }
            }
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Terjadi kesalahan pada server"
        }
    }
}

export const UPDATE = async (id: string, value: string, oldValue: string, slug: string, oldSlug: string) => {
    try {
        if ((value.toLowerCase() != oldValue.toLocaleLowerCase()) || (slug != oldSlug)) {
            const exists = await prisma.categories.count({
                where: {
                    OR: [
                        { name: { contains: value, mode: 'insensitive' } },
                        { slug: { contains: slug, mode: 'insensitive' } }
                    ],
                    NOT: { id }
                }
            })

            if (exists > 0) {
                return {
                    status: StatusCodes.CONFLICT,
                    message: "Kategori sudah ada"
                }
            }
        }

        await prisma.categories.update({
            where: { id },
            data: { name: value, slug: slug }
        })

        revalidatePath("/", 'layout')
        return {
            status: StatusCodes.OK,
            message: "Kategori berhasil di perbarui!"
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Terjadi kesalahan pada server"
        }
    }
}

export const DELETE = async (id: string) => {
    try {
        await prisma.categories.delete({
            where: { id }
        })

        revalidatePath("/", "layout")
        return {
            status: StatusCodes.OK,
            message: "Kategori berhasil di hapus!"
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Terjadi kesalahan pada server"
        }
    }
}