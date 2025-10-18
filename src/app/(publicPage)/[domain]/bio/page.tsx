import { Major } from "@/lib/values";
import { GET } from "./action";
import moment from "moment-timezone";
import dynamic from "next/dynamic";

interface ProfileData {
    name: string;
    avatar: string;
    location?: string;
    jurusan: string;
    kelas: string;
    umur: number;
    bio: string;
    skills: string[];
    projects: number;
    totalViews: number;
    topProjects: number;
}

const mock: ProfileData = {
    name: 'Eugene Feilian Putra Rangga',
    avatar: '/temp.png',
    location: 'Jakarta, Indonesia',
    jurusan: 'RPL',
    kelas: 'XI',
    umur: 17,
    bio: 'Siswa yang fokus pada pengembangan web modern, eksplorasi UI minimalis, dan performa aplikasi front-end. Suka kolaborasi & berbagi pengetahuan.',
    skills: ['Next.js', 'TypeScript', 'TailwindCSS', 'UI Design', 'REST API'],
    projects: 18,
    totalViews: 12500,
    topProjects: 5,
};

const SkillModal = dynamic(() => import('./_components/skillModal'))
const AddSkillButton = dynamic(() => import('./_components/addSkillButton'))

const page = async ({ params }: { params: Promise<{ domain: string }> }) => {
    const param = await params
    const response = await GET(param.domain)

    const formatNumber = (n: number) => Intl.NumberFormat('id-ID').format(n);

    return <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Tentang</h2>
                <p className="text-sm leading-relaxed text-base-content/70 whitespace-pre-line">{response.data?.profile?.studentUser?.bio ?? "Belum ada bio"}</p>
            </section>
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Keahlian</h2>
                <div className="flex flex-wrap gap-2">
                    {
                        response.data?.profile?.studentUser?.skills.map((e, index) => <span className="badge" key={index}>{ e.skill.name }</span>)
                    }
                    <AddSkillButton />
                </div>
            </section>
        </div>
        <aside className="space-y-6">
            <div className="p-5 rounded-2xl bg-base-100/70 ring-1 ring-base-300/40 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Ringkasan</h3>
                <ul className="space-y-2 text-sm">
                    <li className="flex justify-between"><span className="text-base-content/50">Total Proyek</span><span>{ response.data?.projectTotal }</span></li>
                    <li className="flex justify-between"><span className="text-base-content/50">Total Views</span><span>{formatNumber(response.data?.viewTotal ?? 0)}</span></li>
                    <li className="flex justify-between"><span className="text-base-content/50">Jurusan</span><span>{ Major.find(a => a.key === response.data?.profile?.studentUser?.major)?.value }</span></li>
                    <li className="flex justify-between"><span className="text-base-content/50">Kelas</span><span>{ response.data?.profile?.studentUser?.classLevel }</span></li>
                    <li className="flex justify-between"><span className="text-base-content/50">Umur</span><span>{ moment().diff(moment(response.data?.profile?.studentUser?.birthday), 'years') } th</span></li>
                </ul>
            </div>
        </aside>

        <SkillModal />
    </div>
}

export default page