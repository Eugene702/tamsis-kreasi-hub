"use client"

import { useSearchParams } from "next/navigation"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

const Pagination = ({ hasNext, hasPrev }: { hasNext: boolean, hasPrev: boolean }) => {
    const searchParams = useSearchParams()

    return <div className="join">
        <button className="join-item btn" disabled={!hasPrev}><FiChevronLeft /></button>
        <button className="join-item btn">Halaman { searchParams.has("page") ? searchParams.get("page") : 1 }</button>
        <button className="join-item btn" disabled={!hasNext}><FiChevronRight /></button>
    </div>
}

export default Pagination