import dynamic from "next/dynamic"
import Link from "next/link"
import { Fragment } from "react"
import { GET } from "./action"
import { StatusCodes } from "http-status-codes"

const VideoPlaylist = dynamic(() => import('./_components/videoPlaylist'))
const ProjectList = dynamic(() => import('./_components/projectList'))
const SearchForm = dynamic(() => import('./_components/SearchForm'))
const Error = dynamic(() => import('@/components/error'))

const page = async () => {
  const response = await GET()
  if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
    return <Error message={response.message} />
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tamsis-kreasi-hub.vercel.app'

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Portofolio Siswa SMK Taman Siswa 2 Jakarta",
    "description": "Galeri karya dan proyek terbaik dari siswa SMK Taman Siswa 2 Jakarta",
    "url": baseUrl,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": response.data!.userProjects.length,
      "itemListElement": response.data!.userProjects.slice(0, 10).map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "name": project.title,
          "url": `${baseUrl}/project/${project.domain}`,
          "author": {
            "@type": "Person",
            "name": project.user.name
          },
          "image": project.banner ? (project.banner as any).url : `${baseUrl}/assets/images/logo.png`,
          "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/ViewAction",
            "userInteractionCount": project._count.userProjectViews
          }
        }
      }))
    }
  }

  return <Fragment>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />

    <div className="grid lg:grid-cols-2 gap-12 lg:gap-40 xl:gap-60 items-center py-10">
      <section className="space-y-6">
        <div className="space-y-5 max-w-xl">
          <h1 className="font-bold text-4xl sm:text-5xl leading-tight">
            Inilah Talenta Unggulan Kami
          </h1>
          <p className="text-base sm:text-lg text-base-content/80 leading-relaxed">
            Jelajahi portofolio dan proyek yang dibuat oleh para siswa berprestasi dari SMK Taman Siswa 2 Jakarta.
          </p>
        </div>
        <SearchForm />
      </section>
      <div className="hidden lg:block">
        <VideoPlaylist />
      </div>
    </div>

    <section className="mt-4">
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="flex items-center gap-3 sm:gap-4 w-max">
          {
            response.data!.categories.map((e, index) => <Link
              href={`/category/${e.slug}`}
              key={index}
              className="btn btn-xs sm:btn-sm btn-outline !rounded-full whitespace-nowrap hover:btn-primary hover:text-primary-content transition">
              {e.name}
            </Link>)
          }
        </div>
      </div>
    </section>

    <section className="mt-10">
      <ProjectList 
        initialData={response.data!.userProjects} 
        hasMore={response.data!.hasMore} 
      />
    </section>
  </Fragment>
}

export default page