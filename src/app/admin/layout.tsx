import { useAuth } from "@/lib/auth"
import dynamic from "next/dynamic"
import Image from "next/image"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

const Sidenav = dynamic(() => import('./_components/sidenav'))
const Navbar = dynamic(() => import('./_components/navbar'))

const layout = async ({ children }: { children: ReactNode }) => {
    const session = await useAuth()
    if (session) {
        if (session.user) {
            if (session.user.role != "ADMIN") {
                return redirect("/")
            }
        }
    } else {
        return redirect("/")
    }

    return <main>
        <div className="drawer lg:drawer-open">
            <input id="drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <Navbar />
                <div className="p-10">
                    {children}
                </div>
            </div>
            <div className="drawer-side py-8">
                <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex items-center gap-2 px-6">
                    <Image
                        src={"/assets/images/logo.png"}
                        height={60}
                        width={60}
                        alt="Logo Taman Siswa" />
                    <span className="font-bold text-xl">Tamsis Portofolio</span>
                </div>
                <Sidenav />
            </div>
        </div>
    </main>
}

export default layout