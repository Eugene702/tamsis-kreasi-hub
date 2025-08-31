import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
    id: string;
    title: string;
    excerpt: string;
    cover: string;
    category: string;
    date: string; // ISO
    author: string;
    views: number;
}

const mockNews: NewsItem[] = Array.from({ length: 9 }).map((_, i) => ({
    id: `news-${i}`,
    title: `Highlight Kegiatan Kreatif Siswa #{${i + 1}}`,
    excerpt: 'Ringkasan singkat mengenai kegiatan terkini yang menonjolkan kolaborasi, inovasi, dan pencapaian siswa dalam bidang teknologi & desain.',
    cover: '/temp.png',
    category: ['Kompetisi', 'Workshop', 'Prestasi', 'Event'][i % 4],
    date: '2025-08-2' + (i % 9),
    author: 'Admin',
    views: 500 + i * 37,
}));

const formatNumber = (n: number) => Intl.NumberFormat('id-ID').format(n);
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

export default function NewsPage() {
    return (
        <Fragment>
            {/* Header */}
            <div className="pt-10 md:pt-16 space-y-6">
                <div className="space-y-5 max-w-3xl">
                    <span className="inline-flex items-center text-xs tracking-wide uppercase text-base-content/60 bg-base-200/60 px-3 py-1 rounded-full backdrop-blur-sm">Berita</span>
                    <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
                        <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">Update & Kabar Terkini</span>
                    </h1>
                    <p className="text-base-content/70 max-w-xl text-sm md:text-[15px] leading-relaxed">Ikuti perkembangan aktivitas, prestasi, dan informasi terbaru seputar karya kreatif serta komunitas siswa.</p>
                </div>
            </div>

            {/* Featured (first item) */}
            <section className="mt-12">
                <div className="grid lg:grid-cols-2 gap-10 items-stretch">
                    {mockNews.slice(0, 1).map(n => (
                        <Link key={n.id} href={`/news/${n.id}`} className="group relative rounded-3xl overflow-hidden ring-1 ring-base-300/40 bg-base-100/70 backdrop-blur-sm flex flex-col lg:flex-row">
                            <div className="relative w-full lg:w-1/2 aspect-video lg:aspect-auto lg:h-full">
                                <Image src={n.cover} alt={n.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            </div>
                            <div className="flex-1 p-8 flex flex-col gap-5">
                                <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-wide text-base-content/60">
                                    <span className="px-3 py-1 rounded-full bg-base-200/70">{n.category}</span>
                                    <span>{formatDate(n.date)}</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-semibold leading-snug group-hover:text-base-content/90 transition-colors">
                                    {n.title}
                                </h2>
                                <p className="text-sm md:text-[15px] text-base-content/70 leading-relaxed line-clamp-4">{n.excerpt}</p>
                                <div className="mt-auto flex items-center gap-4 text-xs text-base-content/60">
                                    <span className="inline-flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z"/></svg>
                                        {formatNumber(n.views)} views
                                    </span>
                                    <span>Oleh {n.author}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {/* Side mini list */}
                    <div className="space-y-6">
                        {mockNews.slice(1, 4).map(n => (
                            <Link key={n.id} href={`/news/${n.id}`} className="group flex gap-5 rounded-2xl p-4 ring-1 ring-base-300/30 bg-base-100/60 hover:bg-base-100/80 transition">
                                <div className="relative w-28 h-20 rounded-xl overflow-hidden flex-none">
                                    <Image src={n.cover} alt={n.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="flex flex-col gap-2 min-w-0">
                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-base-content/50">
                                        <span>{n.category}</span>
                                        <span className="w-1 h-1 rounded-full bg-base-content/30" />
                                        <span>{formatDate(n.date)}</span>
                                    </div>
                                    <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-base-content/90 transition-colors">{n.title}</h3>
                                    <p className="text-[11px] text-base-content/60 line-clamp-2">{n.excerpt}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* All list */}
            <section className="mt-16 space-y-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Semua Berita</h2>
                    <div className="flex gap-2 text-xs">
                        <button className="px-4 py-2 rounded-full bg-base-200/70 hover:bg-base-200 transition">Terbaru</button>
                        <button className="px-4 py-2 rounded-full bg-base-100/70 ring-1 ring-base-300/40 hover:bg-base-100 transition">Populer</button>
                    </div>
                </div>
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {mockNews.slice(0, 9).map(n => (
                        <Link key={n.id} href={`/news/${n.id}`} className="group flex flex-col rounded-2xl overflow-hidden ring-1 ring-base-300/30 bg-base-100/70 hover:bg-base-100 transition">
                            <div className="relative aspect-video overflow-hidden">
                                <Image src={n.cover} alt={n.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="absolute top-3 left-3 text-[10px] px-3 py-1 rounded-full bg-base-100/80 backdrop-blur-sm ring-1 ring-base-300/40 text-base-content/70">{n.category}</span>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-base-content/50">
                                    <span>{formatDate(n.date)}</span>
                                    <span className="w-1 h-1 rounded-full bg-base-content/30" />
                                    <span>{formatNumber(n.views)} views</span>
                                </div>
                                <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-base-content/90 transition-colors">{n.title}</h3>
                                <p className="text-[13px] text-base-content/70 leading-relaxed line-clamp-3">{n.excerpt}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center pt-4">
                    <button className="btn btn-outline btn-sm sm:btn-md !rounded-full">Load More</button>
                </div>
            </section>
        </Fragment>
    );
}