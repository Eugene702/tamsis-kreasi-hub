"use client"
import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { getCategoryProjects } from '../action'
import { StatusCodes } from 'http-status-codes'
import { UploadApiResponse } from 'cloudinary'

const CardContent = dynamic(() => import('@/components/cardContent'))

interface ProjectItem {
    domain: string
    title: string
    banner: any
    user: {
        name: string
        photo: any
    }
    _count: {
        userProjectViews: number
    }
}

interface Props { 
    categorySlug: string
    initialProjects: ProjectItem[]
    initialHasMore: boolean
}

export const CategoryProjectGrid = ({ categorySlug, initialProjects, initialHasMore }: Props) => {
    const [items, setItems] = useState<ProjectItem[]>(initialProjects)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [loading, setLoading] = useState(false)

    // Reset state ketika categorySlug berubah
    useEffect(() => {
        setItems(initialProjects)
        setHasMore(initialHasMore)
    }, [categorySlug, initialProjects, initialHasMore])

    const loadMore = useCallback(async () => {
        if (loading) return
        setLoading(true)
        
        const response = await getCategoryProjects(categorySlug, items.length, 8)
        
        if (response.status === StatusCodes.OK && response.data) {
            setItems(prev => [...prev, ...response.data!.items])
            setHasMore(response.data.hasMore)
        }
        
        setLoading(false)
    }, [categorySlug, items.length, loading])

    return (
        <div className="mt-14">
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map(project => (
                    <CardContent 
                        key={project.domain}
                        title={project.title}
                        href={`/project/${project.domain}`}
                        banner={project.banner as UploadApiResponse}
                        views={project._count.userProjectViews}
                        user={{
                            name: project.user.name,
                            photo: project.user.photo as UploadApiResponse
                        }}
                    />
                ))}
            </div>
            <div className="mt-12 flex justify-center">
                {hasMore ? (
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="btn btn-outline btn-sm sm:btn-md !rounded-full disabled:opacity-60"
                    >
                        {loading ? 'Memuat...' : 'Load More'}
                    </button>
                ) : items.length > 0 ? (
                    <div className="text-xs text-base-content/50">Semua proyek sudah ditampilkan</div>
                ) : (
                    <div className="text-sm text-base-content/60">Belum ada proyek dalam kategori ini</div>
                )}
            </div>
        </div>
    )
}
