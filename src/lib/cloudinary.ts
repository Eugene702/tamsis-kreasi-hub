import { v2 as Cloudinary, UploadApiResponse } from "cloudinary"
import { StatusCodes } from "http-status-codes"

Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
})

export const uploadImage = async (file: File, folder: string) => {
    try{
        const base64 = Buffer.from(await file.arrayBuffer()).toString("base64")
        const result = await Cloudinary.uploader.upload(`data:${file.type};base64,${base64}`, {
            folder: folder,
            resource_type: "image",
            overwrite: true,
        })

        return {
            success: true,
            data: result
        }
    }catch(e){
        console.error(e)
        return {
            success: false,
            data: null
        }
    }
}

export const deleteImage = async (data: UploadApiResponse) => {
    try{
        await Cloudinary.uploader.destroy(data.public_id)
        return {
            status: StatusCodes.OK,
            message: "Gambar berhasil dihapus!"
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}