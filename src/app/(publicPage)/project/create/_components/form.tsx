"use client"

import EditorJS, { OutputData } from "@editorjs/editorjs"
import Header from "@editorjs/header"
import EditorjsList from '@editorjs/list'
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { create, FindAllType, uploadImage } from "../action"
import { StatusCodes } from "http-status-codes"
import CustomImageTools from "@/lib/editorJs/CustomImageTools"
import Quote from "@editorjs/quote"
import { useFormik } from "formik"
import { array, mixed, object, string } from "yup"
import { showToast } from "@/lib/alert"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { FaPlus } from "react-icons/fa"

const Form = ({ data }: { data: FindAllType }) => {
    const { data: session } = useSession()
    const router = useRouter()
    const editorJs = useRef<EditorJS | null>(null)
    const inputImageRef = useRef<HTMLInputElement>(null)
    const [isMounted, setIsMounted] = useState(false)

    const schema = object().shape({
        image: mixed()
            .test({
                name: "fileType",
                message: "Format gambar tidak valid!",
                test: value => {
                    const TYPE = ["image/jpg", "image/jpeg", "image/png", "image/webp", "image/gif"]
                    const val = value as File
                    if (!val) return true
                    return TYPE.includes(val.type)
                }
            }),
        title: string().required("Judul karya tidak boleh kosong!"),
        domain: string().required("Domain karya tidak boleh kosong!"),
        category: array().min(1, "Pilih minimal 1 kategori!"),
    })

    const { values, errors, handleChange, handleSubmit, isSubmitting, setFieldError, setFieldValue } = useFormik({
        validationSchema: schema,
        initialValues: {
            image: null as null | File,
            title: "",
            domain: "",
            content: null as null | OutputData,
            category: [] as string[]
        },
        onSubmit: async e => {
            if (!editorJs.current) return
            const content = await editorJs.current.save()
            if (content.blocks.length > 0) {
                await setFieldValue("content", content)

                const response = await create({ title: e.title, domain: e.domain, content, category: e.category }, values.image!)
                if (response.status === StatusCodes.OK) {
                    showToast({ title: response.message, icon: "success" })
                    router.push(`/${session?.user.id}`)
                } else if (response.status === StatusCodes.CONFLICT) {
                    setFieldError("domain", response.data?.domain!)
                } else {
                    showToast({ title: response.message, icon: "error" })
                }
            } else {
                setFieldError("content", "Konten wajib di isi!")
            }
        }
    })

    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true)
        }
    }, [isMounted])

    useEffect(() => {
        const formattedDomain = values.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
        setFieldValue("domain", formattedDomain)
    }, [values.title])

    useEffect(() => {
        if (!isMounted) return

        const initEditor = () => {
            if (editorJs.current) {
                return
            }

            const editor = new EditorJS({
                holder: "editorjs",
                autofocus: true,
                placeholder: "Buat konten proyekmu disini...",
                tools: {
                    header: {
                        class: Header as any,
                        config: {
                            placeholder: "Ketikkan header...",
                            levels: [1, 2, 3, 4, 5, 6],
                            defaultLevel: 2
                        }
                    },
                    list: EditorjsList,
                    image: {
                        class: CustomImageTools,
                        inlineToolbar: true,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    const response = await uploadImage(file)
                                    if (response.status === StatusCodes.OK) {
                                        return {
                                            success: 1,
                                            file: {
                                                url: response.data!.url,
                                                data: response.data
                                            }
                                        }
                                    } else {
                                        return {
                                            success: 0,
                                        }
                                    }
                                }
                            },
                        }
                    },
                    quote: Quote
                }
            })

            editorJs.current = editor
        }

        initEditor()
        return () => {
            if (editorJs.current && editorJs.current.destroy) {
                editorJs.current.destroy()
            }
            editorJs.current = null
        }
    }, [isMounted])

    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setFieldValue("image", files[0])
        }

        inputImageRef.current!.value = ""
    }

    return <form className="grid grid-cols-3 gap-6 w-full" onSubmit={handleSubmit}>
        <div className="w-full col-span-2">
            <div className="prose !w-full max-w-none">
                {isMounted && <div id="editorjs"></div>}
                {errors.content && <span className="fieldset-label text-error">{errors.content}</span>}
            </div>
        </div>

        <div className="space-y-4">
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Gambar Utama</legend>
                {
                    values.image && !errors.image ? <div className="w-full space-y-2">
                        <Image
                            src={URL.createObjectURL(values.image)}
                            width={0}
                            height={0}
                            className="relative w-full h-auto"
                            alt="Temporary" />
                        <button type="button" className="btn btn-error btn-outline !rounded-xl w-full" onClick={() => setFieldValue("image", null)}>Hapus Gambar</button>
                    </div> : <label className="btn btn-outline !rounded-xl">
                        <input type="file" className="hidden" ref={inputImageRef} onChange={handleChangeImage} />
                        <span>Unggah Gambar</span>
                    </label>
                }

                {errors.image && <span className="fieldset-label text-error">{errors.image}</span>}
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Judul Karya</legend>
                <textarea name="title" id="title" className="textarea textarea-borderer !rounded-xl w-full" placeholder="Buat judul karya mu..." value={values.title} onChange={handleChange}></textarea>
                {errors.title && <span className="fieldset-label text-error">{errors.title}</span>}
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Domain</legend>
                <textarea name="domain" id="domain" className="textarea textarea-borderer !rounded-xl w-full" placeholder="Buat domain karya mu..." value={values.domain} onChange={handleChange}></textarea>
                {errors.domain && <span className="fieldset-label text-error">{errors.domain}</span>}
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Kategori</legend>
                <div className="flex flex-wrap gap-2">
                    {
                        data.data?.map((e, index) => <label className="label" key={index}>
                            <input type="checkbox" name="category" className="checkbox" value={e.id} onChange={handleChange} />
                            { e.name }
                        </label>)
                    }
                </div>
                {errors.category && <span className="fieldset-label text-error">{errors.category}</span>}
            </fieldset>

            <div className="flex justify-end">
                <button type="submit" className="btn btn-primary !rounded-xl" disabled={isSubmitting}>
                    {isSubmitting && <div className="loading"></div>}
                    <span>Simpan</span>
                </button>
            </div>
        </div>
    </form>
}

export default Form