"use client"

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { TbCheck } from "react-icons/tb"

type Props = {
    data: { id: string, text: string }[],
    onChange: (value: string) => void,
    value: Props['data'][number] | null,
    onSelect: (data: Props['data'][number] | null) => void,
    isLoading?: boolean,
}

const Comboboxs = ({ data, onChange, value, onSelect, isLoading }: Props) => {
    return <Combobox
        value={value}
        onChange={onSelect}
        onClose={() => onChange("")}>
        <div className="relative overflow-visible">
            <ComboboxInput
                displayValue={(e: Props['value']) => e?.text || ""}
                onChange={e => onChange(e.target.value)}
                className="input input-bordered w-full !rounded-xl"
                placeholder="Cari sesuatu..." />

            <ComboboxOptions
                className="absolute left-0 right-0 top-full mt-1 z-[1000] bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden">
                {
                    isLoading ? (
                        <div className="px-3 py-2 text-sm text-base-content/60">Memuat…</div>
                    ) : (
                        data.map(e => (
                            <ComboboxOption
                                key={e.id}
                                value={e}
                                className="group flex cursor-default items-center gap-2 px-3 py-2 select-none data-focus:bg-base-200">
                                <TbCheck className="invisible size-5 group-data-selected:visible" />
                                {e.text}
                            </ComboboxOption>
                        ))
                    )
                }
            </ComboboxOptions>
        </div>
    </Combobox>
}

export default Comboboxs