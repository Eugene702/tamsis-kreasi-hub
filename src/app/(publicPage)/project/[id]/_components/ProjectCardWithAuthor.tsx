import Image from "next/image"
import Link from "next/link"
import { FaEye } from "react-icons/fa"
import { UploadApiResponse } from "cloudinary"

type ProjectCardWithAuthorProps = {
    domain: string
    title: string
    banner: UploadApiResponse
    viewsCount: number
    user: {
        name: string
        photo: UploadApiResponse | null
    }
}

const ProjectCardWithAuthor = ({ domain, title, banner, viewsCount, user }: ProjectCardWithAuthorProps) => {
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
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-emerald-600 transition mb-2">
                {title}
            </h3>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 relative rounded-full overflow-hidden">
                        <Image 
                            src={user.photo?.url || "/assets/images/logo.png"} 
                            alt={user.name} 
                            fill 
                            className="object-cover" />
                    </div>
                    <span className="text-xs text-base-content/60 line-clamp-1">{user.name}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-base-content/60">
                    <FaEye className="w-3 h-3" />
                    {viewsCount.toLocaleString('id-ID')}
                </div>
            </div>
        </Link>
    )
}

export default ProjectCardWithAuthor
