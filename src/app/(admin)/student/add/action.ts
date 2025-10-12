"use server"

import { uploadImage } from "@/lib/cloudinary"
import prisma from "@/lib/database"
import { UploadApiResponse } from "cloudinary"
import { StatusCodes } from "http-status-codes"
import { hash, genSalt } from "bcrypt"
import { revalidatePath } from "next/cache"

export const POST = async (formData: FormData) => {
    try{
        const { photo, name, email, classLevel, major, birthDate, phone, password } = Object.fromEntries(formData)
        let photoData = undefined as undefined | UploadApiResponse

        if(photo != undefined || photo != null || (photo as any instanceof File)){
            const uploadResult = await uploadImage(photo as File, "profile")
            if(uploadResult.success){
                photoData = uploadResult.data!
            }else{
                return new Response("Gagal mengunggah foto", { status: StatusCodes.INTERNAL_SERVER_ERROR })
            }
        }

        await prisma.user.create({
            data: {
                email: email as string,
                name: name as string,
                role: "STUDENT",
                password: await hash(password as string, await genSalt(10)),
                photo: photoData,
                
                studentUser: {
                    create: {
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
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Terjadi kesalahan pada server"
        }
    }
}