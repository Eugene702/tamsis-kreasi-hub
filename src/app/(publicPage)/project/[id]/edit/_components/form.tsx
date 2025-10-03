"use client"

import { useEffect, useRef, useState } from "react"
import { FaPlus } from "react-icons/fa6"
import useStore from "../store"
import dynamic from "next/dynamic"

const Textarea = dynamic(() => import('@/components/textarea'))
const TextSection = dynamic(() => import('./textSection'))
const ImageSection = dynamic(() => import('./imageSection'))

const Form = () => {
    const [title, setTitle] = useState("")
    const titleRef = useRef(null)
    const toggleTools = useStore(state => state.toggleTools)
    const contentStore = useStore(state => state.content)

    useEffect(() => {
        if (titleRef.current) {
            const current = titleRef.current as HTMLTextAreaElement
            current.style.height = "auto"
            current.style.height = current.scrollHeight + "px"
        }
    }, [title])

    return <article className="space-y-4">
        <Textarea value={title} placeholder="Berikan judul karya mu..." onChange={setTitle} />
        {
            contentStore.map((e, index) => {
                if(e.type === "text"){
                    return <TextSection index={index} key={index} />
                }else if(e.type === "image"){
                    return <ImageSection index={index} src={e.data.src} alt={e.data.alt} key={index} />
                }else if(e.type === "video"){
                    return <video src={e.data} controls />
                }else if(e.type === "media") {
                    return <div className="grid grid-cols-3 gap-2" key={index}>
                        {e.data.map((img, idx) => <img src={img} alt="" key={idx} />)}
                    </div>
                }
            })
        }

        <div className="divider mt-20">
            <button className="btn btn-outline border-gray-300 rounded-full" onClick={toggleTools}>
                <FaPlus />
                <span>Tambah Blok Baru</span>
            </button>
        </div>
    </article>
}

export default Form