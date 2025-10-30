import Image from "next/image"
import Link from "next/link"
import { UploadApiResponse } from "cloudinary"
import { Major } from "@/lib/values"

type AuthorCardProps = {
    userId: string
    userName: string
    userPhoto: UploadApiResponse | null
    studentUser?: {
        major: string
        classLevel: number
    } | null
}

const AuthorCard = ({ userId, userName, userPhoto, studentUser }: AuthorCardProps) => {
    return (
        <div className="border-t border-base-200 pt-16 mb-16">
            <div className="flex flex-col items-center text-center space-y-6">
                <Link href={`/${userId}`} className="w-24 h-24 relative rounded-full overflow-hidden ring-4 ring-base-200">
                    <Image 
                        src={userPhoto?.url || "/assets/images/logo.png"} 
                        alt={userName} 
                        fill 
                        className="object-cover" />
                </Link>
                <div>
                    <Link href={`/${userId}`} className="text-2xl font-bold hover:text-emerald-600 transition block">
                        {userName}
                    </Link>
                    {studentUser && (
                        <p className="text-base-content/60 mt-1">
                            {studentUser.classLevel} { Major.find(e => e.key == studentUser.major)?.value }
                        </p>
                    )}
                </div>
                <Link href={`/${userId}`} className="btn rounded-full">
                    Lihat Profil
                </Link>
            </div>
        </div>
    )
}

export default AuthorCard
