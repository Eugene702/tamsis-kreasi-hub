import { UploadApiResponse } from "cloudinary"
import Image from "next/image"
import Link from "next/link"
import { FaEye } from "react-icons/fa"

type Props = {
    href: string,
    banner?: UploadApiResponse,
    title: string,
    views: number,
    user: {
        name: string,
        photo?: UploadApiResponse,
    }
}

const CardContent = (props: Props) => {
    return <Link href={props.href} className="card bg-base-100 w-full group h-96">
        <figure className="relative h-56">
            <Image
                src={props.banner ? props.banner.url : "/assets/images/logo.png"}
                width={100}
                height={100}
                className="w-full h-auto transform transition-all duration-300 group-hover:scale-125"
                alt={props.title} />
            <div className="absolute inset-0 bg-gradient-to-t transition-all duration-300 group-hover:from-black/60 group-hover:to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 invisible group-hover:visible">
                <h2 className="text-lg font-semibold line-clamp-1 text-white">{ props.title }</h2>
            </div>
        </figure>
        <div className="card-body">
            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                    <div className="avatar">
                        <div className="w-8 rounded-full">
                            <Image
                                src={props.user.photo ? props.user.photo.url : "/assets/images/logo.png"}
                                width={32}
                                height={32}
                                alt={props.user.name} />
                        </div>
                    </div>
                    <p className="line-clamp-1">{ props.user.name }</p>
                </div>

                <div className="flex items-center gap-2 justify-self-end">
                    <FaEye />
                    <p>{ props.views }</p>
                </div>
            </div>
        </div>
    </Link>
}

export default CardContent