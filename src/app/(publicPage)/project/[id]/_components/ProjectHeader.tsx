'use client'

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaHeart, FaBookmark, FaEdit, FaTrash } from "react-icons/fa"
import { UploadApiResponse } from "cloudinary"
import Swal from "sweetalert2"
import { deleteProject } from "../action"

type ProjectHeaderProps = {
    userId: string
    userName: string
    userPhoto: UploadApiResponse | null
    studentUser?: {
        major: string
        classLevel: number
    } | null
    isOwner?: boolean
    projectDomain?: string
}

const ProjectHeader = ({ userId, userName, userPhoto, studentUser, isOwner, projectDomain }: ProjectHeaderProps) => {
    const router = useRouter()

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Hapus Proyek?',
            text: 'Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        })

        if(result.isConfirmed){
            Swal.fire({
                title: 'Menghapus...',
                text: 'Mohon tunggu',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })

            const response = await deleteProject(projectDomain!, userId)

            if(response.status === 200){
                await Swal.fire({
                    title: 'Berhasil!',
                    text: response.message,
                    icon: 'success',
                    confirmButtonColor: '#047857'
                })
                router.push(`/${userId}`)
                router.refresh()
            } else {
                Swal.fire({
                    title: 'Gagal!',
                    text: response.message,
                    icon: 'error',
                    confirmButtonColor: '#047857'
                })
            }
        }
    }

    return (
        <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
                <Link href={`/${userId}`} className="w-12 h-12 relative rounded-full overflow-hidden ring-2 ring-base-200">
                    <Image 
                        src={userPhoto?.url || "/assets/images/logo.png"} 
                        alt={userName} 
                        fill 
                        className="object-cover" />
                </Link>
                <div>
                    <Link href={`/${userId}`} className="font-semibold hover:text-emerald-600 transition">
                        {userName}
                    </Link>
                    {studentUser && (
                        <p className="text-sm text-base-content/60">
                            {studentUser.classLevel} {studentUser.major}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                {isOwner && (
                    <>
                        <Link href={`/project/${projectDomain}/edit`} className="btn btn-circle btn-sm btn-ghost hover:bg-emerald-100">
                            <FaEdit className="w-4 h-4 text-emerald-600" />
                        </Link>
                        <button onClick={handleDelete} className="btn btn-circle btn-sm btn-ghost hover:bg-error/10">
                            <FaTrash className="w-4 h-4 text-error" />
                        </button>
                    </>
                )}
                <Link href={`/${userId}`} className="btn btn-sm rounded-full">
                    Lihat Profil
                </Link>
            </div>
        </div>
    )
}

export default ProjectHeader
