// Server component: daftar kategori saja (modern, responsive, konsisten)
import { Fragment } from 'react';
import Link from 'next/link';
import { FiGlobe, FiLayout, FiSmartphone, FiAperture, FiBarChart2, FiCpu } from 'react-icons/fi';
import { CategoryCard, type CategoryItemData } from './_components/CategoryCard';

// Data mock kategori – warna tidak dikelola per item (desain netral)
const categories: CategoryItemData[] = [
    {
        slug: 'web-development',
        name: 'Web Development',
        description: 'Website, aplikasi, UI interaktif, dan eksperimen front-end.',
        projects: 42,
        icon: FiGlobe,
        image: null,
    },
    {
        slug: 'ui-ux',
        name: 'UI / UX Design',
        description: 'Prototipe, desain antarmuka, dan pengalaman pengguna.',
        projects: 27,
        icon: FiLayout,
        image: null,
    },
    {
        slug: 'mobile-app',
        name: 'Mobile App',
        description: 'Aplikasi Android / iOS, PWA, dan konsep mobile.',
        projects: 18,
        icon: FiSmartphone,
        image: null,
    },
    {
        slug: 'game-dev',
        name: 'Game Dev',
        description: 'Mini games, gameplay prototype, dan asset interaktif.',
        projects: 9,
        icon: FiAperture,
        image: null,
    },
    {
        slug: 'data-visualization',
        name: 'Data Visualization',
        description: 'Grafik, dashboard, dan visual data edukatif.',
        projects: 11,
        icon: FiBarChart2,
        image: null,
    },
    {
        slug: 'automation',
        name: 'Automation',
        description: 'Bot, workflow otomatis, & integrasi produktivitas.',
        projects: 7,
        icon: FiCpu,
        image: null,
    }
];

// Jika nantinya butuh pagination / pencarian tinggal tambahkan komponen client.

export default function CategoryPage() {
    return (
        <Fragment>
            {/* Header */}
            <div className="pt-10 md:pt-16 space-y-6">
                <div className="space-y-5 max-w-3xl">
                    <span className="inline-flex items-center text-xs tracking-wide uppercase text-base-content/60 bg-base-200/60 px-3 py-1 rounded-full backdrop-blur-sm">Kategori</span>
                    <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
                        <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">Jelajahi Kategori Proyek</span>
                    </h1>
                    <p className="text-base-content/70 max-w-xl text-sm md:text-[15px] leading-relaxed">Pilih kategori untuk menemukan inspirasi, eksplorasi karya teman, dan pelajari stack yang digunakan. Fokus pada eksplorasi tanpa distraksi.</p>
                </div>
            </div>

            {/* Grid */}
                        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {categories.map((cat, i) => (
                                    <CategoryCard key={cat.slug} item={cat} index={i} />
                                ))}
                        </div>
        </Fragment>
    );
}