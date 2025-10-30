import Image from 'next/image'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { GetStarStudentsType } from '../action'
import { UploadApiResponse } from 'cloudinary'
import { Major } from '@/lib/values'

const CardContent = dynamic(() => import('@/components/cardContent'))

type StudentStarData = NonNullable<GetStarStudentsType['data']>['students'][0]

const formatNumber = (n: number) => Intl.NumberFormat('id-ID').format(n)

export const StarItem = ({ data }: { data: StudentStarData }) => {
  const jurusanName = Major.find(m => m.key === data.jurusan)?.value || data.jurusan

  return (
    <div className="rounded-3xl bg-base-100/80 backdrop-blur-md ring-1 ring-base-300/40 p-6 md:p-8 flex flex-col gap-6 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex items-start gap-4 flex-1">
          <Link href={`/${data.domain}`} className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden ring-2 ring-base-200 shadow-sm flex-none hover:ring-emerald-500 transition">
            <Image 
              src={(data.photo as UploadApiResponse)?.url || '/assets/images/logo.png'} 
              alt={data.name} 
              fill 
              className="object-cover" 
            />
          </Link>
          <div className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold leading-tight">
              <Link href={`/${data.domain}`} className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-300 transition">
                {data.name}
              </Link>
            </h2>
            <div className="flex flex-wrap gap-3 text-xs md:text-[11px] text-base-content/60">
              <span className="inline-flex items-center gap-1">{jurusanName}</span>
              <span className="inline-flex items-center gap-1">Kelas {data.kelas}</span>
              <span className="inline-flex items-center gap-1">{data.umur} th</span>
              <span className="inline-flex items-center gap-1">{formatNumber(data.totalViews)} views</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 md:flex-col">
          <Link href={`/${data.domain}`} className="px-4 py-2 rounded-full bg-base-200/70 hover:bg-base-200 text-xs md:text-sm transition text-center">
            Detail
          </Link>
          <Link href={`/${data.domain}/bio`} className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-xs md:text-sm text-white transition text-center">
            Hubungi
          </Link>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        {data.userProjects.map((p: StudentStarData['userProjects'][0]) => (
          <CardContent 
            key={p.id}
            title={p.title}
            href={`/project/${p.domain}`}
            banner={p.banner as UploadApiResponse}
            views={p.views}
            user={{
              name: data.name,
              photo: data.photo as UploadApiResponse
            }}
          />
        ))}
      </div>
    </div>
  )
}
