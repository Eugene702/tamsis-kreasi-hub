"use client"

import Image from "next/image"

const PhotoProfile = ({ url, name }: { url: string, name: string }) => {
    return <div className="relative">
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden ring-2 ring-base-200 shadow-sm">
            <Image
                src={url}
                alt={name}
                fill
                className="object-cover" />
        </div>
    </div>
}

export default PhotoProfile