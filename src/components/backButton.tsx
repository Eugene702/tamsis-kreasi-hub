"use client"

import { useRouter } from "next/navigation"
import { FiArrowLeft } from "react-icons/fi"

const BackButton = () => {
    const router = useRouter()

    return <button className="btn btn-primary !rounded-xl btn-sm" onClick={() => router.back()}>
        <FiArrowLeft />
        <span>Kembali</span>
    </button>
}

export default BackButton