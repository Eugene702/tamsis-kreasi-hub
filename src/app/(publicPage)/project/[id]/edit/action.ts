"use server"

import { StatusCodes } from "http-status-codes"
import { uploadImage as uploadImageByCloudinary, deleteImageByPublicId } from "@/lib/cloudinary"
import prisma from "@/lib/database"
import { OutputData } from "@editorjs/editorjs"
import { useAuth } from "@/lib/auth"
import { Prisma } from "@prisma/client"
import { redirect } from "next/navigation"

export type InitDataType = Awaited<ReturnType<typeof initData>>
export const initData = async (domain: string) => {
    try{
        const user = await useAuth()
        if(!user){
            redirect("/auth/signin")
        }

        const [categories, project] = await Promise.all([
            prisma.categories.findMany({ 
                orderBy: { name: "asc" },
                select: {
                    id: true,
                    name: true
                }
            }),
            prisma.userProject.findUnique({
                where: { domain },
                select: {
                    domain: true,
                    userId: true,
                    title: true,
                    banner: true,
                    content: true,
                    categories: {
                        select: {
                            categoryId: true
                        }
                    }
                }
            })
        ])

        if(!project){
            return {
                status: StatusCodes.NOT_FOUND,
                message: "Karya tidak ditemukan!"
            }
        }

        if(project.userId !== user.user.id){
            return {
                status: StatusCodes.FORBIDDEN,
                message: "Anda tidak memiliki akses untuk mengedit karya ini!"
            }
        }

        return{
            status: StatusCodes.OK,
            message: "Berhasil mengambil data!",
            data: {
                categories,
                project
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

export const update = async(domain: string, data: { title: string; content: OutputData, category: string[] }, image?: File) => {
    try{
        const user = await useAuth()
        if(!user){
            return {
                status: StatusCodes.UNAUTHORIZED,
                message: "Anda harus login terlebih dahulu!"
            }
        }

        const project = await prisma.userProject.findUnique({
            where: { domain },
            select: {
                userId: true,
                banner: true,
                content: true
            }
        })

        if(!project){
            return {
                status: StatusCodes.NOT_FOUND,
                message: "Karya tidak ditemukan!"
            }
        }

        if(project.userId !== user.user.id){
            return {
                status: StatusCodes.FORBIDDEN,
                message: "Anda tidak memiliki akses untuk mengedit karya ini!"
            }
        }

        let bannerUrl = project.banner as Prisma.InputJsonValue
        const deletePromises: Promise<any>[] = []

        if(image){
            const uploadImageResult = await uploadImage(image)
            if(uploadImageResult.status != StatusCodes.OK){
                return {
                    status: uploadImageResult.status,
                    message: uploadImageResult.message,
                }
            }

            if(project.banner){
                const bannerData = project.banner as { public_id: string }
                deletePromises.push(deleteImageByPublicId(bannerData.public_id))
            }

            bannerUrl = uploadImageResult.data as unknown as Prisma.InputJsonValue
        }

        const oldContent = project.content as unknown as OutputData
        
        if(oldContent && oldContent.blocks){
            oldContent.blocks.forEach(block => {
                if(block.type === "image" && block.data?.file?.data?.public_id){
                    const publicId = block.data.file.data.public_id
                    const stillUsed = data.content.blocks.some(
                        newBlock => newBlock.type === "image" && newBlock.data?.file?.data?.public_id === publicId
                    )
                    if(!stillUsed){
                        deletePromises.push(deleteImageByPublicId(publicId))
                    }
                }
            })
        }

        await Promise.all([
            ...deletePromises,
            prisma.userProject.update({
                where: { domain },
                data: {
                    title: data.title,
                    content: data.content as unknown as Prisma.InputJsonValue,
                    banner: bannerUrl,
                    categories: {
                        deleteMany: {},
                        createMany: {
                            data: data.category.map(e => ({ categoryId: e }))
                        }
                    }
                }
            })
        ])

        return {
            status: StatusCodes.OK,
            message: "Karya berhasil diperbarui!",
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}
