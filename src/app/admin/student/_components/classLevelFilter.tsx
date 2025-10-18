"use client"

import dynamic from "next/dynamic"
import { useRouter, useSearchParams } from "next/navigation"

const ComboboxFilter = dynamic(() => import('@/components/comboboxFilter'))
const ClassLevelFilter = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const onChange = (e: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if(e.trim() != ""){
            params.set("classLevel", e)
        }else{
            params.delete("classLevel")
        }

        router.replace(`?${params.toString()}`)
    }

    return <ComboboxFilter
        data={{
            data: [{ value: "10", text: "X" }, { value: "11", text: "XI" }, { value: "12", text: "XII" }],
            label: "Pilih Kelas",
            placeholder: "Pilih Kelas",
            value: searchParams.get("classLevel") ?? "",
            onChange: onChange

        }} /> 
}

export default ClassLevelFilter