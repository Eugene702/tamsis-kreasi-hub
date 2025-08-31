import Image from 'next/image';

interface ProjectCoverProps { src: string; title: string; }

export function ProjectCover({ src, title }: ProjectCoverProps) {
  return (
    <div className="mt-10 md:mt-12 relative">
      <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-lg shadow-base-300/30 ring-1 ring-base-300/20 bg-base-200/40">
        <Image src={src} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-base-100/40 via-transparent to-transparent" />
      </div>
    </div>
  );
}
