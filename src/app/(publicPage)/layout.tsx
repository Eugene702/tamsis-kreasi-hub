import dynamic from "next/dynamic"
import { Fragment, ReactNode } from "react"
import Navbar from "@/components/navbar/index"

const Footer = dynamic(() => import('../../components/footer'))

const Layout = async ({ children }: { children: ReactNode }) => {
    return <Fragment>
        <Navbar />
        <div className="px-5 lg:px-20">
            {children}
        </div>
        <Footer />
    </Fragment>
}

export default Layout