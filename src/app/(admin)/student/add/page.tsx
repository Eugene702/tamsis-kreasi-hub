import { Metadata } from "next"
import dynamic from "next/dynamic"

const BackButton = dynamic(() => import('@/components/backButton'))
const Form = dynamic(() => import('./_components/form'))

export const metadata: Metadata = {
  title: "Tambah Siswa"
}

const page = () => {
  return <main className="w-6/12 mx-auto py-20">
    <BackButton />
    <div className="mt-5 bg-white shadow-xl rounded-xl p-10">
      <h1 className="font-semibold text-2xl mb-10">Tambah Siswa</h1>
      <Form />
    </div>
  </main>
}

export default page