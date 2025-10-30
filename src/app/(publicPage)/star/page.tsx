import { Fragment } from 'react'
import { StarList } from './_components/StarList'
import Link from 'next/link'
import { getStarStudents } from './action'
import { StatusCodes } from 'http-status-codes'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'
import { Major } from '@/lib/values'

const Error = dynamic(() => import('@/components/error'))

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ query?: string, jurusan?: string, kelas?: string, umur?: string }> }): Promise<Metadata> {
	const params = await searchParams
	
	const filters = []
	if (params.query) filters.push(`"${params.query}"`)
	if (params.jurusan) {
		const jurusanName = Major.find(m => m.key === params.jurusan)?.value
		if (jurusanName) filters.push(jurusanName)
	}
	if (params.kelas) filters.push(`Kelas ${params.kelas}`)
	if (params.umur) filters.push(`Umur ${params.umur} tahun`)
	
	const filterText = filters.length > 0 ? ` - ${filters.join(', ')}` : ''
	const title = `Star Siswa${filterText} | Tamsis Kreasi Hub`
	const description = filters.length > 0
		? `Temukan siswa unggulan ${filters.join(', ')} dengan karya-karya inspiratif dan inovatif. Lihat portfolio terbaik mereka.`
		: 'Temukan siswa unggulan dengan karya-karya inspiratif dan inovatif. Lihat portfolio terbaik dari siswa berbakat di berbagai jurusan.'

	return {
		title,
		description,
		keywords: [
			'star siswa',
			'siswa unggulan',
			'portfolio siswa',
			'karya siswa',
			'proyek siswa terbaik',
			...(params.jurusan ? [Major.find(m => m.key === params.jurusan)?.value || params.jurusan] : []),
			...(params.kelas ? [`kelas ${params.kelas}`] : []),
		],
		openGraph: {
			title,
			description,
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
		},
	}
}

const page = async ({ searchParams }: { searchParams: Promise<{ query?: string, jurusan?: string, kelas?: string, umur?: string }> }) => {
	const params = await searchParams
	
	const studentsResponse = await getStarStudents({
		query: params.query,
		jurusan: params.jurusan,
		kelas: params.kelas,
		umur: params.umur
	})

	if (studentsResponse.status !== StatusCodes.OK) {
		return <Error message={studentsResponse.message} />
	}

	const availableAges = studentsResponse.data!.ages

	const searchKey = JSON.stringify(params)

	const filters = []
	if (params.query) filters.push(params.query)
	if (params.jurusan) {
		const jurusanName = Major.find(m => m.key === params.jurusan)?.value
		if (jurusanName) filters.push(jurusanName)
	}
	if (params.kelas) filters.push(`Kelas ${params.kelas}`)
	if (params.umur) filters.push(`${params.umur} tahun`)

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: filters.length > 0 ? `Star Siswa - ${filters.join(', ')}` : 'Star Siswa',
		description: 'Daftar siswa unggulan beserta 5 proyek paling banyak dikunjungi',
		url: `https://tamsis-kreasi-hub.vercel.app/star${params.query || params.jurusan || params.kelas || params.umur ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''}`,
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Beranda',
					item: 'https://tamsis-kreasi-hub.vercel.app',
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Star Siswa',
				},
			],
		},
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: studentsResponse.data!.students.length,
			itemListElement: studentsResponse.data!.students.map((student, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'Person',
					name: student.name,
					url: `https://tamsis-kreasi-hub.vercel.app/${student.domain}`,
					image: typeof student.photo === 'object' && student.photo !== null && 'url' in student.photo 
						? student.photo.url 
						: undefined,
					jobTitle: 'Siswa',
					affiliation: {
						'@type': 'EducationalOrganization',
						name: 'Tamsis Kreasi Hub',
					},
					description: `Siswa ${Major.find(m => m.key === student.jurusan)?.value || student.jurusan} dengan ${student.totalViews} total views`,
				},
			})),
		},
	}

	return (
		<Fragment>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<article className="pt-10 md:pt-16 space-y-8">
				<nav className="text-[11px] breadcrumbs text-base-content/60" aria-label="Breadcrumb">
					<ul>
						<li><Link href="/">Beranda</Link></li>
						<li aria-current="page">Star Siswa</li>
					</ul>
				</nav>
				<header className="space-y-5 max-w-4xl">
					<h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight">
						<span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
							Star Siswa{filters.length > 0 && ` - ${filters.join(', ')}`}
						</span>
					</h1>
					<p className="text-base-content/70 text-sm md:text-[15px] max-w-2xl leading-relaxed">
						Daftar siswa unggulan beserta 5 proyek paling banyak dikunjungi. Gunakan filter untuk menemukan talenta berdasarkan jurusan, kelas, umur, atau nama.
					</p>
				</header>
			</article>
			<section className="mt-12" aria-label="Daftar Star Siswa">
				<StarList 
					key={searchKey}
					initialData={studentsResponse.data!.students} 
					hasMore={studentsResponse.data!.hasMore}
					availableAges={availableAges}
				/>
			</section>
		</Fragment>
	)
}

export default page