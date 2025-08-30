import dynamic from "next/dynamic"
import Link from "next/link"
import { Fragment } from "react"

const VideoPlaylist = dynamic(() => import('./_components/videoPlaylist'))
const CardContent = dynamic(() => import('@/components/cardContent'))

const Page = () => {
  return <Fragment>
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-40 xl:gap-60 items-center py-10">
      <section className="space-y-6">
        <div className="space-y-5 max-w-xl">
          <h1 className="font-bold text-4xl sm:text-5xl leading-tight">
            Inilah Talenta Unggulan Kami
          </h1>
          <h2 className="text-base sm:text-lg text-base-content/80 leading-relaxed">
            Jelajahi portofolio dan proyek yang dibuat oleh para siswa berprestasi dari SMK Taman Siswa 2 Jakarta.
          </h2>
        </div>
        <form className="pt-2">
          <div className="join w-full input input-xl text-sm !rounded-full items-center px-2 pr-3 gap-1 bg-base-100/90">
            <input
              type="text"
              className="join-item w-full bg-transparent focus:outline-none"
              placeholder="Kreativitas apa yang ingin Anda temukan hari ini?"
              aria-label="Cari kreativitas"
            />
            <button className="btn bg-emerald-700 hover:bg-emerald-600 btn-circle !rounded-full min-h-10 h-10 w-10" aria-label="Cari">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-white w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </form>
      </section>
      <div className="hidden lg:block">
        <VideoPlaylist />
      </div>
    </div>

    <section className="mt-4">
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="flex items-center gap-3 sm:gap-4 w-max">
          {Array.from({ length: 10 }).map((_, i) => (
            <Link
              href="/category/web-development"
              key={i}
              className="btn btn-xs sm:btn-sm btn-outline !rounded-full whitespace-nowrap hover:btn-primary hover:text-primary-content transition"
            >
              Web Development
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="mt-10">
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <CardContent key={i} />)}
      </div>
      <div className="mt-12 flex justify-center">
        <button className="btn btn-outline btn-sm sm:btn-md !rounded-full">Load More</button>
      </div>
    </section>
  </Fragment>
}

export default Page