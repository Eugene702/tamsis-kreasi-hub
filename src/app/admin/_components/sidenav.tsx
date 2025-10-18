"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { PiStudentFill } from "react-icons/pi"
import { TbCategoryFilled, TbLayoutDashboardFilled } from "react-icons/tb"

const Sidenav = () => {
    const pathname = usePathname()
    const links: { label: string, href: string, icon?: ReactNode, fixed?: boolean }[] = [
        { label: "Dashboard", href: "/admin", icon: <TbLayoutDashboardFilled />, fixed: true },
        { label: "Manajemen Siswa", href: "/admin/student", icon: <PiStudentFill /> },
        { label: "Manajemen Kategori", href: "/admin/category", icon: <TbCategoryFilled /> }
    ]

    const isActive = (href: string, fixed: boolean = false) => {
        if(!fixed){
            return pathname.startsWith(href) ? 'menu-active' : ''
        }else{
            return pathname == href ? 'menu-active' : ''
        }
    }

    return <ul className="menu bg-transparent w-80 p-4 gap-y-4">
        {
            links.map((e, i) => <li key={i}><Link href={e.href} className={`flex items-center gap-2 !rounded-xl ${isActive(e.href, e.fixed)}`}>
                { e.icon }
                <span>{ e.label }</span>
            </Link></li>)
        }
    </ul>
}

export default Sidenav