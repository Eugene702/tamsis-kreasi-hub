"use server"

import { StatusCodes } from "http-status-codes"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/database"
import { deleteImageByPublicId } from "@/lib/cloudinary"
import { UploadApiResponse } from "cloudinary"

export const findOne = async (domain: string) => {
    try{
        const data = await prisma.userProject.findUnique({ 
            where: { domain },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        photo: true,
                        studentUser: {
                            select: {
                                major: true,
                                classLevel: true
                            }
                        }
                    }
                },
                categories: {
                    select: {
                        categoryId: true,
                        categories: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        userProjectViews: true
                    }
                }
            }
        })

        if(!data){
            return {
                status: StatusCodes.NOT_FOUND,
                message: "Proyek tidak ditemukan!",
                data: null
            }
        }

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data proyek!",
            data
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!",
            data: null
        }
    }
}

export const findRelated = async (domain: string, categoryIds: string[]) => {
    try{
        const data = await prisma.userProject.findMany({
            where: {
                AND: [
                    { domain: { not: domain } },
                    {
                        categories: {
                            some: {
                                categoryId: { in: categoryIds }
                            }
                        }
                    }
                ]
            },
            select: {
                domain: true,
                title: true,
                banner: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        photo: true
                    }
                },
                _count: {
                    select: {
                        userProjectViews: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 4
        })

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil proyek terkait!",
            data
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!",
            data: []
        }
    }
}

export const findByUser = async (userId: string, currentDomain: string) => {
    try{
        const data = await prisma.userProject.findMany({
            where: {
                userId,
                domain: { not: currentDomain }
            },
            select: {
                domain: true,
                title: true,
                banner: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        photo: true
                    }
                },
                _count: {
                    select: {
                        userProjectViews: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 4
        })

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil proyek user!",
            data
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!",
            data: []
        }
    }
}

export const incrementView = async (domain: string, address: string) => {
    try{
        const cooldownTime = new Date(Date.now() - 24 * 60 * 60 * 1000)
        
        const existingView = await prisma.userProjectViews.findFirst({
            where: {
                userProjectId: domain,
                address,
                createdAt: {
                    gte: cooldownTime
                }
            }
        })

        if(existingView){
            return {
                status: StatusCodes.OK,
                message: "View sudah dicatat sebelumnya!"
            }
        }

        await prisma.userProjectViews.create({
            data: {
                userProjectId: domain,
                address
            }
        })

        return {
            status: StatusCodes.OK,
            message: "View berhasil ditambahkan!"
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}

export const deleteProject = async (domain: string, userId: string) => {
    try{
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
                message: "Proyek tidak ditemukan!"
            }
        }

        if(project.userId !== userId){
            return {
                status: StatusCodes.FORBIDDEN,
                message: "Anda tidak memiliki akses untuk menghapus proyek ini!"
            }
        }

        const imagesToDelete: string[] = []

        if(project.banner){
            const banner = project.banner as UploadApiResponse
            if(banner.public_id){
                imagesToDelete.push(banner.public_id)
            }
        }

        const content = project.content as any
        if(content?.blocks){
            content.blocks
                .filter((b: any) => b.type === 'image')
                .forEach((b: any) => {
                    const publicId = b.data?.file?.public_id
                    if(publicId){
                        imagesToDelete.push(publicId)
                    }
                })
        }

        await Promise.all(
            imagesToDelete.map(publicId => deleteImageByPublicId(publicId))
        )

        await prisma.userProject.delete({
            where: { domain }
        })

        revalidatePath(`/${userId}`)
        revalidatePath('/project')

        return {
            status: StatusCodes.OK,
            message: "Proyek berhasil dihapus!"
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}