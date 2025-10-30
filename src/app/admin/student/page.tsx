import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import { GET } from './action';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const Stats = dynamic(() => import('./_components/stats'))
const Table = dynamic(() => import('./_components/table'))
const Toolbar = dynamic(() => import('./_components/toolbar'))
const Error = dynamic(() => import('@/components/error'))

type Props = {
	search?: string,
	page?: number,
	age?: number,
	major?: string,
	classLevel?: number
}

export const metadata: Metadata = {
	title: "Manajemen Siswa - Admin",
}

export default async function StudentPage({ searchParams }: { searchParams: Promise<Props> }) {
	const query = await searchParams
	const data = await GET({ search: query.search, page: query.page ? Number(query.page) : undefined, age: query.age, major: query.major, classLevel: query.classLevel ? Number(query.classLevel) : undefined })

	if (data.error != undefined) {
		return <Error message={data.error} />
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-blue-50/20 to-purple-50/30">
			<div className="flex justify-between items-center mb-10">
				<h1 className="text-2xl md:text-3xl font-bold text-black">Manajemen Siswa</h1>
				<Link href="/admin/student/add" className='btn btn-primary rounded-xl'>
					<FiPlus />
					<span>Tambah Siswa</span>
				</Link>
			</div>

			<div className="space-y-5">
				<Stats data={data} />
				<Toolbar data={data} />
				<Table data={data} />
			</div>
		</div>
	);
}