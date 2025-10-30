"use client"

import { useStore } from "../store"

const BadgeSkill = ({ id, name }: { id: string, name: string }) => {
    const openModalStore = useStore(state => state.openModal)
    return <button type="button" className="btn btn-sm btn-outline btn-primary !rounded-xl" onClick={() => openModalStore("EDIT", { id: id, name: name })}>{ name }</button>
}

export default BadgeSkill