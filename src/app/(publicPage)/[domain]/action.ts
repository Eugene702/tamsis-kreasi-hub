"use server"

import { StatusCodes } from "http-status-codes"
import prisma from "@/lib/database"
import bcrypt from "bcrypt"
import { revalidatePath } from "next/cache"

export const getProfile = async (domain: string) => {
    try{
        const data = await prisma.user.findUnique({
            where: { id: domain },
            select: {
                photo: true,
                name: true,
                id: true,
                studentUser: {
                    select: {
                        bio: true,
                        major: true,
                        classLevel: true,
                        birthday: true,
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
        })

        if(!data){
            return {
                status: StatusCodes.NOT_FOUND,
                message: "Pengguna tidak ditemukan!"
            }
        }

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data profil.",
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

export const updateProfilePhoto = async (formData: FormData) => {
    try{
        const file = formData.get("file") as File
        const userId = formData.get("userId") as string

        
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export const getProject = async (domain: string) => {
    try{
        const data = await prisma.userProject.findMany({
            where: { userId: domain },
            select: {
                domain: true,
                title: true,
                banner: true,
                _count: {
                    select: {
                        userProjectViews: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        photo: true
                    }
                }
            }
        })

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data proyek.",
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

export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    try {
        // Ambil user dengan password
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, password: true }
        })

        if (!user) {
            return {
                status: StatusCodes.NOT_FOUND,
                message: "Pengguna tidak ditemukan!"
            }
        }

        // Verifikasi password lama
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordValid) {
            return {
                status: StatusCodes.UNAUTHORIZED,
                message: "Kata sandi lama tidak sesuai!"
            }
        }

        // Hash password baru
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })

        revalidatePath("/", "layout")

        return {
            status: StatusCodes.OK,
            message: "Kata sandi berhasil diubah!"
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}