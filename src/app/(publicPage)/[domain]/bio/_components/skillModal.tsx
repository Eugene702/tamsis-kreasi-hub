"use client"

import { useEffect, useRef } from "react"
import { useStore } from "../store"
import dynamic from "next/dynamic"
import { useMutation } from "@tanstack/react-query"
import { getSkill } from "../action"
import { useDebouncedCallback } from "use-debounce"
import { useFormik } from "formik"
import { object, string } from "yup"

const Combobox = dynamic(() => import('@/components/combobox'))
const SkillModal = () => {
    const ref = useRef<HTMLDialogElement>(null)

    const showModalStore = useStore(state => state.showModal)
    const dataModalStore = useStore(state => state.dataModal)
    const closeModalStore = useStore(state => state.closeModal)

    const { data, isPending, mutate } = useMutation({
        mutationKey: ['FetchSkill'],
        mutationFn: async (query: string) => await getSkill(query)
    })

    const schema = object().shape({
        skill: string().required("Kemampuan wajib diisi!")
    })

    const { values, setFieldValue, errors, handleSubmit, isSubmitting } = useFormik({
        validationSchema: schema,
        initialValues: {
            skill: dataModalStore ? { id: dataModalStore.id, text: dataModalStore.name } : null
        },
        onSubmit: async e => {

        }
    })

    const handleChangeCombobox = useDebouncedCallback((value: string) => mutate(value), 300)
    const handleOnSelected = (id: string) => setFieldValue('skill', id)
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
        <div className="modal-box">
            <h3 className="font-bold text-lg">{dataModalStore ? `Edit kemampuan ${dataModalStore.name}` : "Tambah Kemampuan"}</h3>
            <div className="py-4">
                <form onSubmit={handleSubmit}>
                    <Combobox 
                        isLoading={isPending} 
                        data={data ? data.data!.map(e => ({ id: e.id, text: e.name })) : []} 
                        onChange={handleChangeCombobox} 
                        value={values.skill}
                        onSelect={handleOnSelected} />
                    { errors.skill && <span className="text-error">{ errors.skill }</span> }

                    <div className="mt-2 flex justify-end">
                        <button type="submit" className="btn btn-primary btn-sm !rounded-xl">
                            { isSubmitting && <div className="loading"></div> }
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