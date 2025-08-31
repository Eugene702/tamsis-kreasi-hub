import Image from 'next/image';
import dynamic from 'next/dynamic';

const CardContent = dynamic(() => import('@/components/cardContent'));

export interface StudentProjectSummary {
  id: string;
  title: string;
  views: number;
}
export interface StudentStarData {
  id: string;
  name: string;
  avatar: string;
  jurusan: string;
  kelas: string;
  umur: number;
  projects: StudentProjectSummary[]; // top 5
  totalViews: number;
  responseTime?: string;
  services?: number;
  location?: string;
}

const formatNumber = (n: number) => Intl.NumberFormat('id-ID').format(n);

export function StarItem({ data }: { data: StudentStarData }) {
  return (
    <div className="rounded-3xl bg-base-100/80 backdrop-blur-md ring-1 ring-base-300/40 p-6 md:p-8 flex flex-col gap-6 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden ring-2 ring-base-200 shadow-sm flex-none">
            <Image src={data.avatar} alt={data.name} fill className="object-cover" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">{data.name}</span>
            </h2>
            <div className="flex flex-wrap gap-3 text-xs md:text-[11px] text-base-content/60">
              <span className="inline-flex items-center gap-1">{data.jurusan}</span>
              <span className="inline-flex items-center gap-1">Kelas {data.kelas}</span>
              <span className="inline-flex items-center gap-1">{data.umur} th</span>
              <span className="inline-flex items-center gap-1">{formatNumber(data.totalViews)} views</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 md:flex-col">
          <button className="px-4 py-2 rounded-full bg-base-200/70 hover:bg-base-200 text-xs md:text-sm transition">Detail</button>
          <button className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-xs md:text-sm text-white transition">Hubungi</button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        {data.projects.map(p => (
          <div key={p.id} className="group relative rounded-xl overflow-hidden ring-1 ring-base-300/30 bg-base-200/50 aspect-[4/3] flex items-center justify-center text-center p-3 text-[11px] leading-tight text-base-content/70 hover:bg-base-200/80 transition">
            <span className="line-clamp-3">{p.title}</span>
            <span className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-full bg-black/40 text-white/90 backdrop-blur-sm">{formatNumber(p.views)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
