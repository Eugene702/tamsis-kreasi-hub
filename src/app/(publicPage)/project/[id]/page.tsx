import { Fragment } from "react"
import dynamic from "next/dynamic"
import { headers } from "next/headers"
import { Metadata } from "next"
import { findOne, findRelated, findByUser, incrementView } from "./action"
import { StatusCodes } from "http-status-codes"
import { UploadApiResponse } from "cloudinary"
import Image from "next/image"
import { useAuth } from "@/lib/auth"

const Error = dynamic(() => import('@/components/error'))
const ProjectHeader = dynamic(() => import('./_components/ProjectHeader'))
const ProjectContent = dynamic(() => import('./_components/ProjectContent'))
const ProjectMeta = dynamic(() => import('./_components/ProjectMeta'))
const AuthorCard = dynamic(() => import('./_components/AuthorCard'))
const ProjectCard = dynamic(() => import('./_components/ProjectCard'))
const ProjectCardWithAuthor = dynamic(() => import('./_components/ProjectCardWithAuthor'))
const RelatedSection = dynamic(() => import('./_components/RelatedSection'))

const extractDescription = (content: any): string => {
    if (!content?.blocks) return ''
    
    const textBlocks = content.blocks
        .filter((b: any) => b.type === 'paragraph' || b.type === 'header')
        .map((b: any) => b.data?.text?.replace(/<[^>]*>/g, '') || '')
        .join(' ')
    
    return textBlocks.slice(0, 160).trim() || 'Lihat portfolio dan karya kreatif terbaik'
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const response = await findOne(id)
    
    if(response.status !== StatusCodes.OK || !response.data) {
        return {
            title: 'Proyek Tidak Ditemukan',
            description: 'Proyek yang Anda cari tidak ditemukan atau tidak tersedia.'
        }
    }
    
    const project = response.data
    const banner = project.banner as UploadApiResponse
    const description = extractDescription(project.content)
    const keywords = project.categories.map(c => c.categories.name).join(', ')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tamsis-kreasi-hub.vercel.app'
    const url = `${baseUrl}/project/${id}`
    
    return {
        title: `${project.title} | ${project.user.name} - Portfolio Karya Kreatif`,
        description,
        keywords: [
            keywords,
            'portfolio',
            'karya kreatif',
            'student project',
            project.user.name,
            project.user.studentUser?.major || '',
        ].filter(Boolean).join(', '),
        authors: [{ name: project.user.name }],
        creator: project.user.name,
        publisher: 'TAMSIS Kreasi Hub',
        openGraph: {
            title: project.title,
            description,
            url,
            siteName: 'TAMSIS Kreasi Hub',
            images: [
                {
                    url: banner?.secure_url || banner?.url || '/assets/images/logo.png',
                    width: 1200,
                    height: 800,
                    alt: project.title,
                }
            ],
            locale: 'id_ID',
            type: 'article',
            publishedTime: project.createdAt.toISOString(),
            authors: [project.user.name],
            tags: project.categories.map(c => c.categories.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description,
            creator: `@${project.user.name.replace(/\s/g, '')}`,
            images: [banner?.secure_url || banner?.url || '/assets/images/logo.png'],
        },
        alternates: {
            canonical: url,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        other: {
            'article:published_time': project.createdAt.toISOString(),
            'article:author': project.user.name,
            'article:section': keywords,
        }
    }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const response = await findOne(id)

    if(response.status !== StatusCodes.OK || !response.data){
        return <Error message={response.message} />
    }

    const session = await useAuth()
    const project = response.data
    const content = project.content as any
    const banner = project.banner as UploadApiResponse
    const userPhoto = project.user.photo as UploadApiResponse | null
    const categoryIds = project.categories.map(c => c.categoryId)
    const isOwner = session?.user?.id === project.user.id
    
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
               headersList.get('x-real-ip') || 
               'unknown'
    
    await incrementView(id, ip)
    
    const [relatedResponse, userProjectsResponse] = await Promise.all([
        findRelated(id, categoryIds),
        findByUser(project.user.id, id)
    ])

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tamsis-kreasi-hub.vercel.app'
    
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        headline: project.title,
        description: extractDescription(content),
        image: banner?.secure_url || banner?.url,
        datePublished: project.createdAt.toISOString(),
        dateModified: project.updatedAt.toISOString(),
        author: {
            '@type': 'Person',
            name: project.user.name,
            image: (userPhoto?.secure_url || userPhoto?.url),
            jobTitle: project.user.studentUser ? `${project.user.studentUser.classLevel} ${project.user.studentUser.major}` : undefined,
        },
        publisher: {
            '@type': 'Organization',
            name: 'TAMSIS Kreasi Hub',
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/assets/images/logo.png`,
            }
        },
        keywords: project.categories.map(c => c.categories.name).join(', '),
        interactionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/ViewAction',
            userInteractionCount: project._count.userProjectViews,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/project/${id}`,
        }
    }

    return <Fragment>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
            <ProjectHeader 
                userId={project.user.id}
                userName={project.user.name}
                userPhoto={userPhoto}
                studentUser={project.user.studentUser}
                isOwner={isOwner}
                projectDomain={id}
            />

            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">{project.title}</h1>

            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg mb-12">
                <Image 
                    src={banner?.url || "/assets/images/logo.png"} 
                    alt={project.title} 
                    width={1200}
                    height={800}
                    className="w-full h-auto" 
                    priority />
            </div>

            {/* Konten proyek (text + gambar sesuai urutan yang dibuat) */}
            <div className="mb-16">
                <ProjectContent 
                    blocks={content.blocks || []} 
                    projectTitle={project.title}
                />
            </div>

            <ProjectMeta 
                categories={project.categories}
                viewsCount={project._count.userProjectViews}
                createdAt={project.createdAt}
            />

            <AuthorCard 
                userId={project.user.id}
                userName={project.user.name}
                userPhoto={userPhoto}
                studentUser={project.user.studentUser}
            />

            {relatedResponse.data.length > 0 && (
                <RelatedSection 
                    title={`Karya Lainnya dari ${project.user.name}`}
                    viewAllHref={`/${project.user.id}`}
                >
                    {relatedResponse.data.map((p, i) => (
                        <ProjectCard 
                            key={i}
                            domain={p.domain}
                            title={p.title}
                            banner={p.banner as UploadApiResponse}
                            viewsCount={p._count.userProjectViews}
                        />
                    ))}
                </RelatedSection>
            )}

            {userProjectsResponse.data.length > 0 && (
                <div className="mt-16">
                    <RelatedSection 
                        title="Proyek Serupa"
                        viewAllHref="/project"
                    >
                        {userProjectsResponse.data.map((p, i) => (
                            <ProjectCardWithAuthor 
                                key={i}
                                domain={p.domain}
                                title={p.title}
                                banner={p.banner as UploadApiResponse}
                                viewsCount={p._count.userProjectViews}
                                user={{
                                    name: p.user.name,
                                    photo: p.user.photo as UploadApiResponse | null
                                }}
                            />
                        ))}
                    </RelatedSection>
                </div>
            )}
        </div>
    </Fragment>
}

export default Page