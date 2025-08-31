"use client";
import { useEffect, useMemo, useState } from 'react';
import { FiSearch, FiSliders, FiPlus, FiChevronLeft, FiChevronRight, FiUsers, FiTrendingUp, FiBookOpen, FiEye, FiEdit3, FiTrash2 } from 'react-icons/fi';

interface StudentData {
  id: string;
  name: string;
  avatar: string;
  jurusan: string;
  kelas: string;
  umur: number;
  projects: number; // total project count
  totalViews: number; // aggregated views
  createdAt: string;
}

interface FilterState {
  query: string;
  jurusan: string;
  kelas: string;
  umur: string;
}

const jurusanOptions = ['Semua', 'RPL', 'DKV', 'TKJ', 'AKL'];
const kelasOptions = ['Semua', 'X', 'XI', 'XII'];
const umurOptions = ['Semua', '15', '16', '17', '18'];

function generateMock(count = 42): StudentData[] {
  const names = ['Aji Nugraha', 'Suwir Pratama', 'Nabila Firda', 'Raka Wijaya', 'Dewi Lestari', 'Fikri Maulana', 'Gilang Saputra', 'Intan Pramesi', 'Yoga Pratama', 'Laras Wening', 'Riza Putra', 'Aulia Ramadhani'];
  const jur = ['RPL', 'DKV', 'TKJ', 'AKL'];
  const arr: StudentData[] = [];
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    const projects = Math.floor(Math.random() * 12) + 1;
  const totalViews = Array.from({ length: projects }).reduce<number>((s) => s + Math.floor(Math.random() * 4000) + 50, 0);
    arr.push({
      id: `stu-${i}`,
      name,
      avatar: '/temp.png',
      jurusan: jur[i % jur.length],
      kelas: ['X', 'XI', 'XII'][i % 3],
      umur: 15 + (i % 4),
      projects,
      totalViews,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    });
  }
  return arr;
}

