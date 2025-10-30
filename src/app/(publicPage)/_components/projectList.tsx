"use client"

import { useState } from "react"
import { loadMore, GETType } from "../action"
import { StatusCodes } from "http-status-codes"
import dynamic from "next/dynamic"

const CardContent = dynamic(() => import('@/components/cardContent'))

type Props = {
    initialData: NonNullable<GETType['data']>['userProjects']
    hasMore: boolean
}

const ProjectList = ({ initialData, hasMore: initialHasMore }: Props) => {
    const [projects, setProjects] = useState(initialData)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [loading, setLoading] = useState(false)

    const handleLoadMore = async () => {
        setLoading(true)
        const response = await loadMore(projects.length)
        
        if(response.status === StatusCodes.OK && response.data){
            setProjects(prev => [...prev, ...response.data!.userProjects])
            setHasMore(response.data.hasMore)
        }
        
        setLoading(false)
    }

    return <>
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project, index) => <CardContent
                key={index}
                href={`/project/${project.domain}`}
                banner={project.banner as any}
                title={project.title}
                views={project._count.userProjectViews}
                user={{
                    name: project.user.name,
                    photo: project.user.photo as any
                }}
            />)}
        </div>
        
        {hasMore && <div className="mt-12 flex justify-center">
            <button 
                className="btn btn-outline btn-sm sm:btn-md !rounded-full"
                onClick={handleLoadMore}
                disabled={loading}
            >
                {loading && <div className="loading loading-spinner"></div>}
                <span>{loading ? "Loading..." : "Load More"}</span>
            </button>
        </div>}
    </>
}

export default ProjectList
