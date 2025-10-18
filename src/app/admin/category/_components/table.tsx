"use client"

import { TbPencil, TbTrash } from "react-icons/tb"
import { DELETE, GetTypeResponse } from "../action"
import { useStore } from "../store"
import { showConfirmation, showToast } from "@/lib/alert"
import { StatusCodes } from "http-status-codes"
import dynamic from "next/dynamic"

const Pagination = dynamic(() => import('@/components/pagination'))
const Table = ({ data }: { data: GetTypeResponse['data'] }) => {
    const showModalStore = useStore(state => state.showModal)
    const handleOnClickDelete = async (id: string, name: string) => {
        showConfirmation({
            title: "Hapus Kategori",
            text: `Apakah anda yakin ingin menghapus kategori ${name}?`,
            confirmButtonText: "Ya, Hapus!",
            icon: "question",
            cancelButtonText: "Batal",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                const response = await DELETE(id)
                showToast({ icon: response.status === StatusCodes.OK ? "success" : "error", title: response.message })
            }
        })
    }

    return <div className="space-y-5">
        <table className="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Kategori</th>
                    <th>Slug</th>
                    <th>Banyaknya Projek</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    data?.categories.map((e, index) => <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{e.name}</td>
                        <td>{ e.slug }</td>
                        <td>{e._count.userProjects}</td>
                        <td className="flex items-center gap-2">
                            <div className="tooltip" data-tip="Edit Kategori">
                                <button className="btn btn-circle btn-ghost text-primary btn-sm" onClick={() => showModalStore({ type: "EDIT", data: { id: e.id, name: e.name, slug: e.slug } })}><TbPencil /></button>
                            </div>

                            <div className="tooltip" data-tip="Hapus Kategori">
                                <button className="btn btn-circle btn-ghost text-error btn-sm" onClick={() => handleOnClickDelete(e.id, e.name)}><TbTrash /></button>
                            </div>
                        </td>
                    </tr>)
                }
            </tbody>
        </table>

        <div className="flex justify-center">
            <Pagination
                hasNext={data?.pagination.hasNextPage ?? false}
                hasPrev={data?.pagination.hasPrevPage ?? false} />
        </div>
    </div>
}

export default Table