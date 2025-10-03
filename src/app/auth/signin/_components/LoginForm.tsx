"use client";

import { object, string } from "yup";
import { useFormik } from "formik";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/alert";

const LoginForm = () => {
  const router = useRouter()
  const { data } = useSession()
  const schema = object().shape({
    email: string().email("Format email tidak benar!").required("Email wajib diisi!"),
    password: string().min(8, "Kata sandi minimal 8 karakter!").required("Kata sandi wajib diisi!")
  })

  const { handleChange, handleSubmit, values, errors, isSubmitting, setErrors } = useFormik({
    validationSchema: schema,
    initialValues: {
      email: "",
      password: ""
    },
    onSubmit: async e => {
      const login = await signIn("credentials", {
        ...e,
        redirect: false,
      })

      if (login) {
        if (login.ok) {
          router.push("/")
        } else {
          if (login.error) {
            const res = JSON.parse(login.error) as { errors: { email?: string; password?: string } }
            setErrors({ ...res.errors })
          }
        }
      }

    }
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <input
          type="email"
          value={values.email}
          onChange={handleChange}
          name="email"
          className="input input-lg !rounded-xl w-full focus:shadow-lg transition-shadow duration-200"
          placeholder="Masukan email Anda"
        />
        {errors.email ? <span className="fieldset-label text-error">{errors.email}</span> : null}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Password</legend>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          className="input input-lg !rounded-xl w-full focus:shadow-lg transition-shadow duration-200"
          placeholder="Masukan kata sandi"
        />
        {errors.password ? <span className="fieldset-label text-error">{errors.password}</span> : null}
      </fieldset>

      <button
        type="submit"
        className={`btn btn-primary btn-lg w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200`}
        disabled={isSubmitting}
      >
        {isSubmitting ? <div className="loading"></div> : null}
        <span>Login</span>
      </button>
    </form>
  );
};

export default LoginForm;