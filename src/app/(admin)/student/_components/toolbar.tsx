import dynamic from "next/dynamic"
import { GetType } from "../action"

const SearchInput = dynamic(() => import('@/components/searchInput'))
const ComboboxFilter = dynamic(() => import('@/components/comboboxFilter'))

const Toolbar = ({ data }: { data: GetType }) => {
    return <div className="card bg-base-100/70 backdrop-blur-sm shadow-xl rounded-3xl ring-1 ring-base-300/40">
        <div className="card-body p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="form-control flex-1">
                    <SearchInput />
                </div>

                <div className="flex items-center gap-2">
                    <ComboboxFilter data={{ label: "Umur", placeholder: "Pilih Umur", data: data.filterData ? data.filterData.birthday.map(e => ({ value: e.toString(), text: e.toString() })) : [] }} />
                </div>
            </div>
        </div>
    </div>
}

export default Toolbar