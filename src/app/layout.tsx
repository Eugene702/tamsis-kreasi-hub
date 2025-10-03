import type { Metadata } from "next";
import NextTopLoader from 'nextjs-toploader'
import "./globals.css";
import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";

const SessionProvider = dynamic(() => import('./_components/ClientSessionProvider'))
export const metadata: Metadata = {
  title: {
    default: "Tamsis Kreasi Hub",
    template: "%s | Tamsis Kreasi Hub",
  },
  description: "Tamsis Kreasi Hub adalah galeri digital resmi untuk portofolio dan karya terbaik siswa SMK Taman Siswa 2 Jakarta. Jelajahi kreativitas dan bakat siswa kami.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <html lang="en" data-theme="lofi">
      <body className="font-sans antialiased">
        <SessionProvider session={session}>
          <NextTopLoader color="#047857" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
