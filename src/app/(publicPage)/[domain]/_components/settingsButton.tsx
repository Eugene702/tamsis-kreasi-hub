"use client"

import { FiSettings } from "react-icons/fi"

const SettingsButton = () => {
    const handleOpenModal = () => {
        const modal = document.getElementById('password_modal') as HTMLDialogElement
        if (modal) {
            modal.showModal()
        }
    }

    return (
        <button 
            className="btn btn-circle btn-sm btn-ghost"
            onClick={handleOpenModal}
            aria-label="Pengaturan"
        >
            <FiSettings className="w-4 h-4" />
        </button>
    )
}

export default SettingsButton
