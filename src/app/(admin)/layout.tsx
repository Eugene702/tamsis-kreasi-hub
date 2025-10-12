import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

const layout = async ({ children }: { children: ReactNode }) => {
    const session = await auth()
    if (session) {
        if (session.user) {
            if (session.user.role != "ADMIN") {
                return redirect("/")
            }
        }
    }else{
        return redirect("/")
    }

    return <main>
        <div className="container mx-auto px-4">
            {children}
        </div>
    </main>
}

export default layout