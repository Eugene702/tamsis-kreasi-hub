"use client"

import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { GetType } from '../action'

const ComboboxFilter = dynamic(() => import('@/components/comboboxFilter'))
const AgeFilter = ({ data }: { data: GetType['filterData'] }) => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const onChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value.trim().length > 0) {
            params.set("age", value)
        } else {
            params.delete("age")
        }

        router.replace(`?${params.toString()}`)
    }

    return <ComboboxFilter
        data={{
            label: "Umur",
            placeholder: "Pilih Umur", data: data?.birthday ? data.birthday.map(e => ({ value: e.toString(), text: e.toString() })) : [],
            value: searchParams.get("age") ?? "",
            onChange: onChange
        }} />
}

export default AgeFilter