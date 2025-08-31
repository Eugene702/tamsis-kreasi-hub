"use client";
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CardContent = dynamic(() => import('@/components/cardContent'));

interface ProjectItem { id: string; }
interface PageResult { items: ProjectItem[]; nextCursor: string | null; }

// Simulated fetch cursor (replace with real API call)
async function fetchProjects(cursor: string | null, category: string): Promise<PageResult> {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 400));
  const batchSize = 8; // 8 items per page (so grid fills nicely)
  const start = cursor ? parseInt(cursor, 10) : 0;
  const items: ProjectItem[] = Array.from({ length: batchSize }).map((_, i) => ({ id: `${category}-${start + i}` }));
  const nextCursor = start + batchSize >= 40 ? null : String(start + batchSize); // stop after 40 mock items
  return { items, nextCursor };
}

interface Props { categorySlug: string; }

export function CategoryProjectGrid({ categorySlug }: Props) {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const load = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const res = await fetchProjects(cursor, categorySlug);
    setItems(prev => [...prev, ...res.items]);
    setNextCursor(res.nextCursor);
    setCursor(res.nextCursor);
    setLoading(false);
    setInitialLoaded(true);
  }, [cursor, categorySlug, loading]);

  useEffect(() => { load(); /* initial */ }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mt-14">
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map(p => (
          <CardContent key={p.id} />
        ))}
        {/* Skeletons while first load */}
        {!initialLoaded && Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-4">
            <div className="h-80 w-full rounded-xl bg-base-200/70" />
            <div className="h-4 w-2/3 rounded bg-base-200/70" />
            <div className="h-3 w-1/3 rounded bg-base-200/60" />
          </div>
        ))}
      </div>
      {initialLoaded && (
        <div className="mt-12 flex justify-center">
          {nextCursor ? (
            <button
              onClick={load}
              disabled={loading}
              className="btn btn-outline btn-sm sm:btn-md !rounded-full disabled:opacity-60"
            >
              {loading ? 'Memuat...' : 'Load More'}
            </button>
          ) : (
            <div className="text-xs text-base-content/50">Semua proyek sudah ditampilkan</div>
          )}
        </div>
      )}
    </div>
  );
}
