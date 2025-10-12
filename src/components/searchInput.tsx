"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent } from "react"
import { FiSearch } from "react-icons/fi"
import { useDebouncedCallback } from "use-debounce"

type Props = {
    placeholder?: string,
    label?: string
}

const SearchInput = ({ placeholder, label }: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSearch = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        if (e.target.value.trim().length > 0) {
            params.set("search", e.target.value)
        } else {
            params.delete("search")
        }

        router.replace(`?${params.toString()}`)
    }, 500)

    return <fieldset className="fieldset">
        <legend className="fieldset-legend">{label ?? "Cari"}</legend>
        <label className="input input-bordered !rounded-xl">
            <FiSearch className="w-5 h-5 opacity-70" />
            <input type="text" placeholder={placeholder ?? "Cari..."} onChange={handleSearch} defaultValue={searchParams.get("search") ?? ""} />
        </label>
    </fieldset>
}

export default SearchInput