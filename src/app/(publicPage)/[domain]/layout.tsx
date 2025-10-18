import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { Fragment, ReactNode } from "react"

const Tabs = dynamic(() => import('./_components/tabs'))

const layout = async ({ children, params }: { children: ReactNode, params: Promise<{ domain: string }> }) => {
    const param = await params
    const p = {
        name: 'Eugene Feilian Putra Rangga',
        avatar: '/temp.png',
        location: 'Jakarta, Indonesia',
        jurusan: 'RPL',
        kelas: 'XI',
        umur: 17,
    }

    return <Fragment>
        <div className="pt-10 md:pt-16 space-y-10">
            <nav className="text-[11px] breadcrumbs text-base-content/60">
                <ul>
                    <li><Link href="/">Beranda</Link></li>
                    <li>Profil</li>
                    <li className="truncate max-w-[12rem] md:max-w-none">{p.name}</li>
                </ul>
            </nav>
            <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex items-center gap-6 flex-1">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden ring-2 ring-base-200 shadow-sm">
                        <Image src={p.avatar} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-2xl md:text-4xl font-bold leading-tight">
                            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">{p.name}</span>
                        </h1>
                        <div className="flex flex-wrap gap-3 text-xs md:text-[11px] text-base-content/60">
                            <span>{p.location}</span>
                            <span className="w-1 h-1 rounded-full bg-base-content/30" />
                            <span>Jurusan {p.jurusan}</span>
                            <span className="w-1 h-1 rounded-full bg-base-content/30" />
                            <span>Kelas {p.kelas}</span>
                            <span className="w-1 h-1 rounded-full bg-base-content/30" />
                            <span>{p.umur} th</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-14">
            <Tabs domain={param.domain} />
            <div className="py-12">
                { children }
            </div>
        </div>
    </Fragment>
}

export default layout