"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
    data: { id: string, text: string }[],
    onChange: (value: string) => void,
    value: Props['data'][number] | null,
    onSelect: (id: string) => void,
    isLoading?: boolean,
}

const Combobox = ({ data, onChange, value, onSelect, isLoading }: Props) => {
    const refInput = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLFieldSetElement>(null)
    const [show, setShow] = useState(false)

    const handleOnClickSelect = (id: string) => {
        onSelect(id)
        refInput.current!.value = data.find(e => e.id === id)?.text || ""
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current) {
                if (!dropdownRef.current.contains(e.target as Node)) {
                    setShow(false)
                }
            }
        }

        if (show) {
            document.addEventListener("mousedown", handleClickOutside)
        }else{
            refInput.current!.value = value ? value.text : ""
        }
    }, [dropdownRef, show])

    return <fieldset className="fieldset" ref={dropdownRef}>
        <legend className="fieldset-legend">Pilih Kemampuan</legend>
        <div className="relative w-full">
            <div className="input input-bordered w-full !rounded-xl">
                <input type="text" placeholder="Pilih Kemampuan" ref={refInput} onFocus={() => setShow(true)} onChange={e => onChange(e.target.value)} />
                {isLoading && <div className="loading"></div>}
            </div>
            <div className={`absolute w-full top-10 shadow-xl rounded-xl z-50 p-3 bg-white ${show ? "block" : "hidden"}`}>
                <ul className="menu bg-white rounded-box w-full">
                    { value ? data.filter(e => e.id === value.id).map(e => <li key={e.id} className="text-primary">{ e.text }</li>) : null }
                    {data.length > 0 ? data.filter(item => value ?  item.id != value.id : true).map(item => <li key={item.id}>
                        <button type="button" onClick={() => handleOnClickSelect(item.id)}>{item.text}</button>
                    </li>) : <li className="text-center">Tidak ada data</li>}
                </ul>
            </div>
        </div>
    </fieldset>
}

export default Combobox