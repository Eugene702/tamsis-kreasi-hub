import Image from "next/image"
import Link from "next/link"
import { FaEye } from "react-icons/fa"

const CardContent = () => {
    return <Link href="/" className="card bg-base-100 w-full group">
        <figure className="relative">
            <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                className="transform transition-all duration-300 group-hover:scale-125"
                alt="Shoes" />
            <div className="absolute inset-0 bg-gradient-to-t transition-all duration-300 group-hover:from-black/60 group-hover:to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 invisible group-hover:visible">
                <h2 className="text-lg font-semibold line-clamp-1 text-white">Shoes</h2>
            </div>
        </figure>
        <div className="card-body">
            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                    <div className="avatar">
                        <div className="w-8 rounded-full">
                            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                        </div>
                    </div>
                    <p className="line-clamp-1">Eugene</p>
                </div>

                <div className="flex items-center gap-2 justify-self-end">
                    <FaEye />
                    <p>1.2K</p>
                </div>
            </div>
        </div>
    </Link>
}

export default CardContent