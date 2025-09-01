'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiBookOpen, FiCalendar, FiImage, FiUpload } from 'react-icons/fi';

interface FormData {
  foto: File | null;
  nama: string;
  jurusan: string;
  kelas: string;
  subJurusan: string;
  tahunKelahiran: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  foto?: string;
  nama?: string;
  jurusan?: string;
  kelas?: string;
  subJurusan?: string;
  tahunKelahiran?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const jurusanOptions = [
  'Teknik Informatika',
  'Sistem Informasi',
  'Teknik Komputer',
  'Manajemen Informatika',
  'Desain Grafis'
];

const kelasOptions = [
  'X', 'XI', 'XII'
];

const subJurusanOptions: Record<string, string[]> = {
  'Teknik Informatika': ['1', '2'],
  'Sistem Informasi': ['1', '2'],
  'Teknik Komputer': ['1', '2'],
  'Manajemen Informatika': ['1', '2'],
  'Desain Grafis': ['1', '2']
};

export function AddStudentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    foto: null,
    nama: '',
    jurusan: '',
    kelas: '',
    subJurusan: '',
    tahunKelahiran: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const birthYears = Array.from({ length: 30 }, (_, i) => currentYear - 15 - i);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    // Reset sub jurusan when jurusan changes
    if (field === 'jurusan') {
      setFormData(prev => ({
        ...prev,
        subJurusan: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, foto: 'File harus berupa gambar' }));
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, foto: 'Ukuran file maksimal 2MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, foto: file }));
      setErrors(prev => ({ ...prev, foto: undefined }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!formData.jurusan) newErrors.jurusan = 'Jurusan wajib dipilih';
    if (!formData.kelas) newErrors.kelas = 'Kelas wajib dipilih';
    if (!formData.subJurusan) newErrors.subJurusan = 'Sub jurusan wajib dipilih';
    if (!formData.tahunKelahiran) newErrors.tahunKelahiran = 'Tahun kelahiran wajib dipilih';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to save student data
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Success - redirect to student list
      router.push('/admin/student');
    } catch (error) {
      console.error('Error saving student:', error);
      // TODO: Show error toast/alert
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-base-300/40 rounded-3xl overflow-hidden">
      <div className="card-body p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Upload Foto Section */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base font-semibold">Foto Profil</legend>
            <div className="flex flex-col items-center space-y-4 pt-4">
              <div className="relative">
                {previewImage ? (
                  <div className="avatar">
                    <div className="w-32 h-32 rounded-full ring-4 ring-primary/20 ring-offset-4 ring-offset-base-100">
                      <img src={previewImage} alt="Preview" className="rounded-full object-cover" />
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center ring-4 ring-base-200/50 ring-offset-4 ring-offset-base-100">
                    <FiUser className="w-12 h-12 text-base-content/30" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2">
                  <label className="btn btn-primary btn-circle btn-sm cursor-pointer">
                    <FiUpload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-base-content/60">Klik ikon untuk mengunggah foto (Max 2MB)</p>
                {errors.foto && (
                  <p className="text-sm text-error mt-1">{errors.foto}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Informasi Pribadi */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base font-semibold">Informasi Pribadi</legend>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              {/* Nama Lengkap - Full Width */}
              <div className="lg:col-span-2">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-primary" />
                      Nama Lengkap
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="input input-bordered w-full !rounded-xl"
                    value={formData.nama}
                    onChange={(e) => handleInputChange('nama', e.target.value)}
                  />
                  {errors.nama && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.nama}</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Email - Full Width */}
              <div className="lg:col-span-2">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-primary" />
                      Email
                    </span>
                  </div>
                  <input
                    type="email"
                    placeholder="nama@example.com"
                    className="input input-bordered w-full !rounded-xl"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  {errors.email && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.email}</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Tahun Kelahiran */}
              <div>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-primary" />
                      Tahun Kelahiran
                    </span>
                  </div>
                  <select
                    className="select select-bordered w-full !rounded-xl"
                    value={formData.tahunKelahiran}
                    onChange={(e) => handleInputChange('tahunKelahiran', e.target.value)}
                  >
                    <option value="">Pilih Tahun</option>
                    {birthYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.tahunKelahiran && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.tahunKelahiran}</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </fieldset>

          {/* Informasi Akademik */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base font-semibold">Informasi Akademik</legend>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              {/* Jurusan */}
              <div>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FiBookOpen className="w-4 h-4 text-primary" />
                      Jurusan
                    </span>
                  </div>
                  <select
                    className="select select-bordered w-full !rounded-xl"
                    value={formData.jurusan}
                    onChange={(e) => handleInputChange('jurusan', e.target.value)}
                  >
                    <option value="">Pilih Jurusan</option>
                    {jurusanOptions.map(jurusan => (
                      <option key={jurusan} value={jurusan}>{jurusan}</option>
                    ))}
                  </select>
                  {errors.jurusan && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.jurusan}</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Kelas */}
              <div>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-medium">Kelas</span>
                  </div>
                  <select
                    className="select select-bordered w-full !rounded-xl"
                    value={formData.kelas}
                    onChange={(e) => handleInputChange('kelas', e.target.value)}
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasOptions.map(kelas => (
                      <option key={kelas} value={kelas}>{kelas}</option>
                    ))}
                  </select>
                  {errors.kelas && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.kelas}</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Sub Jurusan - Full Width */}
              <div className="lg:col-span-2">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-medium">Sub Jurusan</span>
                  </div>
                  <select
                    className="select select-bordered w-full !rounded-xl"
                    value={formData.subJurusan}
                    onChange={(e) => handleInputChange('subJurusan', e.target.value)}
                    disabled={!formData.jurusan}
                  >
                    <option value="">
                      {formData.jurusan ? 'Pilih Sub Jurusan' : 'Pilih jurusan terlebih dahulu'}
                    </option>
                    {formData.jurusan && subJurusanOptions[formData.jurusan]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  {errors.subJurusan && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.subJurusan}</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </fieldset>

          {/* Keamanan Akun */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base font-semibold">Keamanan Akun</legend>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              {/* Password */}
              <div>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FiLock className="w-4 h-4 text-primary" />
                      Password
                    </span>
                  </div>
                  <input
                    type="password"
                    placeholder="Minimal 6 karakter"
                    className="input input-bordered w-full !rounded-xl"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  {errors.password && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.password}</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FiLock className="w-4 h-4 text-primary" />
                      Konfirmasi Password
                    </span>
                  </div>
                  <input
                    type="password"
                    placeholder="Ulangi password"
                    className="input input-bordered w-full !rounded-xl"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </fieldset>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-base-200/50">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline btn-lg flex-1 !rounded-xl"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`btn btn-primary btn-lg flex-1 !rounded-xl ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Siswa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
