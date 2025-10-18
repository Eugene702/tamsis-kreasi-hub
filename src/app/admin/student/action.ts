"use server"

import prisma from "@/lib/database"
import { Prisma } from "@/generated/prisma"
import { StatusCodes } from "http-status-codes"
import { revalidatePath } from "next/cache"
import { deleteImage } from "@/lib/cloudinary"
import { UploadApiResponse } from "cloudinary"
import { moment } from "@/lib/moment"

export type GetType = Awaited<ReturnType<typeof GET>>
export const GET = async ({ search, page, age, major, classLevel }: { search?: string, page?: number, age?: number, major?: string, classLevel?: number }) => {
    try {
        const where: Prisma.UserWhereInput = {
            role: "STUDENT",
            AND: [
                {
                    name: {
                        contains: search ?? "",
                        mode: "insensitive"
                    },
                },
                {
                    studentUser: {
                        birthday: age ? {
                            lt: moment().subtract(age, 'years').endOf('year').toDate(),
                            gt: moment().subtract(age, 'years').startOf('year').toDate()
                        } : undefined,
                        major: major ? major : undefined,
                        classLevel: classLevel ? classLevel : undefined,
                    }
                },
            ]
        }

        const [user, count, studentTotal, projectTotal, projectViewsTotal] = await Promise.all([
            prisma.user.findMany({
                take: 10,
                skip: page ? (page - 1) * 10 : 0,
                where: where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    photo: true,
                    studentUser: {
                        select: {
                            classLevel: true,
                            major: true,
                            birthday: true,
                            telp: true,
                        }
                    },
                    _count: {
                        select: {
                            userProjects: true
                        }
                    }
                }
            }),
            prisma.user.count({ where: where }),
            prisma.studentUser.findMany({
                where: {
                    user: { role: "STUDENT" },
                },
                select: {
                    birthday: true,
                }
            }),
            prisma.userProject.count(),
            prisma.userProjectViews.count(),
        ])

        const totalPage = Math.ceil(count / 10)
        const birthday = () => {
            const data = studentTotal.map(e => e.birthday ? (new Date().getFullYear() - e.birthday.getFullYear()) : 0)
            const uniqueData = [...new Set(data)]
            return uniqueData
        }

        return {
            currentPage: page ?? 1,
            totalPage: totalPage,
            data: user,
            hasNext: (page ?? 1) < totalPage,
            hasPrev: (page ?? 1) > 1,
            stats: { studentTotal: studentTotal.length, projectTotal, projectViewsTotal },
            filterData: {
                birthday: birthday()
            }
        }

    } catch (e) {
        console.error(e)
        return {
            error: "Ada kesalahan pada server!"
        }
    }
}

export const DELETE = async (id: string, photo: UploadApiResponse | null) => {
    try {
        await Promise.all([
            prisma.user.delete({ where: { id } }),
            photo ? deleteImage(photo) : null
        ])
        revalidatePath("/", "layout")
        return {
            status: StatusCodes.OK,
            message: "Siswa berhasil dihapus!"
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}