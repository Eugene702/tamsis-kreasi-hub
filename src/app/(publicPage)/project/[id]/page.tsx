"use client"
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import dynamic from "next/dynamic";

const CardContent = dynamic(() => import('@/components/cardContent'));

// TODO: Integrasikan data nyata via fetch / server component.
const mockProject = {
    title: "Website Portfolio Siswa - Creative Showcase",
    category: "Web Development",
    cover: "/temp.png",
    author: {
        name: "Suwir",
        avatar: "/temp.png",
        role: "Siswa XI RPL",
    },
    stats: {
        views: 1250,
        created: "2025-08-10",
        updated: "2025-08-20",
    },
    tags: ["Next.js", "TailwindCSS", "UI Design", "Responsive"],
    description: `Project ini menampilkan portofolio interaktif untuk memamerkan karya siswa dengan desain modern yang fokus pada tipografi, visual preview, dan performa.`,
    content: `Fitur utama:\n- Landing dengan highlight interaktif\n- Komponen kartu modular\n- Responsif & aksesibel\n- Optimasi gambar Next.js\n\nStack & Pendekatan:\nStruktur dirancang modular dengan fokus ke reusability, readability, & minim style berlebihan.`,
    gallery: ["/temp.png", "/temp.png", "/temp.png"],
};

const formatNumber = (n: number) => Intl.NumberFormat("id-ID").format(n);

const ProjectDetailPage = () => {
    const p = mockProject;
    return (
        <Fragment>
                        {/* Header & Hero minimal (Dribbble-inspired) */}
                        <div className="pt-10 md:pt-16 space-y-6">
                            <nav className="text-[11px] breadcrumbs text-base-content/60">
                                <ul>
                                    <li><Link href="/">Beranda</Link></li>
                                    <li><Link href="/category/web-development">Web Development</Link></li>
                                    <li className="truncate max-w-[10rem] md:max-w-none">{p.title}</li>
                                </ul>
                            </nav>
                            <div className="space-y-5 max-w-4xl">
                                <span className="inline-flex items-center text-xs tracking-wide uppercase text-base-content/60 bg-base-200/60 px-3 py-1 rounded-full backdrop-blur-sm">{p.category}</span>
                                <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
                                    <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                                        {p.title}
                                    </span>
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-base-content/70">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 relative rounded-full overflow-hidden ring-2 ring-base-100 shadow-sm">
                                            <Image src={p.author.avatar} alt={p.author.name} fill className="object-cover" />
                                        </div>
                                        <div className="leading-tight">
                                            <p className="font-medium text-base-content/90">{p.author.name}</p>
                                            <p className="text-[11px] text-base-content/60">{p.author.role}</p>
                                        </div>
                                    </div>
                                    <span className="hidden md:inline h-1 w-1 rounded-full bg-base-content/30" />
                                    <span>Published {p.stats.created}</span>
                                    <span className="hidden md:inline">Updated {p.stats.updated}</span>
                                    <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z"/></svg> {formatNumber(p.stats.views)}</span>
                                    
                                </div>
                            </div>
                        </div>

                        {/* Cover Image (clean, no border) */}
                        <div className="mt-10 md:mt-12 relative">
                            <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-lg shadow-base-300/30 ring-1 ring-base-300/20 bg-base-200/40">
                                <Image src={p.cover} alt={p.title} fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-base-100/40 via-transparent to-transparent" />
                            </div>
                        </div>

                        {/* Floating Meta Bar (optional subtle) */}
                        <div className="mt-8 flex flex-wrap gap-3 text-xs md:text-[13px]">
                            <span className="px-4 py-2 rounded-full bg-base-100/70 backdrop-blur-sm shadow-sm">Updated {p.stats.updated}</span>
                            <button className="px-4 py-2 rounded-full bg-base-200/70 hover:bg-base-200 transition shadow-sm">Bagikan</button>
                        </div>

            {/* Description & Content */}
                        <div className="mt-14 grid lg:grid-cols-12 gap-16">
                            <div className="lg:col-span-8 space-y-14">
                                <section className="space-y-5">
                                    <h2 className="text-xl font-semibold">Deskripsi</h2>
                                    <p className="leading-relaxed text-base-content/80 whitespace-pre-line text-[15px]">{p.description}</p>
                                </section>
                                <section className="space-y-5">
                                    <h2 className="text-xl font-semibold">Detail Proyek</h2>
                                    <div className="space-y-4 text-base-content/80 text-[15px]">
                                        {p.content.split("\n\n").map((block, i) => (
                                            <p key={i} className="whitespace-pre-line">{block}</p>
                                        ))}
                                    </div>
                                </section>
                                <section className="space-y-5">
                                    <h2 className="text-xl font-semibold">Galeri</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                                        {p.gallery.map((g, i) => (
                                            <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-base-200/60 ring-1 ring-base-300/20">
                                                <Image src={g} alt={`${p.title} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform" />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                            {/* Info minimal (no contributor card) */}
                            <aside className="lg:col-span-4 space-y-10 lg:pt-2">
                                <div className="space-y-6 p-0 lg:p-2">
                                    <h3 className="font-semibold text-sm tracking-wide uppercase text-base-content/60">Info</h3>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex justify-between gap-6"><span className="text-base-content/50">Kategori</span><span>{p.category}</span></li>
                                        <li className="flex justify-between gap-6"><span className="text-base-content/50">Dibuat</span><span>{p.stats.created}</span></li>
                                        <li className="flex justify-between gap-6"><span className="text-base-content/50">Update</span><span>{p.stats.updated}</span></li>
                                        <li className="flex justify-between gap-6"><span className="text-base-content/50">Views</span><span>{formatNumber(p.stats.views)}</span></li>
                                        
                                    </ul>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {p.tags.map(t => (
                                            <span key={t} className="px-3 py-1 rounded-full bg-base-200/70 text-xs text-base-content/70">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        </div>

            {/* Related Projects (placeholder) */}
                        <section className="mt-24 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Proyek Terkait</h2>
                                <Link href="/category/web-development" className="text-sm text-primary hover:underline">Lihat semua</Link>
                            </div>
                            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                                {Array.from({ length: 4 }).map((_, i) => <CardContent key={i} />)}
                            </div>
                        </section>
        </Fragment>
    );
};

export default ProjectDetailPage;