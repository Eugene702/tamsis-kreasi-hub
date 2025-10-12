"use client"

import { MdArrowDownward, MdArrowUpward } from "react-icons/md"
import useStore from "../store"
import { FaTrash } from "react-icons/fa6"

type Props = {
    index: number,
}

const ToolSection = ({ index }: Props) => {
    const contentStore = useStore(state => state.content)
    const toolSection = useStore(state => state.toolSection)
    const setToolSectionStore = useStore(state => state.setToggleToolsSection)
    const removeContentStore = useStore(state => state.removeContent)
    const changePositionContentStore = useStore(state => state.changePositionContent)

    const onClickRemove = () => {
        removeContentStore(index)
        setToolSectionStore(null)
    }

    const onClickChangePosition = (direction: "up" | "down") => {
        changePositionContentStore(index, direction)
        setToolSectionStore(null)
    }

    return <div className={`absolute ${toolSection != null && toolSection == index ? 'scale-100' : 'scale-0'} transition-all duration-700 top-2/4 transform -translate-y-2/4 translate-x-full -right-5 bg-white p-4 rounded-xl shadow-xl flex flex-col overflow-hidden`}>
        <button className="btn btn-circle rounded-full btn-ghost" disabled={index === 0} onClick={() => onClickChangePosition("up")}><MdArrowUpward /></button>
        <button className="btn btn-circle rounded-full btn-ghost" disabled={index === contentStore.length - 1} onClick={() => onClickChangePosition("down")}><MdArrowDownward /></button>
        <button className="btn btn-circle rounded-full btn-ghost text-error" onClick={onClickRemove}><FaTrash /></button>
    </div>
}

export default ToolSection