"use client"

import { Major } from "@/lib/values"
import { useFormik } from "formik"
import Image from "next/image"
import { serialize } from "object-to-formdata"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { FaPencil } from "react-icons/fa6"
import { mixed, object, ref, string, ValidationError } from "yup"
import { GetType, POST } from "../action"
import { StatusCodes } from "http-status-codes"
import { showToast } from "@/lib/alert"
import { useRouter } from "next/navigation"
import { momentClient } from "@/lib/moment"
import { JsonValue } from "@prisma/client/runtime/client"
import { UploadApiResponse } from "cloudinary"

const Form = ({ data }: { data: GetType['data'] }) => {
    const [tempPhoto, setTempPhoto] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const schema = object().shape({
        photo: mixed().nullable()
            .test({
                name: "fileType",
                message: "Format berkas tidak didukung. Format yang didukung hanya .jpg, .jpeg, .png",
                test: e => {
                    if(typeof e === "string") return true
                    const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"]
                    const value = e as File | null
                    if (!value) return true
                    return SUPPORTED_FORMATS.includes(value.type)
                }
            })
            .test("fileSize", "Ukuran berkas terlalu besar. Maksimal berkas hanya sampai 10mb", e => {
                if(typeof e === "string") return true
                const MAX_SIZE = 10 * 1024 * 1024
                const value = e as File | null
                if (!value) return true
                return value.size <= MAX_SIZE
            }),
        name: string().required("Nama lengkap wajib diisi"),
        email: string().email("Format email tidak valid").required("Email wajib diisi!"),
        classLevel: string().required("Kelas wajib diisi!"),
        major: string().required("Jurusan wajib diisi!"),
        birthDate: string().required("Tanggal lahir wajib diisi!"),
        phone: string().required("Nomor HP wajib diisi!"),
        password: string().min(8, "Kata sandi minimal 8 karakter").optional().nullable(),
        confirmPassword: string().oneOf([ref("password"), undefined], "Kata sandi tidak sesuai").optional().nullable(),
    })

    const { values, handleChange, handleSubmit, errors, isSubmitting, setFieldValue, setFieldError } = useFormik({
        validationSchema: schema,
        initialValues: {
            oldPhoto: data?.photo ? JSON.stringify(data?.photo) : null as string | undefined | null,
            photo: data?.photo ? JSON.stringify(data?.photo) : null as File | undefined | string | null,
            name: data?.name,
            email: data?.email,
            oldEmail: data?.email,
            classLevel: data?.studentUser?.classLevel,
            major: data?.studentUser?.major,
            birthDate: momentClient(data?.studentUser?.birthday).format("YYYY-MM-DD"),
            phone: data?.studentUser?.telp,
            password: "",
            confirmPassword: "",
        },
        onSubmit: async e => {
            const formData = serialize(e)
            const response = await POST(formData, data?.id!)
            showToast({ icon: response.status == StatusCodes.CREATED ? "success" : "error", title: response.message })
            if(response.status == StatusCodes.CREATED){
                router.push("/student")
            }
        }
    })

    const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (files && files.length > 0) {
            const file = files[0]
            let errorMessage: string | null = null
            setFieldError("photo", undefined)

            try{
                await schema.validateAt("photo", { photo: file })
            }catch(e){
                const error = e as ValidationError
                errorMessage = error.message
            }finally{
                fileRef.current!.value = ""
            }

            if(!errorMessage){
                setFieldValue("photo", file)
            }else{
                await setFieldValue("photo", undefined)
                setFieldError("photo", errorMessage)
            }
        }
    }

    const handleRemovePhoto = () => {
        setFieldValue("photo", undefined)
    }

    useEffect(() => {
        if (values.photo != null && values.photo != undefined && !errors.photo) {
            setTempPhoto(values.photo instanceof File ? URL.createObjectURL(values.photo) : (JSON.parse(values.photo) as UploadApiResponse).url)
        }else{
            setTempPhoto(null)
        }
    }, [values])


    return <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center flex-col">
            <div className="avatar">
                <div className="w-32 rounded-full ring-primary ring-offset-base-100 ring-2 ring-offset-2">
                    <Image
                        src={tempPhoto ?? "/assets/images/logo.png"}
                        fill
                        className="w-32 h-auto !relative"
                        alt="" />
                </div>
                <button type="button" className="btn btn-circle btn-primary bottom-0 absolute right-0" onClick={() => fileRef.current?.click()}>
                    <FaPencil />
                </button>
                <input type="file" name="photo" id="photo" className="hidden" ref={fileRef} onChange={handleChangeFile} />
            </div>
            { (values.photo) && <button type="button" className="btn btn-outline !rounded-xl w-fit mt-5" onClick={handleRemovePhoto}>Hapus Foto</button> }
            { errors.photo && <span className="fieldset-label text-error mt-2">{errors.photo}</span> }
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Nama Lengkap</legend>
                <input type="text" className="input input-bordered !rounded-xl" placeholder="Alvin" name="name" value={values.name} onChange={handleChange} />
                {errors.name && <span className="fieldset-label text-error">{errors.name}</span>}
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Email</legend>
                <input type="text" className="input input-bordered !rounded-xl" placeholder="Alvin" name="email" value={values.email} onChange={handleChange} />
                {errors.email && <span className="fieldset-label text-error">{errors.email}</span>}
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Kelas</legend>
                <select name="classLevel" className="select select-bordered !rounded-xl" value={values.classLevel} onChange={handleChange}>
                    <option value="">Pilih Kelas</option>
                    <option value="10">X</option>
                    <option value="11">XI</option>
                    <option value="12">XII</option>
                </select>
                {errors.classLevel && <span className="fieldset-label text-error">{errors.classLevel}</span>}
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Jurusan</legend>
                <select name="major" className="select select-bordered !rounded-xl" value={values.major} onChange={handleChange}>
                    <option value="">Pilih Jurusan</option>
                    {
                        Major.map((e, index) => <option key={index} value={e.key}>{e.value}</option>)
                    }
                </select>
                {errors.major && <span className="fieldset-label text-error">{errors.major}</span>}
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Tanggal Lahir</legend>
                <input type="date" className="input input-bordered !rounded-xl" name="birthDate" value={values.birthDate} onChange={handleChange} />
                {errors.birthDate && <span className="fieldset-label text-error">{errors.birthDate}</span>}
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Nomor HP</legend>
                <input type="tel" className="input input-bordered !rounded-xl" placeholder="08xxxx" name="phone" value={values.phone} onChange={handleChange} />
                {errors.phone && <span className="fieldset-label text-error">{errors.phone}</span>}
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Kata Sandi</legend>
                <input type="password" className="input input-bordered !rounded-xl" placeholder="Kata Sandi" name="password" value={values.password} onChange={handleChange} />
                {errors.password && <span className="fieldset-label text-error">{errors.password}</span>}
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Ulangi Kata Sandi</legend>
                <input type="password" className="input input-bordered !rounded-xl" placeholder="Ulangi Kata Sandi" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <span className="fieldset-label text-error">{errors.confirmPassword}</span>}
            </fieldset>

            <div className="flex justify-end col-span-2">
                <button type="submit" className="btn btn-primary !rounded-xl" disabled={isSubmitting}>
                    {isSubmitting && <div className="loading"></div>}
                    <span>Simpan</span>
                </button>
            </div>
        </div>
    </form>
}

export default Form