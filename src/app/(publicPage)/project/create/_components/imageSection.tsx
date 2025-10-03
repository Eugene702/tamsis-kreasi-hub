"use client"

import Image from "next/image"
import useStore from "../store"
import dynamic from "next/dynamic"

type Props = {
    index: number,
    src: string,
    alt: string
}

const ToolSection = dynamic(() => import('./toolSection'))

const ImageSection = ({ index, src, alt }: Props) => {
    const toggleImageTools = useStore(state => state.toggleImageTools)
    const setToolSectionStore = useStore(state => state.setToggleToolsSection)
    const onClick = () => {
        toggleImageTools(index)
        setToolSectionStore(index)
    }
    return <div className="relative">
        <img
            src={src.trim() === "" ? "https://placehold.co/600x400" : src}
            alt={alt}
            onClick={onClick}
            className="w-full cursor-pointer" />

        <ToolSection index={index} />
    </div>
}

export default ImageSection