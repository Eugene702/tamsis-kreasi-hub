import dynamic from "next/dynamic"
import { initData } from "./action"
import { StatusCodes } from "http-status-codes"

const Form = dynamic(() => import('./_components/form'))
const Error = dynamic(() => import('@/components/error'))

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    
    const response = await initData(id)

    if(response.status != StatusCodes.OK){
        return <Error message={response.message} />
    }

    return <main className="py-20 w-full">
        <Form data={response.data!} />
    </main>
}

export default page