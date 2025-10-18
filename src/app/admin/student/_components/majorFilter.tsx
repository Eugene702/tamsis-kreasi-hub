"use client"

import { Major } from "@/lib/values"
import dynamic from "next/dynamic"
import { useRouter, useSearchParams } from "next/navigation"

const ComboboxFilter = dynamic(() => import('@/components/comboboxFilter'))
const MajorFilter = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const onChange = (e: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if(e.trim() != ""){
            params.set("major", e)
        }else{
            params.delete("major")
        }

        router.replace(`?${params.toString()}`)
    }

    return <ComboboxFilter
        data={{
            data: Major.map(e => ({ value: e.key, text: e.value })),
            label: "Pilih Jurusan",
            placeholder: "Pilih Jurusan",
            value: searchParams.get("major") ?? "",
            onChange: onChange

        }} /> 
}

export default MajorFilter