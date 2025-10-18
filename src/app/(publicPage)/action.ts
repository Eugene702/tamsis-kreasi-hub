"use server"

import prisma from "@/lib/database"
import { StatusCodes } from "http-status-codes"

export const GET = async () => {
    try{
        const [categories, userProjects] = await Promise.all([
            prisma.categories.findMany({
                relationLoadStrategy: "join",
                take: 10,
                orderBy: [
                    { userProjects: { _count: "desc" } },
                    { name: "asc" }
                ]
            }),

            prisma.userProject.findMany({
                relationLoadStrategy: "join",
                take: 8,
                orderBy:[
                    { createdAt: "desc" },
                    { userProjectViews: { _count: "desc" } }
                ]
            })
        ])

        return {
            status: StatusCodes.OK,
            message: "Berhasil mengambil data!",
            data: { categories, userProjects }
        }
    }catch(e){
        console.error(e)
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Ada kesalahan pada server!"
        }
    }
}