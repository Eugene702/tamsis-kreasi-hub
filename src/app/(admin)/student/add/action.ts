"use server"

import { uploadImage } from "@/lib/cloudinary"
import prisma from "@/lib/database"
import { UploadApiResponse } from "cloudinary"
import { StatusCodes } from "http-status-codes"
import { hash, genSalt } from "bcrypt"

export const POST = async (formData: FormData) => {
    try{
        const { photo, name, email, classLevel, major, birthDate, phone, password, confirmPassword } = Object.fromEntries(formData)
        let photoData = null as null | UploadApiResponse

        if(photo != null || photo != undefined){
            const uploadResult = await uploadImage(photo as File, "profile")
            if(uploadResult.success){
                photoData = uploadResult.data
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
                
                studentUser: {
                    create: {
                        telp: phone as string,
                        birthday: birthDate as 
                    }
                }
            }
        })
    }catch(e){
        console.error(e)
        return new Response("Ada kesalahan pada server", { status: StatusCodes.INTERNAL_SERVER_ERROR })
    }
}