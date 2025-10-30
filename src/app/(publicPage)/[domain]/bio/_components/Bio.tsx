"use client"

import { useFormik } from "formik"
import { useState } from "react"
import { TbPencil } from "react-icons/tb"
import { object, string } from "yup"
import { updateBio } from "../action"
import { useParams } from "next/navigation"
import { StatusCodes } from "http-status-codes"
import { showToast } from "@/lib/alert"

const Bio = ({ bio }: { bio?: string | null }) => {
    const params = useParams() as { domain: string }
    const [isEdit, setIsEdit] = useState(false)
    const schema = object().shape({
        bio: string().min(10, "Bio minimal 10 karakter").required("Bio wajib diisi!")
    })

    const { values, handleChange, errors, isSubmitting, handleSubmit } = useFormik({
        validationSchema: schema,
        initialValues: {
            bio: bio || ""
        },
        onSubmit: async e => {
            const response = await updateBio(params.domain, e.bio)
            if(response.status === StatusCodes.OK){
                setIsEdit(false)
            }

            showToast({ title: response.message, icon: response.status === StatusCodes.OK ? "success" : "error" })
        }
    })

    if (isEdit) {
        return <form className="w-full space-y-3" onSubmit={handleSubmit}>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Bio</legend>
                <textarea name="bio" id="bio" className="textarea textarea-bordered w-full !rounded-xl" onChange={handleChange} value={values.bio} placeholder="Tuliskan bio kamu..."></textarea>
                {errors.bio && <span className="fieldset-label text-error">{errors.bio}</span>}
            </fieldset>

            <div className="flex justify-end">
                <button type="submit" className="btn !rounded-xl btn-sm btn-primary" disabled={isSubmitting}>
                    {isSubmitting && <div className="loading"></div>}
                    <span>Simpan</span>
                </button>
            </div>
        </form>
    } else {
        return <div className="flex items-center gap-4">
            <p className="text-sm leading-relaxed text-base-content/70 whitespace-pre-line">{bio ?? "Belum ada bio"}</p>
            <button className="btn btn-circle btn-sm" onClick={() => setIsEdit(true)}><TbPencil /></button>
        </div>
    }
}

export default Bio