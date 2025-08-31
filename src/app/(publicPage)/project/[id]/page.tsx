import { Fragment } from "react";
import { ProjectHeader } from "./_components/ProjectHeader";
import { ProjectCover } from "./_components/ProjectCover";
import { ProjectInfoSidebar } from "./_components/ProjectInfoSidebar";
import { RelatedProjects } from "./_components/RelatedProjects";
import { ProjectGallery } from "./_components/ProjectGallery";

// TODO: Integrasikan data nyata via fetch / server component.
const mockProject = {
    title: "Website Portfolio Siswa - Creative Showcase",
    category: "Web Development",
    cover: "/temp.png",
    author: {
        name: "Suwir",
        avatar: "/temp.png",
        role: "Siswa XI RPL",
    },
    stats: {
        views: 1250,
        created: "2025-08-10",
        updated: "2025-08-20",
    },
    tags: ["Next.js", "TailwindCSS", "UI Design", "Responsive"],
    description: `Project ini menampilkan portofolio interaktif untuk memamerkan karya siswa dengan desain modern yang fokus pada tipografi, visual preview, dan performa.`,
    content: `Fitur utama:\n- Landing dengan highlight interaktif\n- Komponen kartu modular\n- Responsif & aksesibel\n- Optimasi gambar Next.js\n\nStack & Pendekatan:\nStruktur dirancang modular dengan fokus ke reusability, readability, & minim style berlebihan.`,
    gallery: ["/temp.png", "/temp.png", "/temp.png"],
};

const Page = () => {
    const p = mockProject; // placeholder; replace with real fetch in future
    return (
        <Fragment>
            <ProjectHeader title={p.title} category={p.category} author={p.author} stats={p.stats} />
            <ProjectCover src={p.cover} title={p.title} />
            <div className="mt-8 flex flex-wrap gap-3 text-xs md:text-[13px]">
                <span className="px-4 py-2 rounded-full bg-base-100/70 backdrop-blur-sm shadow-sm">Updated {p.stats.updated}</span>
                <button className="px-4 py-2 rounded-full bg-base-200/70 hover:bg-base-200 transition shadow-sm">Bagikan</button>
            </div>
            <div className="mt-14 grid lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-14">
                    <section className="space-y-5">
                        <h2 className="text-xl font-semibold">Deskripsi</h2>
                        <p className="leading-relaxed text-base-content/80 whitespace-pre-line text-[15px]">{p.description}</p>
                    </section>
                    <section className="space-y-5">
                        <h2 className="text-xl font-semibold">Detail Proyek</h2>
                        <div className="space-y-4 text-base-content/80 text-[15px]">
                            {p.content.split("\n\n").map((block, i) => (
                                <p key={i} className="whitespace-pre-line">{block}</p>
                            ))}
                        </div>
                    </section>
                    <ProjectGallery title={p.title} gallery={p.gallery} />
                </div>
                <ProjectInfoSidebar category={p.category} created={p.stats.created} updated={p.stats.updated} views={p.stats.views} tags={p.tags} />
            </div>
            <RelatedProjects />
        </Fragment>
    );
};

export default Page;