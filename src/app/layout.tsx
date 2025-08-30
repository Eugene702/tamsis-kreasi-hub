import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tamsis Kreasi Hub",
  description: "Tamsis Kreasi Hub adalah galeri digital resmi untuk portofolio dan karya terbaik siswa SMK Taman Siswa 2 Jakarta. Jelajahi kreativitas dan bakat siswa kami.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="lofi">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
