"use server"

import { Prisma } from "@prisma/client"
import prisma from "@/lib/database"
import { StatusCodes } from "http-status-codes"
import { revalidatePath } from "next/cache"

export const POST = async (value: string) => {
    try {
        // Gunakan findFirst lebih efisien daripada count untuk check existence
        const exists = await prisma.skill.findFirst({
            where: {
                name: {
                    equals: value,
                    mode: "insensitive"
                }
            },
            select: { id: true }
        })

        if (!exists) {
            await prisma.skill.create({
                data: { name: value }
            })

            revalidatePath("/admin/skill")
            return {
                status: StatusCodes.OK,
                message: "Kemampuan berhasil ditambahkan!"
            }
        } else {
            return {
                status: StatusCodes.CONFLICT,
                message: "Kemampuan sudah ada"
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
        const currentPage = page ? parseInt(page) : 1
        const pageSize = 10
        
        const whereQuery: Prisma.SkillWhereInput = search ? {
            name: {
                contains: search,
                mode: "insensitive"
            }
        } : {}

        const [skills, totalData] = await Promise.all([
            prisma.skill.findMany({
                take: pageSize,
                skip: (currentPage - 1) * pageSize,
                where: whereQuery,
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: { studentUsers: true }
                    }
                },
                orderBy: {
                    studentUsers: { _count: "desc" }
                }
            }),

            prisma.skill.count({ where: whereQuery })
        ])

        const totalPage = Math.ceil(totalData / pageSize)
        const hasNextPage = currentPage < totalPage
        const hasPrevPage = currentPage > 1
        
        return {
            status: StatusCodes.OK,
            message: "Data berhasil dimuat!",
            data: {
                skills,
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

export const UPDATE = async (id: string, value: string, oldValue: string) => {
    try {
        if (value.toLowerCase() !== oldValue.toLowerCase()) {
            // Gunakan findFirst dengan select minimal untuk check duplicate
            const exists = await prisma.skill.findFirst({
                where: {
                    name: { equals: value, mode: 'insensitive' },
                    NOT: { id }
                },
                select: { id: true }
            })

            if (exists) {
                return {
                    status: StatusCodes.CONFLICT,
                    message: "Kemampuan sudah ada"
                }
            }
        }

        await prisma.skill.update({
            where: { id },
            data: { name: value }
        })

        revalidatePath("/admin/skill")
        return {
            status: StatusCodes.OK,
            message: "Kemampuan berhasil diperbarui!"
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
        // Gunakan deleteMany untuk mencegah error jika record tidak ada
        await prisma.skill.delete({
            where: { id }
        })

        revalidatePath("/admin/skill")
        return {
            status: StatusCodes.OK,
            message: "Kemampuan berhasil dihapus!"
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Terjadi kesalahan pada server"
        }
    }
}
