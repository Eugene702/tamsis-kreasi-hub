import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock fetch (replace with real data by slug)
const mockArticle = {
	title: 'Kolaborasi Siswa RPL & DKV Hasilkan Website Showcase Interaktif',
	cover: '/temp.png',
	category: 'Kolaborasi',
	date: '2025-08-25T09:30:00Z',
	author: {
		name: 'Admin',
		avatar: '/temp.png'
	},
	views: 1520,
	tags: ['Kolaborasi', 'RPL', 'DKV', 'UI Design'],
	content: `Inisiatif lintas jurusan kembali menghadirkan inovasi baru. Siswa dari jurusan Rekayasa Perangkat Lunak (RPL) berkolaborasi dengan jurusan Desain Komunikasi Visual (DKV) untuk membangun sebuah website showcase interaktif yang menampilkan karya-karya terbaik semester ini.

Kolaborasi ini berfokus pada penggabungan aspek estetika dan performa. Tim DKV bertanggung jawab pada arah visual, tipografi, dan konsistensi brand; sementara tim RPL mengimplementasikan komponen modular, optimasi loading aset, serta struktur data yang fleksibel.

Fitur utama website mencakup:
- Galeri dinamis dengan filter kategori
- Mode responsif yang dioptimalkan untuk perangkat mobile
- Navigasi yang minim distraksi
- Lightbox untuk preview karya resolusi tinggi

Selain itu, pipeline pengembangan mengadopsi praktik version control terstruktur dan review visual sebelum deployment. Hal ini meningkatkan kualitas akhir dan meminimalkan regresi desain.

Proyek ini diharapkan menjadi standar baru untuk integrasi lintas jurusan dan akan dikembangkan lebih lanjut dengan fitur personalisasi profil siswa dan analitik keterlibatan pengunjung.

"Kami ingin karya siswa lebih mudah dieksplorasi, bukan sekadar ditampilkan," ujar salah satu kontributor.`,
	related: Array.from({ length: 4 }).map((_, i) => ({ id: i, title: `Kegiatan Kreatif #${i + 1}`, cover: '/temp.png', date: '2025-08-2' + i })),
};

const formatNumber = (n: number) => Intl.NumberFormat('id-ID').format(n);
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

export default function NewsDetailPage({ params }: { params: { domain: string } }) {
	const a = mockArticle; // placeholder
	return (
		<Fragment>
			{/* Breadcrumb & Title */}
			<div className="pt-10 md:pt-16 space-y-8">
				<nav className="text-[11px] breadcrumbs text-base-content/60">
					<ul>
						<li><Link href="/">Beranda</Link></li>
						<li><Link href="/news">Berita</Link></li>
						<li className="truncate max-w-[12rem] md:max-w-none">{a.title}</li>
					</ul>
				</nav>
				<div className="space-y-6 max-w-4xl">
					<div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wide text-base-content/60">
						<span className="px-3 py-1 rounded-full bg-base-200/70">{a.category}</span>
						<span>{formatDate(a.date)}</span>
						<span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z" /></svg>{formatNumber(a.views)}</span>
					</div>
					<h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
						<span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">{a.title}</span>
					</h1>
					<div className="flex items-center gap-3">
						<div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-base-200">
							<Image src={a.author.avatar} alt={a.author.name} fill className="object-cover" />
						</div>
						<div className="text-sm text-base-content/70 leading-tight">
							<p className="font-medium text-base-content/90">{a.author.name}</p>
							<p className="text-[11px]">Penulis</p>
						</div>
					</div>
				</div>
			</div>

			{/* Cover */}
			<div className="mt-10 md:mt-12">
				<div className="relative aspect-video rounded-3xl overflow-hidden ring-1 ring-base-300/30 bg-base-200/50">
					<Image src={a.cover} alt={a.title} fill className="object-cover" />
					<div className="absolute inset-0 bg-gradient-to-t from-base-100/40 via-transparent to-transparent" />
				</div>
			</div>

			{/* Body & Aside */}
			<div className="mt-14 grid lg:grid-cols-12 gap-16">
				<article className="lg:col-span-8 space-y-8 text-base-content/80 leading-relaxed text-[15px]">
					{a.content.split('\n\n').map((block, i) => (
						<p key={i} className="whitespace-pre-line">
							{block}
						</p>
					))}
				</article>
				<aside className="lg:col-span-4 space-y-10 lg:pt-1">
					<div className="space-y-5 p-0 lg:p-1">
						<h3 className="font-semibold text-sm tracking-wide uppercase text-base-content/60">Info</h3>
						<ul className="space-y-3 text-sm">
							<li className="flex justify-between gap-6"><span className="text-base-content/50">Kategori</span><span>{a.category}</span></li>
							<li className="flex justify-between gap-6"><span className="text-base-content/50">Tanggal</span><span>{formatDate(a.date)}</span></li>
							<li className="flex justify-between gap-6"><span className="text-base-content/50">Views</span><span>{formatNumber(a.views)}</span></li>
						</ul>
						<div className="flex flex-wrap gap-2 pt-2">
							{a.tags.map(t => (
								<span key={t} className="px-3 py-1 rounded-full bg-base-200/70 text-xs text-base-content/70">{t}</span>
							))}
						</div>
					</div>
					<div className="space-y-4">
						<h3 className="font-semibold text-sm tracking-wide uppercase text-base-content/60">Bagikan</h3>
						<div className="flex gap-3">
							<button className="btn btn-sm rounded-full bg-base-200/70 hover:bg-base-200">Copy Link</button>
							<button className="btn btn-sm rounded-full bg-base-200/70 hover:bg-base-200">WhatsApp</button>
						</div>
					</div>
				</aside>
			</div>

			{/* Related */}
			<section className="mt-24 space-y-8">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Berita Terkait</h2>
					<Link href="/news" className="text-sm text-primary hover:underline">Lihat semua</Link>
				</div>
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{a.related.map(r => (
						<Link key={r.id} href={`/news/${r.id}`} className="group rounded-2xl overflow-hidden ring-1 ring-base-300/30 bg-base-100/70 hover:bg-base-100 transition flex flex-col">
							<div className="relative aspect-video overflow-hidden">
								<Image src={r.cover} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform" />
								<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							</div>
							<div className="p-4 flex flex-col gap-2">
								<h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-base-content/90 transition-colors">{r.title}</h3>
								<span className="text-[11px] text-base-content/50">{formatDate(r.date)}</span>
							</div>
						</Link>
					))}
				</div>
			</section>
		</Fragment>
	);
}