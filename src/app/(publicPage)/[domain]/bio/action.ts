"use server"

import prisma from "@/lib/database"
import { StatusCodes } from "http-status-codes"

export const GET = async (id: string) => {
    try {
        const [ profile, projectTotal, viewTotal ] = await Promise.all([
            prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    photo: true,
                    studentUser: {
                        select: {
                            bio: true,
                            birthday: true,
                            classLevel: true,
                            major: true,
                            telp: true,
                            skills: {
                                select: {
                                    skill: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }),

            prisma.userProject.count({
                where: { userId: id }
            }),

            prisma.userProjectViews.count({
                where: { userProject: { userId: id } }
            })
        ])

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data profile",
            data: { profile, projectTotal, viewTotal }
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export const getSkill = async (query: string) => {
    try{
        const data = await prisma.skill.findMany({
            where: {
                name: { contains: query ?? "", mode: 'insensitive' },
            },
            take: 10,
            orderBy: { name: "asc" }
        })

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data skill",
            data
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}