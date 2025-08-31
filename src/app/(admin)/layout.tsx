import { ReactNode } from "react"

const layout = ({ children }: { children: ReactNode }) => {
    return <main>
        <div className="container mx-auto px-4">
            {children}
        </div>
    </main>
}

export default layout