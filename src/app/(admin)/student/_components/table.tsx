import dynamic from "next/dynamic"
import { FiBookOpen, FiEdit3, FiTrash2, FiUsers } from "react-icons/fi"
import { GetType } from "../action"

const Pagination = dynamic(() => import('@/components/pagination'))
const Table = ({ data }: { data: GetType }) => {
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
                        <td>{index}</td>
                        <td>{ e.email }</td>
                        <td>{ e.name }</td>
                        <td>{ e.studentUser?.classLevel }</td>
                        <td>{ e.studentUser?.major }</td>
                        <td>{ e.studentUser?.birthday ? new Date().getFullYear() - e.studentUser?.birthday.getFullYear() : "Belum ada tanggal lahir" }</td>
                        <td>{ e.studentUser?.telp }</td>
                        <td>{ e._count.userProjects }</td>
                        <td></td>
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