import { Metadata } from "next"
import dynamic from "next/dynamic"
import { GET, GetSearchParams } from "./action"
import { StatusCodes } from "http-status-codes"

export const metadata: Metadata = {
    title: "Manajemen Kategori"
}

const Table = dynamic(() => import('./_components/table'))
const AddCategoryButton = dynamic(() => import('./_components/addCategoryButton'))
const Modal = dynamic(() => import('./_components/modal'))
const Error = dynamic(() => import('@/components/error'))

const page = async ({ searchParams }: { searchParams: Promise<GetSearchParams> }) => {
    const queryParams = await searchParams
    const response = await GET(queryParams)
    if(response.status != StatusCodes.OK){
        return <Error message={response.message} />
    }

    return <main>
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Manajemen Kategori</h1>
            <AddCategoryButton />
        </div>
        <div className="mt-10">
            <Table data={response.data} />
        </div>

        <Modal />
    </main>
}

export default page