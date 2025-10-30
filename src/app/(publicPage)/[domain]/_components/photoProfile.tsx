"use client"

import Image from "next/image"
import { ChangeEvent, useState } from "react"
import { TbPencil } from "react-icons/tb"

const PhotoProfile = ({ url, name }: { url: string, name: string }) => {
    const [ isLoading, setIsLoading ] = useState(false)
    const handleOnChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if(files && files.length > 0){
            
        }
    }

    return <div className="relative">
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden ring-2 ring-base-200 shadow-sm">
            <Image
                src={url}
                alt={name}
                fill
                className="object-cover" />
        </div>
        <input type="file" name="file" id="file" className="hidden" />
        <label htmlFor="file" className="absolute btn btn-circle btn-sm btn-primary z-50 right-0 bottom-2">
            <TbPencil />
        </label>
    </div>
}

export default PhotoProfile