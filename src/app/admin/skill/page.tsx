import { Metadata } from "next"
import dynamic from "next/dynamic"
import { GET, GetSearchParams, GetTypeResponse } from "./action"
import { StatusCodes } from "http-status-codes"

export const metadata: Metadata = {
    title: "Manajemen Kemampuan"
}

const Table = dynamic<{ data: GetTypeResponse['data'] }>(() => import('./_components/table'))
const AddSkillButton = dynamic(() => import('./_components/addSkillButton'))
const Modal = dynamic(() => import('./_components/modal'))
const Error = dynamic(() => import('@/components/error'))
const SearchInput = dynamic(() => import('@/components/searchInput'))

const page = async ({ searchParams }: { searchParams: Promise<GetSearchParams> }) => {
    const queryParams = await searchParams
    const response = await GET(queryParams)
    if(response.status != StatusCodes.OK){
        return <Error message={response.message} />
    }

    return <main>
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Manajemen Kemampuan</h1>
            <AddSkillButton />
        </div>
        
        <div className="mt-6">
            <SearchInput placeholder="Cari kemampuan..." />
        </div>
        
        <div className="mt-6">
            <Table data={response.data} />
        </div>

        <Modal />
    </main>
}

export default page
