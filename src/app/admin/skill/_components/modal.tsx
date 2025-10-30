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
        name: string().required("Nama kemampuan wajib diisi")
    })

    const { values, errors, handleChange, handleSubmit, isSubmitting, resetForm, setFieldError, setFieldValue } = useFormik({
        validationSchema: schema,
        initialValues: {
            name: ""
        },
        onSubmit: async e => {
            if (modalStore.type === "ADD") {
                const response = await POST(e.name)
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
                const response = await UPDATE(modalStore.data?.id!, e.name, modalStore.data?.name!)
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
    }, [modalStore, resetForm, setFieldValue])

    return <dialog ref={ref} className="modal">
        <div className="modal-box">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{modalStore.type === "ADD" ? "Tambah Kemampuan" : "Edit Kemampuan"}</h3>
                <button className="btn btn-ghost btn-circle" onClick={closeModalStore}><MdClose /></button>
            </div>
            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Nama Kemampuan</legend>
                    <input type="text" className="input input-bordered !rounded-xl w-full" placeholder="Next.js, TypeScript, dll" name="name" value={values.name} onChange={handleChange} />
                    {errors.name && <span className="fieldset-label text-error">{errors.name}</span>}
                </fieldset>

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
