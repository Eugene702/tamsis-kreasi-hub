import dynamic from "next/dynamic"

const Form = dynamic(() => import('./_components/form'))
const Tools = dynamic(() => import('./_components/tools'))
const ImageProperties = dynamic(() => import('./_components/imageProperties'))

const page = () => {
    return <main className="w-6/12 mx-auto py-20 relative">
        <Form />
        <Tools />
        <ImageProperties />
    </main>
}

export default page