export function AdminStudentTable() {
  const [filter, setFilter] = useState<FilterState>({ query: '', jurusan: 'Semua', kelas: 'Semua', umur: 'Semua' });
  const [openAdv, setOpenAdv] = useState(false);
  const [data, setData] = useState<StudentData[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => { setData(generateMock()); }, []);

  // When filters change reset to page 1
  useEffect(() => { setPage(1); }, [filter]);

  const filtered = useMemo(() => {
    return data.filter(d => {
      if (filter.query && !d.name.toLowerCase().includes(filter.query.toLowerCase())) return false;
      if (filter.jurusan !== 'Semua' && d.jurusan !== filter.jurusan) return false;
      if (filter.kelas !== 'Semua' && d.kelas !== filter.kelas) return false;
      if (filter.umur !== 'Semua' && d.umur !== Number(filter.umur)) return false;
      return true;
    });
  }, [data, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const updateFilter = (patch: Partial<FilterState>) => setFilter(f => ({ ...f, ...patch }));

  const formatNumber = (n: number) => new Intl.NumberFormat('id-ID').format(n);
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const makePageButtons = () => {
    const buttons: number[] = [];
    const windowSize = 3; // pages around current
    const add = (p: number) => { if (!buttons.includes(p) && p >= 1 && p <= totalPages) buttons.push(p); };
    add(1); add(totalPages);
    for (let p = page - windowSize; p <= page + windowSize; p++) add(p);
    buttons.sort((a, b) => a - b);
    return buttons;
  };

  const pageButtons = makePageButtons();

  // Calculate summary stats
  const totalStudents = data.length;
  const totalProjects = data.reduce((sum, student) => sum + student.projects, 0);
  const totalViews = data.reduce((sum, student) => sum + student.totalViews, 0);
  const newStudentsThisMonth = data.filter(student => {
    const studentDate = new Date(student.createdAt);
    const thisMonth = new Date();
    return studentDate.getMonth() === thisMonth.getMonth() && studentDate.getFullYear() === thisMonth.getFullYear();
  }).length;

  return (
    <div className="space-y-8">
      {/* Header Section using DaisyUI Hero with rounded styling */}
      <div className="hero bg-gradient-to-r from-primary to-accent rounded-3xl">
        <div className="hero-content text-primary-content w-full justify-between py-10">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Siswa</h1>
            <p className="py-2 opacity-90">Kelola data siswa dan pantau aktivitas mereka</p>
          </div>
          <button className="btn btn-ghost bg-white/15 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 rounded-2xl">
            <FiPlus className="w-5 h-5" /> Tambah Siswa Baru
          </button>
        </div>
      </div>

      {/* Summary Cards using DaisyUI Stats with rounded styling */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-lg bg-base-100 w-full rounded-3xl overflow-hidden">
        <div className="stat bg-gradient-to-br from-blue-500/10 to-blue-600/20 p-8">
          <div className="stat-figure text-blue-600">
            <FiUsers className="w-8 h-8" />
          </div>
          <div className="stat-title text-blue-600/70">Total Siswa</div>
          <div className="stat-value text-blue-600">{formatNumber(totalStudents)}</div>
        </div>

        <div className="stat bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 p-8">
          <div className="stat-figure text-emerald-600">
            <FiBookOpen className="w-8 h-8" />
          </div>
          <div className="stat-title text-emerald-600/70">Total Proyek</div>
          <div className="stat-value text-emerald-600">{formatNumber(totalProjects)}</div>
        </div>

        <div className="stat bg-gradient-to-br from-purple-500/10 to-purple-600/20 p-8">
          <div className="stat-figure text-purple-600">
            <FiEye className="w-8 h-8" />
          </div>
          <div className="stat-title text-purple-600/70">Total Views</div>
          <div className="stat-value text-purple-600">{formatNumber(totalViews)}</div>
        </div>

        <div className="stat bg-gradient-to-br from-orange-500/10 to-orange-600/20 p-8">
          <div className="stat-figure text-orange-600">
            <FiTrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title text-orange-600/70">Siswa Baru</div>
          <div className="stat-value text-orange-600">{formatNumber(newStudentsThisMonth)}</div>
          <div className="stat-desc text-orange-600/60">Bulan ini</div>
        </div>
      </div>

      {/* Filters using DaisyUI Card and Form Controls with fixed layout */}
      <div className="card bg-base-100/70 backdrop-blur-sm shadow-xl rounded-3xl ring-1 ring-base-300/40">
        <div className="card-body p-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="form-control flex-1">
              <label className="input input-bordered flex items-center gap-2 bg-base-100/80" style={{ borderRadius: '9999px' }}>
                <FiSearch className="w-5 h-5 opacity-70" />
                <input
                  type="text"
                  placeholder="Cari nama siswa..."
                  className="grow"
                  value={filter.query}
                  onChange={e => updateFilter({ query: e.target.value })}
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => setOpenAdv(o => !o)}
              className={`btn gap-3 min-h-12 ${openAdv ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '9999px' }}
            >
              <FiSliders className="w-4 h-4" /> Filter Lanjutan
            </button>
          </div>
          
          {openAdv && (
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-base-200/30 rounded-2xl ring-1 ring-base-300/30">
                <DaisySelect label="Jurusan" value={filter.jurusan} options={jurusanOptions} onChange={(v: string) => updateFilter({ jurusan: v })} />
                <DaisySelect label="Kelas" value={filter.kelas} options={kelasOptions} onChange={(v: string) => updateFilter({ kelas: v })} />
                <DaisySelect label="Umur" value={filter.umur} options={umurOptions} onChange={(v: string) => updateFilter({ umur: v })} />
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-xs font-semibold uppercase tracking-wide opacity-0">Reset</span>
                  </label>
                  <button
                    onClick={() => setFilter({ query: '', jurusan: 'Semua', kelas: 'Semua', umur: 'Semua' })}
                    className="btn btn-error btn-outline"
                    style={{ borderRadius: '9999px' }}
                  >Reset Filter</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Table using DaisyUI Table with proper layout */}
      <div className="card bg-base-100/70 backdrop-blur-sm shadow-xl rounded-3xl ring-1 ring-base-300/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200/50">
              <tr className="text-[11px] uppercase tracking-wide font-semibold">
                <th className="py-4 pl-6">Siswa</th>
                <th className="py-4">Jurusan</th>
                <th className="py-4">Kelas</th>
                <th className="py-4">Umur</th>
                <th className="py-4">Proyek</th>
                <th className="py-4">Total Views</th>
                <th className="py-4">Bergabung</th>
                <th className="py-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((row, index) => (
                <tr key={row.id} className="hover:bg-base-200/30 transition-colors">
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="indicator">
                        <span className="indicator-item badge badge-primary badge-xs">{(page - 1) * pageSize + index + 1}</span>
                        <div className="avatar">
                          <div className="w-11 h-11 rounded-2xl ring-2 ring-base-300/50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={row.avatar} alt={row.name} className="object-cover w-full h-full" />
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-base-content truncate">{row.name}</div>
                        <div className="text-xs opacity-50 uppercase tracking-wide">ID: {row.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="badge badge-primary badge-outline rounded-full text-xs">{row.jurusan}</div>
                  </td>
                  <td className="py-4">
                    <div className="badge badge-secondary badge-outline rounded-full text-xs">{row.kelas}</div>
                  </td>
                  <td className="py-4 font-medium">{row.umur} tahun</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <FiBookOpen className="w-4 h-4 opacity-50" />
                      <span className="font-semibold">{row.projects}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <FiEye className="w-4 h-4 opacity-50" />
                      <span className="font-semibold text-accent">{formatNumber(row.totalViews)}</span>
                    </div>
                  </td>
                  <td className="py-4 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                  <td className="py-4 pr-6">
                    <div className="flex gap-2 justify-end">
                      <div className="tooltip" data-tip="Edit siswa">
                        <button className="btn btn-ghost btn-sm rounded-full w-9 h-9 p-0 min-h-0">
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="tooltip" data-tip="Hapus siswa">
                        <button className="btn btn-ghost btn-sm text-error rounded-full w-9 h-9 p-0 min-h-0 hover:bg-error/10">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-20">
                    <div className="text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-6xl opacity-20">
                          <FiUsers />
                        </div>
                        <div>
                          <p className="font-medium">Tidak ada data siswa</p>
                          <p className="text-sm opacity-50">Coba ubah filter pencarian atau tambah siswa baru</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination using DaisyUI Join and Button with cleaner layout */}
      <div className="card bg-base-100/70 backdrop-blur-sm shadow-xl rounded-3xl ring-1 ring-base-300/40">
        <div className="card-body p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm opacity-70">
              Menampilkan <span className="font-semibold">{(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)}</span> dari <span className="font-semibold">{filtered.length}</span> siswa
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-outline btn-sm"
                style={{ borderRadius: '9999px' }}
                aria-label="Halaman sebelumnya"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <div className="join mx-2">
                {pageButtons.map((p, i) => {
                  const prev = pageButtons[i - 1];
                  const needDots = prev && p - prev > 1;
                  return (
                    <div key={p} className="flex items-center">
                      {needDots && <span className="px-2 text-sm opacity-40">...</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`join-item btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline'}`}
                        style={{ borderRadius: '9999px' }}
                      >{p}</button>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-outline btn-sm"
                style={{ borderRadius: '9999px' }}
                aria-label="Halaman berikutnya"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer using DaisyUI Alert with rounded styling */}
      <div className="alert alert-info rounded-2xl bg-info/10 border-info/20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>🔒 Halaman khusus admin – implementasi proteksi route diperlukan</span>
      </div>
    </div>
  );
}

interface SelectProps { label: string; value: string; options: string[]; onChange: (v: string) => void; }
function DaisySelect({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text text-xs font-semibold uppercase tracking-wide">{label}</span>
      </label>
      <select
        className="select select-bordered bg-base-100/80 focus:ring-2 focus:ring-emerald-500"
        style={{ borderRadius: '9999px' }}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
