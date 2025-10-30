"use client"
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getArtworks } from '../action'
import { StatusCodes } from 'http-status-codes'
import { UploadApiResponse } from 'cloudinary'

const CardContent = dynamic(() => import('@/components/cardContent'))

interface ArtworkItem {
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
    initialArtworks: ArtworkItem[]
    initialHasMore: boolean
    search: string
}

export const ArtworkGrid = ({ initialArtworks, initialHasMore, search }: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [items, setItems] = useState<ArtworkItem[]>(initialArtworks)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState(search)

    // Reset state ketika search berubah
    useEffect(() => {
        setItems(initialArtworks)
        setHasMore(initialHasMore)
        setSearchValue(search)
    }, [search, initialArtworks, initialHasMore])

    const loadMore = useCallback(async () => {
        if (loading) return
        setLoading(true)
        
        const response = await getArtworks(search, items.length, 12)
        
        if (response.status === StatusCodes.OK && response.data) {
            setItems(prev => [...prev, ...response.data!.items])
            setHasMore(response.data.hasMore)
        }
        
        setLoading(false)
    }, [search, items.length, loading])

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())
        
        if (searchValue) {
            params.set('search', searchValue)
        } else {
            params.delete('search')
        }
        
        router.push(`/artwork?${params.toString()}`)
    }

    return (
        <>
            {/* Search Section */}
            <div className="mb-10">
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Cari karya berdasarkan judul..."
                            className="input input-bordered w-full"
                        />
                        <button type="submit" className="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Cari
                        </button>
                    </div>
                </form>
            </div>

            {/* Grid Section */}
            <div className="mt-14">
                <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map(artwork => (
                        <CardContent 
                            key={artwork.domain}
                            title={artwork.title}
                            href={`/project/${artwork.domain}`}
                            banner={artwork.banner as UploadApiResponse}
                            views={artwork._count.userProjectViews}
                            user={{
                                name: artwork.user.name,
                                photo: artwork.user.photo as UploadApiResponse
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
                        <div className="text-xs text-base-content/50">Semua karya sudah ditampilkan</div>
                    ) : (
                        <div className="text-sm text-base-content/60">
                            {search ? `Tidak ada karya ditemukan untuk "${search}"` : 'Belum ada karya'}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
