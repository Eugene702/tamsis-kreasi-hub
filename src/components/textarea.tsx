"use client"

import { useEffect, useRef } from "react"

const Textarea = ({ value, placeholder, onChange, className, isFocus }: { value: string, placeholder: string, onChange: (value: string) => void, className?: string, isFocus?: (value: boolean) => void }) => {
    const textRef = useRef(null)

    useEffect(() => {
        if (textRef.current) {
            const current = textRef.current as HTMLTextAreaElement
            current.style.height = "auto"
            current.style.height = current.scrollHeight + "px"
        }
    }, [value])
    
    return <textarea 
        ref={textRef} 
        onChange={e => onChange(e.target.value)} 
        value={value}
        rows={1}
        onFocus={e => isFocus?.(true)}
        onBlur={e => isFocus?.(false)}
        className={`textarea border-none w-full text-2xl resize-none overflow-hidden min-h-0 h-auto box-content focus:outline-none ${className}`}
        placeholder={placeholder}></textarea>
}

export default Textarea