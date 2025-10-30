import dynamic from "next/dynamic"
import { findAll } from "./action"
import { StatusCodes } from "http-status-codes"

const Form = dynamic(() => import('./_components/form'))
const Error = dynamic(() => import('@/components/error'))

const page = async () => {
    const response = await findAll()
    if(response.status != StatusCodes.OK){
        return <Error message={response.message} />
    }

    return <main className="py-20 w-full">
        <Form data={response} />
    </main>
}

export default page