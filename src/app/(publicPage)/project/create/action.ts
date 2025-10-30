"use server"

import { StatusCodes } from "http-status-codes"
import { uploadImage as uploadImageByCloudinary } from "@/lib/cloudinary"
import prisma from "@/lib/database"
import { OutputData } from "@editorjs/editorjs"
import { useAuth } from "@/lib/auth"
import { Prisma } from "@/generated/prisma"

export type FindAllType = Awaited<ReturnType<typeof findAll>>
export const findAll = async () => {
    try{
        const data = await prisma.categories.findMany({ orderBy: { name: "asc" } })
        return{
            status: StatusCodes.OK,
            message: "Berhasil mengambil data!",
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

export const uploadImage = async (file: File) => {
    try{
        const response = await uploadImageByCloudinary(file, 'project_images')
        return {
            status: response.success ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR,
            data: response.data,
            message: response.success ? "Gambar berhasil diupload!" : "Gagal mengupload gambar!"
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export const create = async(data: { title: string; domain: string; content: OutputData, category: string[] }, image: File) => {
    try{
        const checkDomain = await prisma.userProject.findUnique({
            where: { domain: data.domain }
        })

        if(checkDomain){
            const message = "Domain sudah digunakan, silahkan gunakan domain lain!"
            return {
                status: StatusCodes.CONFLICT,
                message,
                data: {
                    domain: message
                }
            }
        }else{
            const uploadImageResult = await uploadImage(image)
            if(uploadImageResult.status != StatusCodes.OK){
                return {
                    status: uploadImageResult.status,
                    message: uploadImageResult.message,
                }
            }

            const user = await useAuth()
            await prisma.userProject.create({
                data: {
                    domain: data.domain,
                    title: data.title,
                    content: data.content as unknown as Prisma.InputJsonValue,
                    userId: user?.user.id!,
                    banner: uploadImageResult.data!,
                    categories: {
                        createMany: {
                            data: data.category.map(e => ({ categoryId: e }))
                        }
                    }
                }
            })

            return {
                status: StatusCodes.OK,
                message: "Karya berhasil dibuat!",
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