import { getCategories } from "@/app/(publicPage)/category/action"
import { StatusCodes } from "http-status-codes"
import NavbarClient from "./NavbarClient"
import { useAuth } from "@/lib/auth"
import prisma from "@/lib/database"
import { UploadApiResponse } from "cloudinary"

const Navbar = async () => {
    const session = await useAuth()
    const response = await getCategories()
    
    const categories = response.status === StatusCodes.OK 
        ? response.data?.map(cat => ({
            label: cat.name,
            href: `/category/${cat.slug}`
          })) || []
        : []

    let userPhoto: UploadApiResponse | null = null
    
    if (session?.user?.id) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { photo: true }
        })
        userPhoto = user?.photo as UploadApiResponse | null
    }

    return <NavbarClient categories={categories} userPhoto={userPhoto} />
}

export default Navbar
