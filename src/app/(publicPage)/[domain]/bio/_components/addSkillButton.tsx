"use client"

import { TbPlus } from "react-icons/tb"
import { useStore } from "../store"

const AddSkillButton = () => {
    const openModalStore = useStore(state => state.openModal)
    const handleOnClick = () => {
        openModalStore("ADD")
    }

    return <button className="btn btn-circle btn-sm" onClick={handleOnClick}><TbPlus /></button>
}

export default AddSkillButton