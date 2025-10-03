"use client"

import { FiArrowLeft } from "react-icons/fi"

const BackButton = () => {
    return <button className="btn btn-primary !rounded-xl btn-sm">
        <FiArrowLeft />
        <span>Kembali</span>
    </button>
}

export default BackButton