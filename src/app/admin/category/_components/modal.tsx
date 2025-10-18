"use client"

import { useEffect, useRef } from "react"
import { useStore } from "../store"
import { object, string } from "yup"
import { useFormik } from "formik"
import { POST, UPDATE } from "../action"
import { StatusCodes } from "http-status-codes"
import { showToast } from "@/lib/alert"
import { MdClose } from "react-icons/md"

const Modal = () => {
    const ref = useRef<HTMLDialogElement>(null)
    const modalStore = useStore(state => state.modal)
    const closeModalStore = useStore(state => state.closeModal)

    const schema = object().shape({
        name: string().required("Nama kategori wajib diisi"),
        slug: string().required("Slug wajib diisi!")
    })

    const { values, errors, handleChange, handleSubmit, isSubmitting, resetForm, setFieldError, setFieldValue } = useFormik({
        validationSchema: schema,
        initialValues: {
            name: "",
            slug: ""
        },
        onSubmit: async e => {
            if (modalStore.type === "ADD") {
                const response = await POST(e.name, e.slug)
                if (response.status === StatusCodes.OK) {
                    resetForm()
                    closeModalStore()
                    showToast({ icon: "success", title: response.message })
                } else if (response.status === StatusCodes.CONFLICT) {
                    setFieldError("name", response.message)
                } else {
                    showToast({ icon: "error", title: response.message })
                }
            } else {
                const response = await UPDATE(modalStore.data?.id!, e.name, modalStore.data?.name!, e.slug, modalStore.data?.slug!)
                if (response.status === StatusCodes.OK) {
                    resetForm()
                    closeModalStore()
                    showToast({ icon: "success", title: response.message })
                } else if (response.status === StatusCodes.CONFLICT) {
                    setFieldError("name", response.message)
                } else {
                    showToast({ icon: "error", title: response.message })
                }
            }
        }
    })

    useEffect(() => {
        if (ref.current) {
            if (modalStore.type != null) {
                ref.current.showModal()
                if (modalStore.type === "EDIT") {
                    setFieldValue("name", modalStore.data?.name || "")
                }
            } else {
                resetForm()
                ref.current.close()
            }
        }
    }, [modalStore])

    useEffect(() => {
        if(values.name.trim() != ""){
            const slug = values.name.toLowerCase().replaceAll(" ", "-")
            setFieldValue("slug", slug)
        }
    }, [values.name])

    return <dialog ref={ref} className="modal">
        <div className="modal-box">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{modalStore.type === "ADD" ? "Tambah Kategori" : "Edit Kategori"}</h3>
                <button className="btn btn-ghost btn-circle" onClick={closeModalStore}><MdClose /></button>
            </div>
            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Nama Kategori</legend>
                        <input type="text" className="input input-bordered !rounded-xl w-full" placeholder="Web Development" name="name" value={values.name} onChange={handleChange} />
                        {errors.name && <span className="fieldset-label text-error">{errors.name}</span>}
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Slug</legend>
                        <input type="text" className="input input-bordered !rounded-xl w-full" placeholder="web-development" name="slug" value={values.slug} onChange={handleChange} />
                        {errors.slug && <span className="fieldset-label text-error">{errors.slug}</span>}
                    </fieldset>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary btn-sm !rounded-xl" disabled={isSubmitting}>
                        {isSubmitting && <div className="loading"></div>}
                        <span>Simpan</span>
                    </button>
                </div>
            </form>
        </div>
        <div className="modal-backdrop cursor-pointer" onClick={closeModalStore}></div>
    </dialog>
}

export default Modal