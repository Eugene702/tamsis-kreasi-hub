"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

const ClientSessionProvider = ({ session, children }: { session: Session | null, children: ReactNode }) => {
    const queryClient = new QueryClient()
    return <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </SessionProvider>
}

export default ClientSessionProvider