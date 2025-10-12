import Image from 'next/image';
import Link from 'next/link';

export interface ProjectAuthor { name: string; avatar: string; role: string; }
export interface ProjectStats { views: number; created: string; updated: string; }

interface ProjectHeaderProps {
  title: string;
  category: string;
  author: ProjectAuthor;
  stats: ProjectStats;
}

const formatNumber = (n: number) => Intl.NumberFormat('id-ID').format(n);

export function ProjectHeader({ title, category, author, stats }: ProjectHeaderProps) {
  return (
    <div className="pt-10 md:pt-16 space-y-6">
      <nav className="text-[11px] breadcrumbs text-base-content/60 flex justify-between items-center">
        <ul>
          <li><Link href="/">Beranda</Link></li>
          <li><Link href="/category/web-development">Web Development</Link></li>
          <li className="truncate max-w-[10rem] md:max-w-none">{title}</li>
        </ul>

        <Link href={"/project/asn/edit"} className="btn btn-ghost rounded-xl">Edit Projek</Link>
      </nav>
      <div className="space-y-5 max-w-4xl">
        <span className="inline-flex items-center text-xs tracking-wide uppercase text-base-content/60 bg-base-200/60 px-3 py-1 rounded-full backdrop-blur-sm">{category}</span>
        <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
          <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">{title}</span>
        </h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-base-content/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 relative rounded-full overflow-hidden ring-2 ring-base-100 shadow-sm">
              <Image src={author.avatar} alt={author.name} fill className="object-cover" />
            </div>
            <div className="leading-tight">
              <p className="font-medium text-base-content/90">{author.name}</p>
              <p className="text-[11px] text-base-content/60">{author.role}</p>
            </div>
          </div>
          <span className="hidden md:inline h-1 w-1 rounded-full bg-base-content/30" />
          <span>Published {stats.created}</span>
          <span className="hidden md:inline">Updated {stats.updated}</span>
          <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z" /></svg> {formatNumber(stats.views)}</span>
        </div>
      </div>
    </div>
  );
}
