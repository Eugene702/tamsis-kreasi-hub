"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

const Pagination = ({ hasNext, hasPrev }: { hasNext: boolean, hasPrev: boolean }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const handleOnClickPrev = () => {
        const params = new URLSearchParams(searchParams.toString())
        if(params.has("page") && parseInt(params.get("page")!) > 1){
            params.set("page", (parseInt(params.get("page")!) - 1).toString())
        }else{
            params.delete("page")
        }

        router.replace(`?${params.toString()}`)
    }

    const handleOnClickNext = () => {
        const params = new URLSearchParams(searchParams.toString())
        if(params.has("page")){
            params.set("page", (parseInt(params.get("page")!) + 1).toString())
        }else{
            params.set("page", "2")
        }

        router.replace(`?${params.toString()}`)
    }

    return <div className="join">
        <button className="join-item btn !rounded-xl" disabled={!hasPrev} onClick={handleOnClickPrev}><FiChevronLeft /></button>
        <button className="join-item btn !rounded-xl">Halaman { searchParams.has("page") ? searchParams.get("page") : 1 }</button>
        <button className="join-item btn !rounded-xl" disabled={!hasNext} onClick={handleOnClickNext}><FiChevronRight /></button>
    </div>
}

export default Pagination