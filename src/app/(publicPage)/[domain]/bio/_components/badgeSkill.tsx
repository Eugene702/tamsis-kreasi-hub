"use client"

import { useStore } from "../store"

const BadgeSkill = ({ id, name, isOwner }: { id: string, name: string, isOwner: boolean }) => {
    const openModalStore = useStore(state => state.openModal)
    
    if (isOwner) {
        return <button type="button" className="btn btn-sm btn-outline btn-primary !rounded-xl" onClick={() => openModalStore("EDIT", { id: id, name: name })}>{ name }</button>
    } else {
        return <span className="btn btn-sm btn-outline btn-primary !rounded-xl pointer-events-none">{ name }</span>
    }
}

export default BadgeSkill