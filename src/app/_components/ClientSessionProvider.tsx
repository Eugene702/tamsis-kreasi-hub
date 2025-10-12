"use client"

import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

const ClientSessionProvider = ({ session, children}: { session: Session | null, children: ReactNode }) => {
    return <SessionProvider session={session}>
        { children }
    </SessionProvider>
}

export default ClientSessionProvider