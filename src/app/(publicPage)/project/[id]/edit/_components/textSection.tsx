"use client"

import dynamic from "next/dynamic"
import useStore from "../store"

const Textarea = dynamic(() => import('@/components/textarea'))
const ToolSection = dynamic(() => import('./toolSection'))

const TextSection = ({ index }: { index: number }) => {
    const contentStore = useStore(state => state.content)
    const updateContentStore = useStore(state => state.updateContent)
    const setToolSectionStore = useStore(state => state.setToggleToolsSection)

    const content = contentStore[index]
    if (content.type !== "text") return null
    const { heading, text } = content.data

    const onFocus = () => {
        setToolSectionStore(index)
    }

    return <section className="relative">
        {heading && <Textarea isFocus={onFocus} value={heading} placeholder="Berikan judul karya mu..." onChange={value => updateContentStore(index, { ...content, data: { ...content.data, heading: value.trim() == "" ? "Sub Judul" : value } })} />}
        {text && <Textarea isFocus={onFocus} value={text} placeholder="Berikan deskripsi karya mu..." onChange={value => updateContentStore(index, { ...content, data: { ...content.data, text: value.trim() == "" ? "Deskripsi" : value } })} className="text-base" />}
        <ToolSection index={index} />
    </section>
}

export default TextSection