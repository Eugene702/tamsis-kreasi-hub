import { AddStudentForm } from './_components/AddStudentForm';
import { FiUser, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function AddStudentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-blue-50/30 to-purple-50/40">
      <div className="py-8 md:py-12 px-4 md:px-6 max-w-5xl mx-auto">
        {/* Header dengan tombol kembali */}
        <div className="mb-8">
          <Link 
            href="/student"
            className="btn btn-outline btn-sm mb-6 no-underline"
            style={{ borderRadius: '9999px' }}
          >
            <FiArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <FiUser className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Tambah Siswa Baru
            </h1>
            <p className="text-base-content/60 max-w-md mx-auto">
              Lengkapi formulir di bawah untuk menambahkan siswa baru ke dalam sistem
            </p>
          </div>
        </div>

        {/* Form Component */}
        <AddStudentForm />
      </div>
    </div>
  );
}
