import Link from 'next/link';
import Image from 'next/image';
import { type IconType } from 'react-icons';

export interface CategoryItemData {
  slug: string;
  name: string;
  description: string;
  projects: number;
  icon?: IconType;
  image?: string | null;
}

const formatNumber = (n: number) => Intl.NumberFormat('id-ID').format(n);

export function CategoryCard({ item, index }: { item: CategoryItemData; index: number }) {
  // Neutral / subtle design variant (tanpa warna-warni gradient luar)
  return (
    <Link
      href={`/category/${item.slug}`}
      className="group flex flex-col rounded-2xl border border-base-300/40 bg-base-100/70 backdrop-blur-sm p-6 gap-5 shadow-sm hover:shadow-md hover:border-base-300/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-base-200/70 ring-1 ring-base-300/40 shadow-sm group-hover:scale-105 group-active:scale-95 transition-all overflow-hidden">
            {item.image ? (
              <Image src={item.image} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
            ) : item.icon ? (
              <item.icon className="w-6 h-6 text-base-content/80" />
            ) : (
              <span className="text-base-content/60 text-sm font-medium">{item.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-lg leading-tight group-hover:text-base-content transition-colors">{item.name}</h2>
            <p className="text-[11px] uppercase tracking-wide text-base-content/50">{formatNumber(item.projects)} Proyek</p>
          </div>
        </div>
        <span className="mt-1 inline-flex items-center justify-center rounded-full bg-base-200/70 text-base-content/60 w-8 h-8 ring-1 ring-base-300/40 group-hover:bg-base-200 group-hover:text-base-content/80 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </span>
      </div>
      <p className="text-sm text-base-content/70 leading-relaxed line-clamp-3">{item.description}</p>
      <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-base-content/50">
        <span className="inline-flex items-center gap-1">Lihat Detail</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="w-1 h-1 rounded-full bg-base-content/40" />
          <span className="w-1 h-1 rounded-full bg-base-content/40" />
          <span className="w-1 h-1 rounded-full bg-base-content/40" />
        </div>
      </div>
    </Link>
  );
}
