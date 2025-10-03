"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const Tabs = ({ domain }: { domain: string }) => {
    const pathname = usePathname()
    const isActiveMenu = (path: string) => pathname === path ? 'tab-active' : ''

    return <div role="tablist" className="tabs tabs-border gap-4">
        <Link href={`/${domain}`} className={`tab ${isActiveMenu(`/${domain}`)}`} role="tab">Proyek</Link>
        <Link href={`/${domain}/bio`} className={`tab ${isActiveMenu(`/${domain}/bio`)} `} role="tab">Biodata</Link>
    </div>
}

export default Tabs