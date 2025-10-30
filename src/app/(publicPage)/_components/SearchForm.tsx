"use client"

import { useRouter } from "next/navigation"
import { useState, FormEvent } from "react"

const SearchForm = () => {
    const router = useRouter()
    const [search, setSearch] = useState('')

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (search.trim()) {
            router.push(`/artwork?search=${encodeURIComponent(search.trim())}`)
        } else {
            router.push('/artwork')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="pt-2">
            <div className="join w-full input input-xl text-sm !rounded-full items-center px-2 pr-3 gap-1 bg-base-100/90">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="join-item w-full bg-transparent focus:outline-none"
                    placeholder="Kreativitas apa yang ingin Anda temukan hari ini?"
                    aria-label="Cari kreativitas"
                />
                <button 
                    type="submit"
                    className="btn bg-emerald-700 hover:bg-emerald-600 btn-circle !rounded-full min-h-10 h-10 w-10" 
                    aria-label="Cari"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-white w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </div>
        </form>
    )
}

export default SearchForm
