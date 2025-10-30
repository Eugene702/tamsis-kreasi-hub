import Link from "next/link"
import { ReactNode } from "react"

type RelatedSectionProps = {
    title: string
    viewAllHref: string
    viewAllText?: string
    children: ReactNode
}

const RelatedSection = ({ title, viewAllHref, viewAllText = "Lihat semua", children }: RelatedSectionProps) => {
    return (
        <div className="border-t border-base-200 pt-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">{title}</h2>
                <Link href={viewAllHref} className="text-sm text-base-content/60 hover:text-emerald-600 transition">
                    {viewAllText}
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {children}
            </div>
        </div>
    )
}

export default RelatedSection
