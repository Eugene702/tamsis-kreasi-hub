import dynamic from "next/dynamic"
import { Fragment, ReactNode } from "react"

const Navbar = dynamic(() => import('../../components/navbar'))
const Footer = dynamic(() => import('../../components/footer'))

const Layout = ({ children }: { children: ReactNode }) => {
    return <Fragment>
        <Navbar />
        <div className="px-5 lg:px-20">
            {children}
        </div>
        <Footer />
    </Fragment>
}

export default Layout