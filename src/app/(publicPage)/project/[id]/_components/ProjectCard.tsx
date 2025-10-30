import Image from "next/image"
import Link from "next/link"
import { FaEye } from "react-icons/fa"
import { UploadApiResponse } from "cloudinary"

type ProjectCardProps = {
    domain: string
    title: string
    banner: UploadApiResponse
    viewsCount: number
}

const ProjectCard = ({ domain, title, banner, viewsCount }: ProjectCardProps) => {
    return (
        <Link href={`/project/${domain}`} className="group">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                <Image 
                    src={banner?.url || "/assets/images/logo.png"} 
                    alt={title} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-emerald-600 transition">
                {title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-base-content/60 mt-1">
                <FaEye className="w-3 h-3" />
                {viewsCount.toLocaleString('id-ID')}
            </div>
        </Link>
    )
}

export default ProjectCard
