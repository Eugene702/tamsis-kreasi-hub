"use client"

import { useFormik } from "formik"
import { object, string, ref } from "yup"
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi"
import { useState } from "react"
import { changePassword } from "../action"
import { StatusCodes } from "http-status-codes"
import { showToast } from "@/lib/alert"
import { useParams } from "next/navigation"

const PasswordModal = () => {
    const params = useParams() as { domain: string }
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const schema = object().shape({
        oldPassword: string()
            .required("Kata sandi lama wajib diisi!"),
        newPassword: string()
            .min(6, "Kata sandi baru minimal 6 karakter!")
            .required("Kata sandi baru wajib diisi!"),
        confirmPassword: string()
            .oneOf([ref('newPassword')], "Kata sandi tidak cocok!")
            .required("Ulangi kata sandi baru wajib diisi!")
    })

    const { values, errors, handleChange, handleSubmit, isSubmitting, resetForm } = useFormik({
        validationSchema: schema,
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
        onSubmit: async (data) => {
            const response = await changePassword(params.domain, data.oldPassword, data.newPassword)
            
            if (response.status === StatusCodes.OK) {
                showToast({ title: response.message, icon: "success" })
                resetForm()
                const modal = document.getElementById('password_modal') as HTMLDialogElement
                if (modal) {
                    modal.close()
                }
            } else {
                showToast({ title: response.message, icon: "error" })
            }
        }
    })

    const handleCloseModal = () => {
        resetForm()
        const modal = document.getElementById('password_modal') as HTMLDialogElement
        if (modal) {
            modal.close()
        }
    }

    return (
        <dialog id="password_modal" className="modal">
            <div className="modal-box !rounded-2xl max-w-md">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <FiLock className="w-5 h-5" />
                    Ganti Kata Sandi
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Kata Sandi Lama */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Kata Sandi Lama</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                name="oldPassword"
                                placeholder="Masukkan kata sandi lama"
                                className="input input-bordered w-full !rounded-xl pr-10"
                                value={values.oldPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                            >
                                {showOldPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.oldPassword && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.oldPassword}</span>
                            </label>
                        )}
                    </div>

                    {/* Kata Sandi Baru */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Kata Sandi Baru</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                name="newPassword"
                                placeholder="Masukkan kata sandi baru"
                                className="input input-bordered w-full !rounded-xl pr-10"
                                value={values.newPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.newPassword}</span>
                            </label>
                        )}
                    </div>

                    {/* Ulangi Kata Sandi Baru */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Ulangi Kata Sandi Baru</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Ulangi kata sandi baru"
                                className="input input-bordered w-full !rounded-xl pr-10"
                                value={values.confirmPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                            </label>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-ghost !rounded-xl"
                            onClick={handleCloseModal}
                            disabled={isSubmitting}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary !rounded-xl"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <span className="loading loading-spinner"></span>}
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={handleCloseModal}>close</button>
            </form>
        </dialog>
    )
}

export default PasswordModal
