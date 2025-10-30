"use server"

import prisma from "@/lib/database"
import { StatusCodes } from "http-status-codes"

const buildStudentWhereClause = (filters?: {
    query?: string
    jurusan?: string
    kelas?: string
    umur?: string
}) => {
    const studentUserWhere: any = {}

    if (filters?.jurusan && filters.jurusan !== 'Semua') {
        studentUserWhere.major = filters.jurusan
    }

    if (filters?.kelas && filters.kelas !== 'Semua') {
        studentUserWhere.classLevel = parseInt(filters.kelas)
    }

    if (filters?.umur && filters.umur !== 'Semua') {
        const targetYear = new Date().getFullYear() - parseInt(filters.umur)
        studentUserWhere.birthday = {
            gte: new Date(`${targetYear}-01-01`),
            lte: new Date(`${targetYear}-12-31`)
        }
    }

    const where: any = {
        role: 'STUDENT',
        userProjects: {
            some: {}
        },
        studentUser: Object.keys(studentUserWhere).length > 0 
            ? { isNot: null, is: studentUserWhere }
            : { isNot: null }
    }

    if (filters?.query) {
        where.name = {
            contains: filters.query,
            mode: 'insensitive'
        }
    }

    return where
}

const getStudentsWithPagination = async (where: any, skip: number = 0, take: number = 11) => {
    const studentsData = await prisma.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            photo: true,
            studentUser: {
                select: {
                    major: true,
                    classLevel: true,
                    birthday: true
                }
            },
            userProjects: {
                select: {
                    domain: true,
                    title: true,
                    banner: true,
                    categories: {
                        select: {
                            categories: {
                                select: {
                                    name: true
                                }
                            }
                        },
                        take: 1
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
                take: 5
            }
        },
        skip,
        take
    })

    const studentsWithTotalViews = studentsData.map(student => {
        const totalViews = student.userProjects.reduce(
            (sum, project) => sum + project._count.userProjectViews, 
            0
        )
        return { ...student, totalViews }
    })

    studentsWithTotalViews.sort((a, b) => b.totalViews - a.totalViews)

    return studentsWithTotalViews
}

const transformStudentData = (student: any) => {
    const age = new Date().getFullYear() - new Date(student.studentUser.birthday).getFullYear()

    return {
        id: student.id,
        domain: student.id,
        name: student.name,
        photo: student.photo,
        jurusan: student.studentUser.major,
        kelas: student.studentUser.classLevel.toString(),
        umur: age,
        totalViews: student.totalViews,
        userProjects: student.userProjects.map((p: any) => ({
            id: p.domain,
            domain: p.domain,
            title: p.title,
            banner: p.banner,
            views: p._count.userProjectViews,
            category: {
                name: p.categories[0]?.categories.name || 'Uncategorized'
            }
        }))
    }
}

export type GetStarStudentsType = Awaited<ReturnType<typeof getStarStudents>>
export const getStarStudents = async (filters?: {
    query?: string
    jurusan?: string
    kelas?: string
    umur?: string
}) => {
    try {
        const where = buildStudentWhereClause(filters)

        const [studentsWithViews, agesData] = await Promise.all([
            getStudentsWithPagination(where, 0, 11),
            prisma.user.findMany({
                where: {
                    role: 'STUDENT',
                    studentUser: { isNot: null },
                    userProjects: { some: {} }
                },
                select: {
                    studentUser: {
                        select: {
                            birthday: true
                        }
                    }
                },
                distinct: ['id']
            })
        ])

        const ages = [...new Set(
            agesData.map(s => 
                new Date().getFullYear() - new Date(s.studentUser!.birthday).getFullYear()
            )
        )].sort((a, b) => a - b)

        const hasMore = studentsWithViews.length > 10
        const students = studentsWithViews.slice(0, 10).map(transformStudentData)

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data!",
            data: {
                students,
                hasMore,
                ages
            }
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export type LoadMoreStarStudentsType = Awaited<ReturnType<typeof loadMoreStarStudents>>
export const loadMoreStarStudents = async (skip: number, filters?: {
    query?: string
    jurusan?: string
    kelas?: string
    umur?: string
}) => {
    try {
        const where = buildStudentWhereClause(filters)
        const studentsWithViews = await getStudentsWithPagination(where, skip, 11)

        const hasMore = studentsWithViews.length > 10
        const students = studentsWithViews.slice(0, 10).map(transformStudentData)

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data!",
            data: {
                students,
                hasMore
            }
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}
