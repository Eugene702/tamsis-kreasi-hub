import dynamic from 'next/dynamic';
import Link from 'next/link';

const CardContent = dynamic(() => import('@/components/cardContent'));

export function RelatedProjects() {
  return (
    <section className="mt-24 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Proyek Terkait</h2>
        <Link href="/category/web-development" className="text-sm text-primary hover:underline">Lihat semua</Link>
      </div>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <CardContent key={i} />)}
      </div>
    </section>
  );
}
