"use client"

import { useEffect, useRef } from "react"
import { useStore } from "../store"

const SkillModal = () => {
    const ref = useRef<HTMLDialogElement>(null)
    const refInput = useRef<HTMLInputElement>(null)

    const showModalStore = useStore(state => state.showModal)
    const dataModalStore = useStore(state => state.dataModal)
    const closeModalStore = useStore(state => state.closeModal)

    useEffect(() => {
        if(ref.current){
            if(showModalStore != null){
                ref.current.showModal()
            }else{
                ref.current.close()
            }
        }
    }, [showModalStore])

    return <dialog ref={ref} className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg">{ dataModalStore ? `Edit kemampuan ${dataModalStore.name}` : "Tambah Kemampuan" }</h3>
            <div className="py-4">
                <form>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Pilih Kemampuan</legend>
                        <div className="relative w-full">
                            <input type="text" className="input input-bordered w-full !rounded-xl" placeholder="Pilih Kemampuan" ref={refInput} />
                            <div className="absolute w-full top-10 shadow-xl rounded-xl p-6 bg-white"></div>
                        </div>
                    </fieldset>

                    <div className="mt-2 flex justify-end">
                        <button type="submit" className="btn btn-primary btn-sm !rounded-xl">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
        <div className="modal-backdrop cursor-pointer" onClick={closeModalStore}></div>
    </dialog>
}

export default SkillModal