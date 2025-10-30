"use server"

import prisma from "@/lib/database"
import { StatusCodes } from "http-status-codes"
import { revalidatePath } from "next/cache"

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
                                            id: true,
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

export const addSkill = async (userId: string, skillId: string) => {
    try{
        const exists = await prisma.studentUserSkills.count({
            where: { skillId: skillId, studentUserId: userId }
        })

        if(exists > 0){
            return {
                status: StatusCodes.CONFLICT,
                message: "Kemampuan sudah ditambahkan sebelumnya!"
            }
        }

        await prisma.studentUserSkills.create({
            data: {
                skillId: skillId,
                studentUserId: userId
            }
        })

        revalidatePath("/", "layout")
        return {
            status: StatusCodes.OK,
            message: "Berhasil menambahkan kemampuan!"
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export const updateSkill = async (userId: string, oldSkillId: string, newSkillId: string) => {
    try{
        if(oldSkillId != newSkillId){
            const exists = await prisma.studentUserSkills.count({
                where: {
                    skillId: newSkillId,
                    studentUserId: userId
                }
            })

            if(exists > 0){
                return {
                    status: StatusCodes.CONFLICT,
                    message: "Kemampuan sudah ditambahkan sebelumnya!"
                }
            }
        }

        await prisma.studentUserSkills.updateMany({
            where: {
                skillId: oldSkillId,
                studentUserId: userId
            },
            data: {
                skillId: newSkillId
            }
        })

        revalidatePath("/", "layout")
        return {
            status: StatusCodes.OK,
            message: "Berhasil memperbarui kemampuan!"
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export const deleteSkill = async (userId: string, skillId: string) => {
    try{
        await prisma.studentUserSkills.deleteMany({
            where: { skillId: skillId, studentUserId: userId }
        })

        revalidatePath("/", "layout")
        return {
            status: StatusCodes.OK,
            message: "Berhasil menghapus kemampuan!"
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export const updateBio = async (userId: string, bio: string) => {
    try{
        console.log({ userId, bio })
        await prisma.studentUser.update({
            where: { userId },
            data: { bio }
        })

        revalidatePath("/", "layout")
        return {
            status: StatusCodes.OK,
            message: "Berhasil memperbarui bio!"
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}