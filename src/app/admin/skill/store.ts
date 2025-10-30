import { create } from "zustand";

type ModalProps = {
    type: "ADD" | "EDIT" | null,
    data?: {
        id: string,
        name: string
    }
}

type State = {
    modal: ModalProps
}

type Action = {
    showModal: (value: ModalProps) => void
    closeModal: () => void
}

export const useStore = create<State & Action>(set => ({
    modal: { type: null },
    showModal: value => set({ modal: value }),
    closeModal: () => set({ modal: { type: null } })
}))
