"use client"

import dynamic from "next/dynamic"
import { DELETE, GetType } from "../action"
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import Link from "next/link"
import { showConfirmation, showToast } from "@/lib/alert"
import { StatusCodes } from "http-status-codes"
import { UploadApiResponse } from "cloudinary"
import { Major } from "@/lib/values"

const Pagination = dynamic(() => import('@/components/pagination'))
const Table = ({ data }: { data: GetType }) => {
    const handleOnClickDelete = (id: string) => {
        const student = data.data!.find(e => e.id === id)
        showConfirmation({
            title: "Hapus Siswa",
            text: `Apakah anda yakin ingin menghapus siswa ${student?.name}?`,
            icon: "warning",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                const response = await DELETE(id, student?.photo as unknown as UploadApiResponse | null)
                showToast({ title: response.message, icon: response.status === StatusCodes.OK ? "success" : "error" })
            }
        })
    }

    return <div className="bg-white rounded-xl shadow-xl p-6">
        <table className="table table-zebra w-full">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Email</th>
                    <th>Nama Siswa</th>
                    <th>Kelas</th>
                    <th>Jurusan</th>
                    <th>Umur</th>
                    <th>Nomor HP</th>
                    <th>Jumlah Proyek</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {
                    data.data && data.data.length > 0 ? data.data.map((e, index) => <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{ e.email }</td>
                        <td>{ e.name }</td>
                        <td>{ e.studentUser?.classLevel }</td>
                        <td>{ Major.find(m => m.key === e.studentUser?.major)?.value }</td>
                        <td>{ e.studentUser?.birthday ? new Date().getFullYear() - e.studentUser?.birthday.getFullYear() : "Belum ada tanggal lahir" }</td>
                        <td>{ e.studentUser?.telp }</td>
                        <td>{ e._count.userProjects }</td>
                        <td>
                            <div className="flex items-center gap-4">
                                <div className="tooltip" data-tip="Edit Siswa">
                                    <Link href={`/admin/student/${e.id}/edit`} className="btn btn-sm btn-circle"><FaPencilAlt /></Link>
                                </div>
                                <div className="tooltip" data-tip="Hapus Siswa">
                                    <button className="btn btn-sm btn-circle btn-error text-white" onClick={() => handleOnClickDelete(e.id)}><FaTrashAlt /></button>
                                </div>
                            </div>
                        </td>
                    </tr>) : <tr>
                        <td colSpan={10}><h1 className="text-center text-xl mt-5">Tidak ada data yang ditemukan!</h1></td>
                    </tr>
                }
            </tbody>
        </table>

        <div className="mt-4 flex justify-center">
            <Pagination hasNext={data.hasNext!} hasPrev={data.hasPrev!} />
        </div>
    </div>
}

export default Table