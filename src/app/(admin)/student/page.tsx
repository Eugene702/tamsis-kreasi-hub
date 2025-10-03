import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import { GET } from './action';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Stats = dynamic(() => import('./_components/stats'))
const Table = dynamic(() => import('./_components/table'))
const Toolbar = dynamic(() => import('./_components/toolbar'))
const Error = dynamic(() => import('@/components/error'))

export const page = async ({ searchParams }: { searchParams: { search?: string, page?: number } }) => {
	const data = await GET({})

	if (data.error != undefined) {
		return <Error message={data.error} />
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-blue-50/20 to-purple-50/30">
			<div className="py-8 md:py-12 px-4 md:px-6 max-w-7xl mx-auto">
				<div className="flex justify-between items-center">
					<div className="mb-6">
						<Link href="/" className='btn rounded-xl mb-5'>
							<FiArrowLeft className="w-4 h-4" />
							<span>Kembali</span>
						</Link>
						<div className="flex items-center gap-3">
							<h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
								Manajemen Siswa
							</h1>
						</div>
					</div>

					<Link href="/student/add" className='btn btn-primary rounded-xl'>
						<FiPlus />
						<span>Tambah Siswa</span>
					</Link>
				</div>
			</div>

			<div className="space-y-5">
				<Stats data={data}  />
				<Toolbar data={data} />
				<Table data={data} />
			</div>
		</div>
	);
}

export default page