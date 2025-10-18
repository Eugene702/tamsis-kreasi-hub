import dynamic from "next/dynamic"
import Link from "next/link"
import { Fragment } from "react"

const CardContent = dynamic(() => import('@/components/cardContent'))
const page = async () => {
    return <Fragment>
        <div className="grid grid-cols-4 gap-6">
            <Link href="/project/create" className="border border-dashed rounded-xl p-4 flex flex-col justify-center items-center border-gray-400 text-center space-y-4">
                <p className="text-4xl font-bold">Unggah Karya Terbaru</p>
                <p className="text-gray-400">Berikan karya terbaikmu untuk ditampilkan di sini.</p>
            </Link>
            {
                Array.from({ length: 10 }).map((_, i) => <CardContent key={i} />)
            }
        </div>
    </Fragment>
}

export default page