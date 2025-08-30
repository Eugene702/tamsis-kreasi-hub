import Image from "next/image"
import Link from "next/link"

const CardContent = () => {
    return <div className="w-full">
        <Link href="/project/ejhhsahbd" className="group block">
            <div className="rounded-xl h-80 overflow-hidden relative">
                <Image src={"/temp.png"} layout="fill" objectFit="cover" alt="Project" className="transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-semibold text-lg drop-shadow-sm">Judul Project</h3>
                </div>
            </div>
        </Link>

        <div className="flex justify-between items-center">
            <Link href="/suwir" className="mt-4 flex items-center gap-4 flex-1">
                <div className="rounded-full relative overflow-auto w-8 h-8">
                    <Image src={"/temp.png"} layout="fill" objectFit="cover" alt="" />
                </div>
                <p>Suwir</p>
            </Link>

            <div className="flex items-center gap-2 flex-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span>1.2K</span>
            </div>
        </div>
    </div>
}

export default CardContent