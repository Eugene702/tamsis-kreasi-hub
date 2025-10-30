import dynamic from "next/dynamic"
import Link from "next/link"
import { Fragment } from "react"
import { getProject } from "./action"
import { StatusCodes } from "http-status-codes"
import { UploadApiResponse } from "cloudinary"
import { useAuth } from "@/lib/auth"

const CardContent = dynamic(() => import('@/components/cardContent'))
const Error = dynamic(() => import('@/components/error'))

const page = async ({ params }: { params: Promise<{ domain: string }> }) => {
    const { domain } = await params
    const response = await getProject(domain)
    
    if(response.status != StatusCodes.OK){
        return <Error message={response.message} />
    }

    // Cek apakah user login dan sedang melihat profilnya sendiri
    const session = await useAuth()
    const isOwner = session?.user?.id === domain

    return <Fragment>
        <div className="grid grid-cols-4 gap-6">
            {/* Card upload hanya muncul untuk owner profil yang login */}
            {isOwner && (
                <Link href="/project/create" className="border border-dashed rounded-xl p-4 flex flex-col justify-center items-center border-gray-400 text-center space-y-4 hover:border-emerald-500 hover:bg-emerald-50/5 transition">
                    <p className="text-4xl font-bold">Unggah Karya Terbaru</p>
                    <p className="text-gray-400">Berikan karya terbaikmu untuk ditampilkan di sini.</p>
                </Link>
            )}
            {
                response.data?.map((e, index) => <CardContent 
                    key={index} 
                    title={e.title} 
                    href={`/project/${e.domain}`}
                    user={{ name: e.user.name, photo: e.user.photo as UploadApiResponse }}
                    banner={e.banner as UploadApiResponse}
                    views={e._count.userProjectViews} />)
            }
        </div>
    </Fragment>
}

export default page