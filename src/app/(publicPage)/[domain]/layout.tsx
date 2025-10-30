import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { Fragment, ReactNode } from "react"
import { getProfile, getProject } from "./action"
import { StatusCodes } from "http-status-codes"
import { redirect } from "next/navigation"
import { UploadApiResponse } from "cloudinary"
import { Major } from "@/lib/values"
import { moment } from "@/lib/moment"
import { Metadata } from "next"
import { useAuth } from "@/lib/auth"

const Tabs = dynamic(() => import('./_components/tabs'))
const PhotoProfile = dynamic(() => import('./_components/photoProfile'))
const SettingsButton = dynamic(() => import('./_components/settingsButton'))
const PasswordModal = dynamic(() => import('./_components/passwordModal'))

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
    const param = await params
    const [profileResponse, projectsResponse] = await Promise.all([
        getProfile(param.domain),
        getProject(param.domain)
    ])

    if (profileResponse.status !== StatusCodes.OK || !profileResponse.data) {
        return {
            title: 'Profil Tidak Ditemukan | Tamsis Kreasi Hub',
            description: 'Profil siswa tidak ditemukan di Tamsis Kreasi Hub.'
        }
    }

    const profile = profileResponse.data
    const projects = projectsResponse.status === StatusCodes.OK ? projectsResponse.data || [] : []
    
    const jurusanName = Major.find(e => e.key === profile.studentUser?.major)?.value || 'Siswa'
    const skillsData = profile.studentUser?.skills || []
    const skills = skillsData.map((s: any) => s.skill.name)
    const projectCount = projects.length
    const totalViews = projects.reduce((sum, p) => sum + (p._count?.userProjectViews || 0), 0)
    
    const skillsText = skills.length > 0 
        ? `Keahlian: ${skills.slice(0, 5).join(', ')}${skills.length > 5 ? ', dan lainnya' : ''}`
        : ''
    
    const projectsText = projectCount > 0
        ? `${projectCount} proyek dengan ${totalViews.toLocaleString('id-ID')} total views`
        : 'Portfolio siswa berbakat'

    const title = `${profile.name} - ${jurusanName} | Tamsis Kreasi Hub`
    const description = `Portfolio ${profile.name}, siswa ${jurusanName} kelas ${profile.studentUser?.classLevel}. ${projectsText}. ${skillsText}. Lihat karya dan hubungi untuk kolaborasi.`

    const photoUrl = profile.photo && typeof profile.photo === 'object' && 'url' in profile.photo
        ? (profile.photo.url as string)
        : 'https://tamsis-kreasi-hub.vercel.app/assets/images/logo.png'

    return {
        title,
        description,
        keywords: [
            profile.name,
            jurusanName,
            'portfolio siswa',
            'karya siswa',
            ...skills.slice(0, 10),
            'proyek siswa',
            'Tamsis Kreasi Hub'
        ],
        openGraph: {
            title,
            description,
            type: 'profile',
            images: [
                {
                    url: photoUrl,
                    width: 800,
                    height: 800,
                    alt: profile.name
                }
            ],
            url: `https://tamsis-kreasi-hub.vercel.app/${param.domain}`
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [photoUrl]
        }
    }
}
const layout = async ({ children, params }: { children: ReactNode, params: Promise<{ domain: string }> }) => {
    const param = await params
    const session = await useAuth()
    const [response, projectsResponse] = await Promise.all([
        getProfile(param.domain),
        getProject(param.domain)
    ])
    
    if(response.status === StatusCodes.NOT_FOUND){
        return redirect("/")
    }

    // Check if current user is the owner
    const isOwner = session?.user?.id === param.domain

    const projects = projectsResponse.status === StatusCodes.OK ? projectsResponse.data || [] : []
    const jurusanName = Major.find(e => e.key === response.data?.studentUser?.major)?.value || 'Siswa'
    const skillsData = response.data?.studentUser?.skills || []
    const skills = skillsData.map((s: any) => s.skill.name)
    const photoUrl = response.data?.photo && typeof response.data.photo === 'object' && 'url' in response.data.photo
        ? (response.data.photo.url as string)
        : 'https://tamsis-kreasi-hub.vercel.app/assets/images/logo.png'

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: response.data?.name,
        image: photoUrl,
        jobTitle: 'Siswa',
        description: response.data?.studentUser?.bio || `Siswa ${jurusanName} kelas ${response.data?.studentUser?.classLevel}`,
        url: `https://tamsis-kreasi-hub.vercel.app/${param.domain}`,
        affiliation: {
            '@type': 'EducationalOrganization',
            name: 'Tamsis Kreasi Hub',
            url: 'https://tamsis-kreasi-hub.vercel.app'
        },
        ...(skills.length > 0 && {
            knowsAbout: skills,
            skills: skills.join(', ')
        }),
        ...(projects.length > 0 && {
            hasCredential: projects.slice(0, 10).map((project: any) => ({
                '@type': 'CreativeWork',
                name: project.title,
                url: `https://tamsis-kreasi-hub.vercel.app/project/${project.domain}`,
                image: typeof project.banner === 'object' && project.banner !== null && 'url' in project.banner
                    ? project.banner.url
                    : undefined,
                interactionStatistic: {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/ViewAction',
                    userInteractionCount: project._count?.userProjectViews || 0
                }
            }))
        })
    }

    return <Fragment>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="pt-10 md:pt-16 space-y-10">
            <nav className="text-[11px] breadcrumbs text-base-content/60" aria-label="Breadcrumb">
                <ul>
                    <li><Link href="/">Beranda</Link></li>
                    <li>Profil</li>
                    <li className="truncate max-w-[12rem] md:max-w-none" aria-current="page">{ response.data?.name }</li>
                </ul>
            </nav>
            <article className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex items-center gap-6 flex-1">
                    <PhotoProfile
                        url={response.data?.photo ? (response.data.photo as UploadApiResponse).url : "/assets/images/logo.png"}
                        name={response.data?.name || "Profile Photo"}
                    />
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">{ response.data?.name }</span>
                            </h1>
                            {isOwner && <SettingsButton />}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs md:text-[11px] text-base-content/60">
                            <span>Jurusan { jurusanName }</span>
                            <span className="w-1 h-1 rounded-full bg-base-content/30" />
                            <span>Kelas { response.data?.studentUser?.classLevel }</span>
                            <span className="w-1 h-1 rounded-full bg-base-content/30" />
                            <span>{ moment().diff(response.data?.studentUser?.birthday, "years") } th</span>
                        </div>
                    </div>
                </div>
            </article>
        </div>
        <div className="mt-14">
            <Tabs domain={param.domain} />
            <div className="py-12">
                { children }
            </div>
        </div>
        
        {isOwner && <PasswordModal />}
    </Fragment>
}

export default layout