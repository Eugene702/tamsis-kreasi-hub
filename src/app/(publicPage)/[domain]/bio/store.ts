import { create } from "zustand";

type ModalState = "ADD" | "EDIT" | null
type States = {
    showModal: ModalState,
    dataModal: { id: string, name: string } | null,
}

type Actions = {
    openModal: (type: ModalState, data?: States['dataModal']) => void,
    closeModal: () => void
}

export const useStore = create<States & Actions>(set => ({
    showModal: null,
    dataModal: null,

    openModal: (type, data) => set(() => ({
        showModal: type,
        dataModal: data ?? null
    })),
    closeModal: () => set(() => ({
        showModal: null,
        dataModal: null
    }))
}))