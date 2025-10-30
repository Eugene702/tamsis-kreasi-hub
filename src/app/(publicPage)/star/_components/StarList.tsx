"use client"

import { useState, useEffect } from 'react'
import { StarFilters } from './StarFilters'
import { StarItem } from './StarItem'
import { GetStarStudentsType, loadMoreStarStudents } from '../action'
import { StatusCodes } from 'http-status-codes'
import { useSearchParams } from 'next/navigation'

type Props = {
    initialData: NonNullable<GetStarStudentsType['data']>['students']
    hasMore: boolean
    availableAges: number[]
}

export const StarList = ({ initialData, hasMore: initialHasMore, availableAges }: Props) => {
    const searchParams = useSearchParams()
    const [students, setStudents] = useState(initialData)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setStudents(initialData)
        setHasMore(initialHasMore)
    }, [initialData, initialHasMore])

    const handleLoadMore = async () => {
        setLoading(true)

        const filters = {
            query: searchParams.get('query') || undefined,
            jurusan: searchParams.get('jurusan') || undefined,
            kelas: searchParams.get('kelas') || undefined,
            umur: searchParams.get('umur') || undefined
        }

        const response = await loadMoreStarStudents(students.length, filters)

        if (response.status === StatusCodes.OK && response.data) {
            setStudents(prev => [...prev, ...response.data!.students])
            setHasMore(response.data.hasMore)
        }

        setLoading(false)
    }

    return (
        <div className="space-y-10">
            <StarFilters availableAges={availableAges} />
            
            <div className="space-y-10">
                {students.map(stu => <StarItem key={stu.id} data={stu} />)}
                {students.length === 0 && (
                    <div className="text-center py-20 text-base-content/50 text-sm">
                        Tidak ada hasil yang cocok.
                    </div>
                )}
            </div>

            {hasMore && students.length > 0 && (
                <div className="flex justify-center pt-6">
                    <button
                        className="btn btn-outline btn-sm sm:btn-md !rounded-full"
                        onClick={handleLoadMore}
                        disabled={loading}
                    >
                        {loading && <div className="loading loading-spinner"></div>}
                        <span>{loading ? "Loading..." : "Load More"}</span>
                    </button>
                </div>
            )}
        </div>
    )
}
