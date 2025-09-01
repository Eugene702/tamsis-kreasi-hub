'use client';

import { AdminStudentTable } from './_components/AdminStudentTable';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

export default function AdminStudentPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-blue-50/20 to-purple-50/30">
			<div className="py-8 md:py-12 px-4 md:px-6 max-w-7xl mx-auto">
				{/* Header dengan tombol kembali */}
				<div className="mb-6">
					<button
						onClick={() => router.push("/")}
						className="btn btn-outline btn-sm mb-4"
						style={{ borderRadius: '9999px' }}
					>
						<FiArrowLeft className="w-4 h-4" />
						Kembali
					</button>
					<div className="flex items-center gap-3">
						<h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
							Manajemen Siswa
						</h1>
					</div>
				</div>
				
				<AdminStudentTable />
			</div>
		</div>
	);
}