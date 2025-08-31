"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { FiUser, FiGrid } from 'react-icons/fi';

const CardContent = dynamic(() => import('@/components/cardContent'));

interface ProfileData {
  name: string;
  avatar: string;
  location?: string;
  jurusan: string;
  kelas: string;
  umur: number;
  bio: string;
  skills: string[];
  projects: number;
  totalViews: number;
  topProjects: number;
}

const mock: ProfileData = {
  name: 'Eugene Feilian Putra Rangga',
  avatar: '/temp.png',
  location: 'Jakarta, Indonesia',
  jurusan: 'RPL',
  kelas: 'XI',
  umur: 17,
  bio: 'Siswa yang fokus pada pengembangan web modern, eksplorasi UI minimalis, dan performa aplikasi front-end. Suka kolaborasi & berbagi pengetahuan.',
  skills: ['Next.js', 'TypeScript', 'TailwindCSS', 'UI Design', 'REST API'],
  projects: 18,
  totalViews: 12500,
  topProjects: 5,
};

const formatNumber = (n: number) => Intl.NumberFormat('id-ID').format(n);

export function ProfileTabs() {
  const [tab, setTab] = useState<'projects' | 'bio'>('projects');

  return (
    <div className="space-y-10">
      {/* Tab Switch */}
      <div className="flex items-center gap-3 border-b border-base-300/40">
        <button
          onClick={() => setTab('projects')}
          className={`px-4 py-3 text-sm font-medium relative ${tab === 'projects' ? 'text-base-content' : 'text-base-content/60'} transition`}
        >
          <span className="inline-flex items-center gap-2"><FiGrid className="w-4 h-4" /> Proyek</span>
          {tab === 'projects' && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-emerald-500 rounded-full" />}
        </button>
        <button
          onClick={() => setTab('bio')}
          className={`px-4 py-3 text-sm font-medium relative ${tab === 'bio' ? 'text-base-content' : 'text-base-content/60'} transition`}
        >
          <span className="inline-flex items-center gap-2"><FiUser className="w-4 h-4" /> Biodata</span>
          {tab === 'bio' && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-emerald-500 rounded-full" />}
        </button>
      </div>

      {tab === 'projects' && (
        <div className="space-y-12">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <CardContent key={i} />)}
          </div>
          <div className="flex justify-center">
            <button className="btn btn-outline btn-sm sm:btn-md !rounded-full">Load More</button>
          </div>
        </div>
      )}

      {tab === 'bio' && (
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Tentang</h2>
              <p className="text-sm leading-relaxed text-base-content/70 whitespace-pre-line">{mock.bio}</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Keahlian</h2>
              <div className="flex flex-wrap gap-2">
                {mock.skills.map(s => <span key={s} className="px-3 py-1 rounded-full bg-base-200/70 text-xs text-base-content/70">{s}</span>)}
              </div>
            </section>
          </div>
          <aside className="space-y-6">
            <div className="p-5 rounded-2xl bg-base-100/70 ring-1 ring-base-300/40 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Ringkasan</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span className="text-base-content/50">Total Proyek</span><span>{mock.projects}</span></li>
                <li className="flex justify-between"><span className="text-base-content/50">Total Views</span><span>{formatNumber(mock.totalViews)}</span></li>
                <li className="flex justify-between"><span className="text-base-content/50">Top Projects</span><span>{mock.topProjects}</span></li>
                <li className="flex justify-between"><span className="text-base-content/50">Jurusan</span><span>{mock.jurusan}</span></li>
                <li className="flex justify-between"><span className="text-base-content/50">Kelas</span><span>{mock.kelas}</span></li>
                <li className="flex justify-between"><span className="text-base-content/50">Umur</span><span>{mock.umur} th</span></li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
