import { Fragment } from 'react';
import Link from 'next/link';
import { CategoryProjectGrid } from './_components/CategoryProjectGrid';

interface Props {
	params: { domain: string };
	searchParams: Record<string, string | string[] | undefined>;
}


export default function CategoryDomainPage({ params }: Props) {
	const slug = params.domain;
	const categoryName = slug
		.split('-')
		.map(s => s.charAt(0).toUpperCase() + s.slice(1))
		.join(' ');

	return (
		<Fragment>
			{/* Breadcrumb + Heading */}
			<div className="pt-10 md:pt-16 space-y-8">
				<nav className="text-[11px] breadcrumbs text-base-content/60">
					<ul>
						<li><Link href="/">Beranda</Link></li>
						<li><Link href="/category">Kategori</Link></li>
						<li className="truncate max-w-[12rem] md:max-w-none">{categoryName}</li>
					</ul>
				</nav>
				<div className="space-y-5 max-w-4xl">
					<h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight">
						<span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">{categoryName}</span>
					</h1>
					<p className="text-base-content/70 text-sm md:text-[15px] max-w-2xl leading-relaxed">Kumpulan proyek dalam kategori <span className="font-medium text-base-content/80">{categoryName}</span>. Temukan inspirasi, pelajari pendekatan desain & teknik implementasi yang dipakai.</p>
				</div>
				{/* Toolbar (placeholder for filters / sort) */}
				<div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
					<button className="px-4 py-2 rounded-full bg-base-200/70 hover:bg-base-200 transition text-base-content/70">Terbaru</button>
					<button className="px-4 py-2 rounded-full bg-base-100/60 ring-1 ring-base-300/40 hover:bg-base-100 transition text-base-content/70">Populer</button>
					<button className="px-4 py-2 rounded-full bg-base-100/60 ring-1 ring-base-300/40 hover:bg-base-100 transition text-base-content/70">A-Z</button>
				</div>
			</div>

			<CategoryProjectGrid categorySlug={slug} />
		</Fragment>
	);
}