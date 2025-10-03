import { create } from "zustand";

type Content =
    | {
        type: "text";
        data: {
            heading?: string;
            text?: string;
        };
    }
    | {
        type: "image";
        data: {
            src: string,
            alt: string
        }
    } | {
        type: "video",
        data: string
    } | {
        type: "media";
        data: string[];
    }

type State = {
    showTools: boolean,
    toolSection: number | null,
    showImageProperties: number | null,
    content: Content[]
}

type Action = {
    toggleTools: () => void,
    toggleImageTools: (val: number | null) => void,
    setToggleToolsSection: (val: number | null) => void,

    addContent: (type: Content) => void,
    updateContent: (index: number, type: Content) => void,
    removeContent: (index: number) => void,
    changePositionContent: (current: number, direction: "up" | "down") => void
}

const useStore = create<State & Action>(set => ({
    showTools: false,
    toolSection: null,
    content: [],
    showImageProperties: null,

    toggleTools: () => set(state => ({ showTools: !state.showTools })),
    toggleImageTools: (val: number | null) => set(state => ({ showImageProperties: val })),
    setToggleToolsSection: (val: number | null) => set(state => ({ toolSection: val })),

    addContent: (data: Content) => set(state => ({ content: [...state.content, data] })),
    updateContent: (index: number, data: Content) => set(state => ({ content: state.content.map((item, i) => i === index ? data : item) })),
    removeContent: (index: number) => set(state => ({ content: state.content.filter((_, i) => i !== index), toolSection: null, showImageProperties: null })),
    changePositionContent: (current: number, direction: "up" | "down") => set(state => {
        const newContent = [...state.content]
        const targetIndex = direction === "up" ? current - 1 : current + 1
        if (targetIndex < 0 || targetIndex >= newContent.length) return state
        const temp = newContent[current]
        newContent[current] = newContent[targetIndex]
        newContent[targetIndex] = temp
        return { content: newContent }
    })
}))

export default useStore