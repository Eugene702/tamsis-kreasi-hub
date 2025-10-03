"use client"

import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react"
import useStore from "../store"
import Image from "next/image"

const ImageProperties = () => {
    const contentStore = useStore(state => state.content)
    const showImagePropertiesStore = useStore(state => state.showImageProperties)
    const toggleImageToolsStore = useStore(state => state.toggleImageTools)
    const updateContentStore = useStore(state => state.updateContent)
    const fileRef = useRef<HTMLInputElement | null>(null)

    const [file, setFile] = useState<File | null>(null)
    const [altText, setAltText] = useState(showImagePropertiesStore != null && contentStore[showImagePropertiesStore].type === "image" ? contentStore[showImagePropertiesStore].data.alt : "")
    const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target
        if (target) {
            const files = target.files
            if (files && files.length > 0) {
                setFile(files[0])
            }
        }
    }

    const onClickRemoveImage = () => {
        if (showImagePropertiesStore != null) {
            setFile(null)
            updateContentStore(showImagePropertiesStore, { type: "image", data: { src: "", alt: "" } })
            if (fileRef.current) {
                fileRef.current.value = ""
            }
        }
    }

    useEffect(() => {
        let url = ""
        if (file && showImagePropertiesStore != null && contentStore[showImagePropertiesStore].type === "image") {
            url = URL.createObjectURL(file)
            updateContentStore(showImagePropertiesStore, { type: "image", data: { src: url, alt: contentStore[showImagePropertiesStore].data.alt } })
        }

    }, [file])

    useEffect(() => {
        if (showImagePropertiesStore != null && contentStore[showImagePropertiesStore].type === "image") {
            updateContentStore(showImagePropertiesStore, { type: "image", data: { src: contentStore[showImagePropertiesStore].data.src, alt: altText } })
        }
    }, [altText])

    return <div className={`fixed bg-white p-10 shadow-xl w-3/12 top-0 transition-all duration-700 ${showImagePropertiesStore != null ? 'left-0' : '-left-full'} h-full z-50`}>
        <div className="flex justify-end mb-5">
            <button className="btn btn-ghost rounded-xl" onClick={() => toggleImageToolsStore(null)}>Tutup</button>
        </div>

        <div className="space-y-5">
            <section className="space-y-3">
                <h1 className="text-lg">Media</h1>
                <div className="w-full min-h-40 rounded-xl flex justify-center items-center bg-gray-100">
                    <input type="file" name={`file-${showImagePropertiesStore}`} id={`file-${showImagePropertiesStore}`} hidden onChange={onChangeFile} ref={fileRef} />
                    {
                        showImagePropertiesStore != null && contentStore[showImagePropertiesStore].type === "image" && contentStore[showImagePropertiesStore].data.src.trim() !== "" ?
                            <div className="p-10 w-full">
                                <div className="relative w-full h-40 overflow-hidden rounded-xl">
                                    <Image
                                        src={contentStore[showImagePropertiesStore].data.src}
                                        alt={contentStore[showImagePropertiesStore].data.alt}
                                        fill />
                                </div>
                                <div className="mt-5 flex items-center justify-center gap-2">
                                    <label htmlFor={`file-${showImagePropertiesStore}`} className="btn btn-outline rounded-xl">Ganti Gambar</label>
                                    <button className="btn btn-outline rounded-xl" onClick={onClickRemoveImage}>Hapus Gambar</button>
                                </div>
                            </div> : <Fragment>
                                <label className="btn rounded-xl" htmlFor={`file-${showImagePropertiesStore}`}>Pilih Gambar</label>
                            </Fragment>
                    }
                </div>
            </section>

            <section className="space-y-3">
                <h1 className="text-lg">Alt Teks</h1>
                <input 
                    type="text" 
                    className="input input-bordered rounded-2xl input-lg text-sm" 
                    placeholder="Berikan keterangan gambar" 
                    value={showImagePropertiesStore != null && contentStore[showImagePropertiesStore].type === "image" ? contentStore[showImagePropertiesStore].data.alt : altText} 
                    onChange={e => setAltText(e.target.value)} />
            </section>
        </div>
    </div>
}

export default ImageProperties