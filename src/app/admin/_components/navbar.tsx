"use client"

import { showToast } from "@/lib/alert"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Navbar = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)

    const handleOnClickSignOut = async () => {
        try{
            setLoading(true)
            await signOut({ redirect: false })
            router.push("/")
        }catch{
            showToast({ icon: "error", title: "Gagal logout, silahkan coba lagi" })
        }finally{
            setLoading(false)
        }
    }
    return <div className="navbar">
        <div className="flex-1"></div>
        <div className="flex-none">
            <button className="btn btn-ghost btn-error !rounded-xl btn-sm hover:text-white" onClick={handleOnClickSignOut} disabled={loading}>
                { loading && <div className="loading"></div> }
                <span>Logout</span>
            </button>
        </div>
    </div>
}

export default Navbar