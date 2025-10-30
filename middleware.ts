import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Middleware berhasil, user sudah login
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true jika user sudah login (memiliki token)
        return !!token
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
)

// Konfigurasi matcher untuk path yang perlu dicek
export const config = {
  matcher: [
    '/project/create',
    '/project/:path*/edit',
  ]
}
