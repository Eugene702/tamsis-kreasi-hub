"use client"

import { TbPlus } from "react-icons/tb"
import { useStore } from "../store"

const AddSkillButton = () => {
    const showModalStore = useStore(state => state.showModal)
    return <button className="btn btn-primary !rounded-xl text-white" onClick={() => showModalStore({ type: "ADD" })}>
        <TbPlus />
        <span>Tambah Kemampuan</span>
    </button>
}

export default AddSkillButton
