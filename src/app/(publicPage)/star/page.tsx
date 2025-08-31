import { Fragment } from 'react';
import { StarList } from './_components/StarList';
import Link from 'next/link';

export default function StarPage() {
	return (
		<Fragment>
			<div className="pt-10 md:pt-16 space-y-8">
				<nav className="text-[11px] breadcrumbs text-base-content/60">
					<ul>
						<li><Link href="/">Beranda</Link></li>
						<li>Star Siswa</li>
					</ul>
				</nav>
				<div className="space-y-5 max-w-4xl">
					<h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight">
						<span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">Star Siswa</span>
					</h1>
					<p className="text-base-content/70 text-sm md:text-[15px] max-w-2xl leading-relaxed">Daftar siswa unggulan beserta 5 proyek paling banyak dikunjungi. Gunakan filter untuk menemukan talenta berdasarkan jurusan, kelas, umur, atau nama.</p>
				</div>
			</div>
			<div className="mt-12">
				<StarList />
			</div>
		</Fragment>
	);
}