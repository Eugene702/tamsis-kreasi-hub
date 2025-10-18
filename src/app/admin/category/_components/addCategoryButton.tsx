"use client"

import { TbPlus } from "react-icons/tb"
import { useStore } from "../store"

const AddCategoryButton = () => {
    const showModalStore = useStore(state => state.showModal)
    return <button className="btn btn-primary !rounded-xl text-white" onClick={() => showModalStore({ type: "ADD" })}>
        <TbPlus />
        <span>Tambah Kategori</span>
    </button>
}

export default AddCategoryButton