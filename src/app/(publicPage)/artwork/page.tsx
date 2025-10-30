import { Fragment } from 'react'
import Link from 'next/link'
import { ArtworkGrid } from './_components/ArtworkGrid'
import { getArtworks, getArtworksWithTotal } from './action'
import { StatusCodes } from 'http-status-codes'
import { Metadata } from 'next'

type SearchParams = {
	search?: string
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
	const params = await searchParams
	const search = params.search || ''
	const response = await getArtworksWithTotal(search, 12)
	
	if (response.status !== StatusCodes.OK || !response.data) {
		return {
			title: 'Karya Siswa | Tamsis Kreasi Hub',
			description: 'Jelajahi karya terpopuler dari siswa berbakat.'
		}
	}

	const { total } = response.data
	const baseUrl = 'https://tamsis-kreasi-hub.vercel.app'
	const url = search ? `${baseUrl}/artwork?search=${encodeURIComponent(search)}` : `${baseUrl}/artwork`

	const title = search 
		? `Hasil Pencarian "${search}" - ${total} Karya | Tamsis Kreasi Hub`
		: `Karya Terpopuler - ${total} Karya Siswa | Tamsis Kreasi Hub`
	
	const description = search
		? `Menemukan ${total} karya untuk pencarian "${search}". Jelajahi portfolio & karya kreatif siswa terbaik dari TAMSIS.`
		: `Jelajahi ${total} karya terpopuler dari siswa berbakat TAMSIS, diurutkan berdasarkan jumlah views. Temukan inspirasi & karya terbaik.`

	return {
		title,
		description,
		keywords: [
			'karya siswa',
			'portfolio terpopuler',
			'karya kreatif',
			'student projects',
			'portfolio siswa indonesia',
			'karya terbaik',
			'tamsis',
			'smk',
			search
		].filter(Boolean),
		alternates: {
			canonical: url
		},
		openGraph: {
			title,
			description,
			type: 'website',
			url,
			siteName: 'Tamsis Kreasi Hub',
			locale: 'id_ID',
			images: [
				{
					url: `${baseUrl}/assets/images/logo.png`,
					width: 1200,
					height: 630,
					alt: 'Tamsis Kreasi Hub - Karya Siswa'
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [`${baseUrl}/assets/images/logo.png`]
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			}
		}
	}
}

const page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
	const params = await searchParams
	const search = params.search || ''
	
	// Single request untuk total + initial artworks
	const response = await getArtworksWithTotal(search, 12)

	if (response.status !== StatusCodes.OK || !response.data) {
		return (
			<div className="pt-10 md:pt-16 text-center">
				<p className="text-base-content/60">Gagal memuat data karya. Silakan coba lagi.</p>
			</div>
		)
	}

	const { total, artworks } = response.data
	const initialArtworks = artworks.items
	const initialHasMore = artworks.hasMore
	const baseUrl = 'https://tamsis-kreasi-hub.vercel.app'

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: search ? `Pencarian Karya: ${search}` : 'Karya Terpopuler',
		description: search 
			? `Hasil pencarian untuk "${search}" - ${total} karya ditemukan`
			: `Kumpulan ${total} karya siswa terpopuler berdasarkan jumlah views`,
		url: `${baseUrl}/artwork${search ? `?search=${encodeURIComponent(search)}` : ''}`,
		publisher: {
			'@type': 'Organization',
			name: 'TAMSIS Kreasi Hub',
			logo: {
				'@type': 'ImageObject',
				url: `${baseUrl}/assets/images/logo.png`,
			}
		},
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Beranda',
					item: `${baseUrl}`,
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Karya',
					item: `${baseUrl}/artwork`,
				},
			],
		},
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: total,
			itemListElement: initialArtworks.slice(0, 12).map((artwork: any, index: number) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'CreativeWork',
					name: artwork.title,
					url: `${baseUrl}/project/${artwork.domain}`,
					image: artwork.banner?.url || artwork.banner?.secure_url,
					author: {
						'@type': 'Person',
						name: artwork.user.name,
						image: artwork.user.photo?.url || artwork.user.photo?.secure_url
					},
					interactionStatistic: {
						'@type': 'InteractionCounter',
						interactionType: 'https://schema.org/ViewAction',
						userInteractionCount: artwork._count.userProjectViews
					}
				}
			}))
		}
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
						<li aria-current="page">Karya</li>
					</ul>
				</nav>
				<header className="space-y-5 max-w-4xl">
					<h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight">
						{search ? (
							<>
								Hasil Pencarian{' '}
								<span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
									"{search}"
								</span>
							</>
						) : (
							<span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
								Karya Terpopuler
							</span>
						)}
					</h1>
					<p className="text-base-content/70 text-sm md:text-[15px] max-w-2xl leading-relaxed">
						{search ? (
							<>
								Menemukan <span className="font-medium text-base-content/80">{total}</span> karya untuk pencarian{' '}
								<span className="font-medium text-base-content/80">"{search}"</span>. 
								Jelajahi portfolio & karya kreatif siswa terbaik.
							</>
						) : (
							<>
								Kumpulan <span className="font-medium text-base-content/80">{total}</span> karya siswa terpopuler, 
								diurutkan berdasarkan jumlah views. Temukan inspirasi & pelajari karya terbaik dari siswa berbakat.
							</>
						)}
					</p>
				</header>
			</article>

			<ArtworkGrid 
				initialArtworks={initialArtworks}
				initialHasMore={initialHasMore}
				search={search}
			/>
		</Fragment>
	)
}

export default page
