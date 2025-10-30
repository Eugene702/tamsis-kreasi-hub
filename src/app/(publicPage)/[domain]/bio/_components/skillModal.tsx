"use client"

import { useEffect, useRef, useState } from "react"
import { Portal } from "@headlessui/react"
import { useStore } from "../store"
import dynamic from "next/dynamic"
import { useMutation } from "@tanstack/react-query"
import { addSkill, deleteSkill, getSkill, updateSkill } from "../action"
import { useDebouncedCallback } from "use-debounce"
import { useFormik } from "formik"
import { object } from "yup"
import { useParams } from "next/navigation"
import { StatusCodes } from "http-status-codes"
import { showToast } from "@/lib/alert"

const Combobox = dynamic(() => import('@/components/Combobox'))
const SkillModal = () => {
    const params = useParams() as { domain: string }
    const ref = useRef<HTMLDialogElement>(null)
    const [ isLoading, setIsLoading ] = useState(false)

    const showModalStore = useStore(state => state.showModal)
    const dataModalStore = useStore(state => state.dataModal)
    const closeModalStore = useStore(state => state.closeModal)

    const { data, isPending, mutate } = useMutation({
        mutationKey: ['FetchSkill'],
        mutationFn: async (query: string) => await getSkill(query)
    })

    const schema = object().shape({
        skill: object().required("Kemampuan wajib diisi!")
    })

    const { values, setFieldValue, errors, handleSubmit, isSubmitting, setFieldError, resetForm } = useFormik({
        validationSchema: schema,
        initialValues: {
            skill: null as { id: string, text: string } | null
        },
        onSubmit: async e => {
            const response = dataModalStore ? await updateSkill(params.domain, dataModalStore.id, e.skill?.id!) : await addSkill(params.domain, e.skill!.id)
            if(response.status === StatusCodes.OK){
                showToast({ title: response.message, icon: "success" })
                resetForm()
                closeModalStore()
            }else if(response.status === StatusCodes.CONFLICT){
                setFieldError('skill', response.message)
            }else{
                showToast({ title: response.message, icon: "error" })
            }
        }
    })

    const handleChangeCombobox = useDebouncedCallback((value: string) => mutate(value), 300)
    const handleOnSelected = (data: { id: string, text: string } | null) => setFieldValue('skill', data)
    const handleOnClickDelete = async () => {
        setIsLoading(true)
        const response = await deleteSkill(params.domain, dataModalStore?.id!)
        setIsLoading(false)

        if(response.status === StatusCodes.OK){
            showToast({ title: response.message, icon: "success" })
            resetForm()
            closeModalStore()
        }else{
            showToast({ title: response.message, icon: "error" })
        }
    }

    useEffect(() => {
        if (ref.current) {
            if (showModalStore != null) {
                ref.current.showModal()
            } else {
                ref.current.close()
            }
        }
    }, [showModalStore])

    return <dialog ref={ref} className="modal">
        <div className="modal-box !overflow-visible !z-[1200]">
            <h3 className="font-bold text-lg">{dataModalStore ? `Edit kemampuan [${dataModalStore.name}]` : "Tambah Kemampuan"}</h3>
            <div className="py-4">
                <form onSubmit={handleSubmit}>
                    <Combobox
                        isLoading={isPending}
                        data={data ? data.data!.map(e => ({ id: e.id, text: e.name })) : []}
                        onChange={handleChangeCombobox}
                        value={values.skill}
                        onSelect={handleOnSelected} />
                    {errors.skill && <span className="text-error">{errors.skill}</span>}

                    <div className="mt-5 flex justify-end items-center gap-4">
                        { dataModalStore && <button className="btn btn-error !rounded-xl text-white btn-sm" disabled={ isSubmitting || isLoading } onClick={handleOnClickDelete}>
                            { isLoading && <div className="loading"></div> }
                            <span>Hapus Kemampuan</span>
                        </button> }
                        <button type="submit" className="btn btn-primary btn-sm !rounded-xl" disabled={ isSubmitting || isLoading }>
                            {isSubmitting && <div className="loading"></div>}
                            <span>Simpan</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div className="modal-backdrop cursor-pointer" onClick={closeModalStore}></div>
    </dialog>
}

export default SkillModal