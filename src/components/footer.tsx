"use client"
import Link from "next/link";

type FooterSection = { title: string; links: { label: string; href: string }[] }

const navSections: FooterSection[] = [
    {
        title: "Navigasi",
        links: [
            { label: "Beranda", href: "/" },
            { label: "Bintang Tamsis", href: "/star" },
            { label: "Kabar Berita", href: "/news" },
            { label: "Web Design", href: "/categories/web-design" },
        ],
    },
    {
        title: "Tentang",
        links: [
            { label: "Profil", href: "/about" },
            { label: "Tim", href: "/team" },
            { label: "Dukungan", href: "/support" },
            { label: "Kontak", href: "/contact" },
        ],
    },
];

const socials = [
    { label: "Instagram", href: "https://instagram.com", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3zm10.75 1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/></svg>
    )},
    { label: "YouTube", href: "https://youtube.com", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M21.58 7.19a2.75 2.75 0 00-1.94-1.95C17.9 5 12 5 12 5s-5.9 0-7.64.24A2.75 2.75 0 002.42 7.2 28.52 28.52 0 002.18 12c0 1.67.16 3.33.24 4.8.22.97.98 1.73 1.95 1.95C6.1 19 12 19 12 19s5.9 0 7.64-.24a2.75 2.75 0 001.94-1.95c.16-1.47.24-3.13.24-4.8 0-1.67-.16-3.33-.24-4.8zM10 15.19V8.81L15.5 12 10 15.19z"/></svg>
    )},
    { label: "X", href: "https://x.com", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.5 3h3.3l-7.2 8.24L23.5 21h-6.4l-5-6.54L6 21H2.7l7.7-8.83L.5 3H7l4.5 5.93L18.5 3zm-2.2 15.6h1.8L7.8 4.3H5.9l10.4 14.3z"/></svg>
    )},
];

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="mt-20 border-t border-base-300/70 bg-base-100/80 backdrop-blur supports-[backdrop-filter]:bg-base-100/60 text-sm">
            <div className="relative">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-base-300 to-transparent" />
            </div>
            <div className="px-6 md:px-10 xl:px-20 py-12 md:py-16 grid gap-10 md:gap-14 lg:gap-16 md:grid-cols-12">
                <div className="md:col-span-5 lg:col-span-4 space-y-5">
                    <Link href="/" className="block text-2xl font-[Pacifico] tracking-wide">Tamsis Kreasi Hub</Link>
                    <p className="text-base-content/70 leading-relaxed max-w-sm">
                        Platform eksplorasi karya & talenta siswa SMK Taman Siswa 2 Jakarta. Temukan inspirasi, kolaborasi, dan inovasi di satu tempat.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                        {socials.map(s => (
                            <Link key={s.label} aria-label={s.label} href={s.href} target="_blank" className="btn btn-ghost btn-xs md:btn-sm btn-circle hover:bg-base-200">
                                {s.icon}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-4 lg:col-span-5 grid grid-cols-2 gap-8 md:gap-10">
                    {navSections.map(section => (
                        <div key={section.title} className="space-y-4">
                            <details className="md:hidden group [&_ul]:mt-3">
                                <summary className="cursor-pointer font-semibold text-[12px] uppercase tracking-wide text-base-content/70 flex items-center justify-between">
                                    {section.title}
                                    <span className="transition group-open:rotate-180">⌄</span>
                                </summary>
                                <ul className="space-y-2 text-[13px]">
                                    {section.links.map(l => (
                                        <li key={l.href}><Link className="hover:text-base-content/90 text-base-content/70" href={l.href}>{l.label}</Link></li>
                                    ))}
                                </ul>
                            </details>
                            <div className="hidden md:block">
                                <h3 className="font-semibold text-[12px] tracking-wide uppercase text-base-content/70">{section.title}</h3>
                                <ul className="mt-4 space-y-2 text-[13px]">
                                    {section.links.map(l => (
                                        <li key={l.href}><Link className="hover:text-base-content" href={l.href}>{l.label}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="md:col-span-3 lg:col-span-3 space-y-5">
                    <h3 className="font-semibold text-[12px] tracking-wide uppercase text-base-content/70">Newsletter</h3>
                    <p className="text-base-content/70 leading-relaxed text-[13px]">Dapatkan update terbaru karya & event langsung ke email Anda.</p>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                        <label className="join w-full *:rounded-full">
                            <input required type="email" placeholder="Email Anda" className="join-item input input-sm w-full" />
                            <button className="join-item btn btn-sm btn-primary">Kirim</button>
                        </label>
                        <p className="text-[11px] leading-snug text-base-content/50">Dengan berlangganan Anda menyetujui kebijakan privasi kami.</p>
                    </form>
                </div>
            </div>
            <div className="border-t border-base-300/60">
                <div className="px-6 md:px-10 xl:px-20 py-6 flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between text-[11px] md:text-xs text-base-content/60">
                    <p className="text-center md:text-left">&copy; {year} Tamsis Kreasi Hub. All rights reserved.</p>
                    <div className="flex gap-5 md:gap-6 flex-wrap justify-center">
                        <Link href="/terms" className="hover:text-base-content">Syarat</Link>
                        <Link href="/privacy" className="hover:text-base-content">Privasi</Link>
                        <Link href="/license" className="hover:text-base-content">Lisensi</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;