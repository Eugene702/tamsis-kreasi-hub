"use server"

import { deleteImage, uploadImage } from "@/lib/cloudinary"
import prisma from "@/lib/database"
import { UploadApiResponse } from "cloudinary"
import { StatusCodes } from "http-status-codes"
import { hash, genSalt } from "bcrypt"
import { revalidatePath } from "next/cache"
import { Prisma } from "@/generated/prisma"

export type GetType = Awaited<ReturnType<typeof GET>>
export const GET = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { studentUser: true }
        })

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data siswa",
            data: user
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Terjadi kesalahan pada server"
        }
    }
}

export const POST = async (formData: FormData, id: string) => {
    try {
        const { photo, oldPhoto, name, email, oldEmail, classLevel, major, birthDate, phone, password } = Object.fromEntries(formData)
        const oldPhotos = oldPhoto ? JSON.parse(oldPhoto as string) : undefined
        if (oldEmail != email) {
            const checkEmail = await prisma.user.count({ where: { email: email as string } })
            if (checkEmail > 0) {
                return {
                    status: StatusCodes.CONFLICT,
                    message: "Email sudah terdaftar"
                }
            }
        }

        let photoData = (oldPhotos as unknown as UploadApiResponse) as undefined | UploadApiResponse | null
        if (photo != undefined && photo != null && (photo as any instanceof File)) {
            const [uploadResult] = await Promise.all([
                await uploadImage(photo as File, "profile"),
                await deleteImage((oldPhotos as unknown as UploadApiResponse))
            ])

            if (uploadResult.success) {
                photoData = uploadResult.data!
            } else {
                return new Response("Gagal mengunggah foto", { status: StatusCodes.INTERNAL_SERVER_ERROR })
            }
        } else {
            if (photo === undefined) {
                const result = await deleteImage((oldPhotos as unknown as UploadApiResponse))
                if (result.status != StatusCodes.OK) {
                    return {
                        status: StatusCodes.INTERNAL_SERVER_ERROR,
                        message: "Gagal menghapus foto lama"
                    }
                }
                photoData = null
            }
        }

        await prisma.user.update({
            where: { id: id },
            data: {
                email: email as string,
                name: name as string,
                role: "STUDENT",
                password: password != "" ? await hash(password as string, await genSalt(10)) : undefined,
                photo: photoData as Prisma.NullableJsonNullValueInput | undefined | Prisma.InputJsonValue,

                studentUser: {
                    update: {
                        birthday: new Date(birthDate as unknown as string),
                        classLevel: parseInt(classLevel as unknown as string),
                        major: major as string,
                        telp: phone as string,
                    }
                }
            }
        })

        revalidatePath("/", "layout")
        return {
            status: StatusCodes.CREATED,
            message: "Siswa berhasil ditambahkan"
        }
    } catch (e) {
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Terjadi kesalahan pada server"
        }
    }
}