"use client"
import Link from "next/link"
import { useState } from "react"

const navLinks = [
    { label: "Eksplorasi", children: [ { label: "Web Design", href: "/categories/web-design" } ] },
    { label: "Bintang Tamsis", href: "/star" },
    { label: "Kabar Berita", href: "/news" },
];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    return (
        <header className="sticky top-0 z-40">
            <nav className="px-5 md:px-10 h-16 flex items-center gap-6 backdrop-blur bg-base-100/70 border-b border-base-300/60 supports-[backdrop-filter]:bg-base-100/55">
                {/* Brand + Mobile Toggle */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                        className="md:hidden btn btn-sm btn-ghost btn-circle"
                        aria-label="Toggle menu"
                        onClick={() => setMobileOpen(o => !o)}
                    >
                        {mobileOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" /></svg>
                        )}
                    </button>
                    <Link href="/" className="text-lg md:text-xl font-bold font-[Pacifico] whitespace-nowrap">Tamsis Kreasi Hub</Link>
                </div>

                {/* Desktop Nav */}
                <ul className="hidden md:flex items-center gap-2 lg:gap-4">
                    {navLinks.map(item => (
                        <li key={item.label} className="relative">
                            {item.children ? (
                                <div className="dropdown dropdown-hover">
                                    <button className="btn btn-ghost rounded-full btn-sm">
                                        {item.label}
                                        <svg className="w-3 h-3 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.957a.75.75 0 111.08 1.04l-4.25 4.53a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"/></svg>
                                    </button>
                                    <ul className="menu dropdown-content bg-base-100 rounded-xl shadow-xl p-4 mt-2 w-56">
                                        {item.children.map(ch => (
                                            <li key={ch.href}><Link href={ch.href}>{ch.label}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <Link href={item.href!} className="btn btn-ghost rounded-full btn-sm">{item.label}</Link>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Right - Auth */}
                <div className="flex items-center gap-3">
                    <Link href="/auth/signin" className="btn btn-primary rounded-full btn-sm hidden sm:inline-flex">Masuk</Link>
                </div>
            </nav>

            {/* Mobile Panel */}
            {mobileOpen && (
                <div className="md:hidden animate-fade-in">
                    <div className="px-5 pb-6 pt-2 space-y-4 bg-base-100/90 backdrop-blur border-b border-base-300/60">
                        <ul className="space-y-1">
                            {navLinks.map(item => (
                                <li key={item.label}>
                                    {item.children ? (
                                        <div>
                                            <button
                                                className="w-full flex items-center justify-between btn btn-ghost btn-sm rounded-full"
                                                onClick={() => setOpenDropdown(d => d === item.label ? null : item.label)}
                                            >
                                                <span>{item.label}</span>
                                                <svg className={`w-3 h-3 transition ${openDropdown === item.label ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.957a.75.75 0 111.08 1.04l-4.25 4.53a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"/></svg>
                                            </button>
                                            {openDropdown === item.label && (
                                                <ul className="mt-2 ml-4 space-y-1 border-l border-base-300 pl-3">
                                                    {item.children.map(ch => (
                                                        <li key={ch.href}><Link className="block py-1 text-sm" href={ch.href}>{ch.label}</Link></li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
                                        <Link href={item.href!} className="btn btn-ghost btn-sm w-full justify-start rounded-full">{item.label}</Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="pt-2">
                            <Link href="/auth/signin" className="btn btn-primary rounded-full w-full">Masuk</Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar