import { Metadata } from "next"
import dynamic from "next/dynamic"
import { GET } from "./action"
import { StatusCodes } from "http-status-codes"

const BackButton = dynamic(() => import('@/components/backButton'))
const Form = dynamic(() => import('./_components/form'))
const Error = dynamic(() => import('@/components/error'))

export const metadata: Metadata = {
  title: "Tambah Siswa"
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const param = await params
  const response = await GET(param.id)

  if(response.status !== StatusCodes.OK){
    return <Error message={response.message} />
  }

  return <main className="w-6/12 mx-auto py-20">
    <BackButton />
    <div className="mt-5 bg-white shadow-xl rounded-xl p-10">
      <h1 className="font-semibold text-2xl mb-10">Edit Siswa</h1>
      <Form data={response.data} />
    </div>
  </main>
}

export default page