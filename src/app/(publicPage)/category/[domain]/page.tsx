import { Fragment } from 'react'
import Link from 'next/link'
import { CategoryProjectGrid } from './_components/CategoryProjectGrid'
import { getCategoryWithProjects, getCategoryProjects } from './action'
import { StatusCodes } from 'http-status-codes'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
	const { domain } = await params
	const response = await getCategoryWithProjects(domain, 10)

	if (response.status !== StatusCodes.OK || !response.data) {
		return {
			title: 'Kategori Tidak Ditemukan | Tamsis Kreasi Hub',
			description: 'Kategori yang Anda cari tidak ditemukan.'
		}
	}

	const { category } = response.data
	const title = `${category.name} - ${category._count.userProjects} Proyek | Tamsis Kreasi Hub`
	const description = `Jelajahi ${category._count.userProjects} proyek ${category.name} dari siswa berbakat. Temukan inspirasi, pelajari pendekatan desain & teknik implementasi yang dipakai.`
	const url = `https://tamsis-kreasi-hub.vercel.app/category/${domain}`

	return {
		title,
		description,
		keywords: [
			category.name,
			'proyek siswa',
			'portfolio',
			'karya siswa',
			`${category.name.toLowerCase()} project`,
			'portfolio siswa indonesia',
			'student projects'
		],
		alternates: {
			canonical: url
		},
		openGraph: {
			title,
			description,
			type: 'website',
			url,
			siteName: 'Tamsis Kreasi Hub'
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
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

const page = async ({ params }: { params: Promise<{ domain: string }> }) => {
	const { domain: slug } = await params
	
	// Single request untuk category + initial projects
	const response = await getCategoryWithProjects(slug, 10)

	if (response.status !== StatusCodes.OK || !response.data) {
		return redirect('/category')
	}

	const { category, projects } = response.data
	const initialProjects = projects.items
	const initialHasMore = projects.hasMore

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: category.name,
		description: `Kumpulan ${category._count.userProjects} proyek ${category.name}`,
		url: `https://tamsis-kreasi-hub.vercel.app/category/${slug}`,
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
					name: 'Kategori',
					item: 'https://tamsis-kreasi-hub.vercel.app/category',
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: category.name,
				},
			],
		},
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: category._count.userProjects,
			itemListElement: initialProjects.slice(0, 10).map((project: any, index: number) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'CreativeWork',
					name: project.title,
					url: `https://tamsis-kreasi-hub.vercel.app/project/${project.domain}`,
					author: {
						'@type': 'Person',
						name: project.user.name
					},
					interactionStatistic: {
						'@type': 'InteractionCounter',
						interactionType: 'https://schema.org/ViewAction',
						userInteractionCount: project._count.userProjectViews
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
						<li><Link href="/category">Kategori</Link></li>
						<li className="truncate max-w-[12rem] md:max-w-none" aria-current="page">{category.name}</li>
					</ul>
				</nav>
				<header className="space-y-5 max-w-4xl">
					<h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight">
						<span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
							{category.name}
						</span>
					</h1>
					<p className="text-base-content/70 text-sm md:text-[15px] max-w-2xl leading-relaxed">
						Kumpulan {category._count.userProjects} proyek dalam kategori <span className="font-medium text-base-content/80">{category.name}</span>. Temukan inspirasi, pelajari pendekatan desain & teknik implementasi yang dipakai.
					</p>
				</header>
			</article>

			<CategoryProjectGrid 
				categorySlug={slug} 
				initialProjects={initialProjects}
				initialHasMore={initialHasMore}
			/>
		</Fragment>
	)
}

export default page