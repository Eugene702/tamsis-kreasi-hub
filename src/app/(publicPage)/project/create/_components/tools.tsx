"use client"

import { FaImage } from "react-icons/fa6"
import { MdKeyboardArrowRight } from "react-icons/md"
import { RxText } from "react-icons/rx"
import useStore from "../store"
import { useState } from "react"

const Tools = () => {
    const [showText, setShowText] = useState(false)
    const isShowToolsStore = useStore(state => state.showTools)
    const toggleTools = useStore(state => state.toggleTools)
    const addContentStore = useStore(state => state.addContent)

    const onClickClose = () => {
        setShowText(false)
        toggleTools()
    }

    const addText = ({ type }: { type: "heading" | "heading-text" | "text" }) => {
        addContentStore({ type: "text", data: { heading: type == "heading" || type == "heading-text" ? "Heading" : undefined, text: type == "heading-text" || type === "text" ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui sed officia dolores eos maxime. Illum, tempore magnam? Perspiciatis, quaerat? Sunt recusandae assumenda placeat ad. Doloremque quasi tempore suscipit id amet?" : undefined } })
        onClickClose()
    }

    const addImage = () => {
        addContentStore({ type: "image", data: { src: "", alt: "Placeholder Image" } })
        onClickClose()
    }

    return <div className={`fixed transition-all duration-700 ${isShowToolsStore ? 'right-0' : '-right-full'} top-0 h-full w-auto bg-white p-10 shadow-xl z-50`}>
        <div className="flex justify-start mb-5">
            <button className="btn ghost rounded-xl" onClick={onClickClose}>Tutup</button>
        </div>
        <div className="flex">
            <div className="w-80">
                <ul className="menu menu-lg rounded-box w-full gap-4">
                    <li className="menu-title text-black">Dasar</li>
                    <li><button className="p-4 rounded-xl" onClick={() => setShowText(true)}><RxText size={30} /> <span>Teks</span><MdKeyboardArrowRight size={30} /></button></li>
                    <li><button className="p-4 rounded-xl" onClick={addImage}><FaImage size={30} /> <span>Gambar</span></button></li>
                    {/* <li><button className="p-4 rounded-xl"><GoVideo size={30} /> <span>Video</span></button></li>
                    <li><button className="p-4 rounded-xl"><MdPermMedia size={30} /> <span>Media</span></button></li> */}
                </ul>
            </div>
            <div className={`transition-all duration-700 ${showText ? 'w-80 border-l p-6' : 'w-0 p-0'} border-gray-200 space-y-5 overflow-hidden`}>
                <button className="btn btn-square rounded-xl w-full h-36" onClick={() => addText({ type: "heading" })}>
                    <h1 className="text-xl font-bold">Heading</h1>
                </button>

                <button className="btn btn-square rounded-xl w-full h-36 flex-col items-start p-5" onClick={() => addText({ type: "heading-text" })}>
                    <h1 className="text-xl font-bold">Heading</h1>
                    <p className="font-normal line-clamp-3 text-start">Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui sed officia dolores eos maxime. Illum, tempore magnam? Perspiciatis, quaerat? Sunt recusandae assumenda placeat ad. Doloremque quasi tempore suscipit id amet?</p>
                </button>

                <button className="btn btn-square rounded-xl w-full h-36 flex-col items-start p-5" onClick={() => addText({ type: "text" })}>
                    <p className="font-normal line-clamp-3 text-start">Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui sed officia dolores eos maxime. Illum, tempore magnam? Perspiciatis, quaerat? Sunt recusandae assumenda placeat ad. Doloremque quasi tempore suscipit id amet?</p>
                </button>
            </div>
        </div>
    </div>
}

export default Tools