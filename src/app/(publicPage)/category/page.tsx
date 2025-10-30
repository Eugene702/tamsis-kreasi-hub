import { Fragment } from 'react'
import { FiGlobe, FiLayout, FiSmartphone, FiAperture, FiBarChart2, FiCpu, FiPackage } from 'react-icons/fi'
import { CategoryCard, type CategoryItemData } from './_components/CategoryCard'
import { getCategories } from './action'
import { StatusCodes } from 'http-status-codes'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'
import { type IconType } from 'react-icons'

const Error = dynamic(() => import('@/components/error'))

export const metadata: Metadata = {
    title: 'Kategori Proyek | Tamsis Kreasi Hub',
    description: 'Jelajahi berbagai kategori proyek siswa dari Web Development, UI/UX Design, Mobile App, Game Development, Data Visualization, Automation dan lainnya. Temukan inspirasi dan pelajari stack yang digunakan.',
    keywords: [
        'kategori proyek',
        'web development',
        'ui ux design',
        'mobile app',
        'game development',
        'data visualization',
        'automation',
        'portfolio siswa',
        'proyek siswa'
    ],
    openGraph: {
        title: 'Kategori Proyek | Tamsis Kreasi Hub',
        description: 'Jelajahi berbagai kategori proyek siswa. Temukan inspirasi dan pelajari stack yang digunakan.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kategori Proyek | Tamsis Kreasi Hub',
        description: 'Jelajahi berbagai kategori proyek siswa. Temukan inspirasi dan pelajari stack yang digunakan.',
    }
}

const categoryIcons: Record<string, IconType> = {
    'web-development': FiGlobe,
    'web': FiGlobe,
    'ui-ux': FiLayout,
    'design': FiLayout,
    'mobile-app': FiSmartphone,
    'mobile': FiSmartphone,
    'game-dev': FiAperture,
    'game': FiAperture,
    'data-visualization': FiBarChart2,
    'data': FiBarChart2,
    'automation': FiCpu,
}

const getCategoryIcon = (slug: string): IconType => {
    const normalizedSlug = slug.toLowerCase()
    for (const [key, icon] of Object.entries(categoryIcons)) {
        if (normalizedSlug.includes(key)) {
            return icon
        }
    }
    return FiPackage
}

const page = async () => {
    const response = await getCategories()

    if (response.status !== StatusCodes.OK) {
        return <Error message={response.message} />
    }

    const categories: CategoryItemData[] = response.data?.map(cat => ({
        slug: cat.slug,
        name: cat.name,
        description: `Jelajahi ${cat._count.userProjects} proyek ${cat.name.toLowerCase()} dari siswa berbakat.`,
        projects: cat._count.userProjects,
        icon: getCategoryIcon(cat.slug),
        image: null
    })) || []

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Kategori Proyek',
        description: 'Jelajahi berbagai kategori proyek siswa',
        url: 'https://tamsis-kreasi-hub.vercel.app/category',
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
                },
            ],
        },
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: categories.length,
            itemListElement: categories.map((cat, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Thing',
                    name: cat.name,
                    url: `https://tamsis-kreasi-hub.vercel.app/category/${cat.slug}`,
                    description: cat.description,
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
            <article className="pt-10 md:pt-16 space-y-6">
                <header className="space-y-5 max-w-3xl">
                    <span className="inline-flex items-center text-xs tracking-wide uppercase text-base-content/60 bg-base-200/60 px-3 py-1 rounded-full backdrop-blur-sm">
                        Kategori
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
                        <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                            Jelajahi Kategori Proyek
                        </span>
                    </h1>
                    <p className="text-base-content/70 max-w-xl text-sm md:text-[15px] leading-relaxed">
                        Pilih kategori untuk menemukan inspirasi, eksplorasi karya teman, dan pelajari stack yang digunakan. Fokus pada eksplorasi tanpa distraksi.
                    </p>
                </header>
            </article>

            <section className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" aria-label="Daftar Kategori">
                {categories.length > 0 ? (
                    categories.map((cat, i) => (
                        <CategoryCard key={cat.slug} item={cat} index={i} />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                        <FiPackage className="w-16 h-16 text-base-content/20 mb-4" />
                        <p className="text-base-content/60 text-sm">Belum ada kategori tersedia.</p>
                    </div>
                )}
            </section>
        </Fragment>
    )
}

export default page