import { AdminStudentTable } from './_components/AdminStudentTable';

export default function AdminStudentPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-blue-50/20 to-purple-50/30">
			<div className="py-8 md:py-12 px-4 md:px-6 max-w-7xl mx-auto">
				<AdminStudentTable />
			</div>
		</div>
	);
}