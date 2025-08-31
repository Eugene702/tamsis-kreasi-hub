"use client";
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface ProjectGalleryProps {
  title: string;
  gallery: string[];
}

export function ProjectGallery({ title, gallery }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(() => {
    setLightboxIndex(idx => (idx === null ? null : (idx - 1 + gallery.length) % gallery.length));
  }, [gallery.length]);
  const showNext = useCallback(() => {
    setLightboxIndex(idx => (idx === null ? null : (idx + 1) % gallery.length));
  }, [gallery.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold">Galeri</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        {gallery.map((g, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-video rounded-xl overflow-hidden bg-base-200/60 ring-1 ring-base-300/20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label={`Perbesar gambar ${i + 1}`}
          >
            <Image src={g} alt={`${title} ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform" />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <span className="absolute bottom-2 right-2 text-[10px] px-2 py-1 rounded-full bg-black/40 text-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition">Zoom</span>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Preview Gambar"
        >
          <div className="absolute inset-0" onClick={closeLightbox} />
          <div className="relative max-w-5xl w-full">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src={gallery[lightboxIndex]}
                alt={`Preview ${lightboxIndex + 1}`}
                fill
                className="object-contain bg-base-200"
                priority
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                className="btn btn-circle btn-sm md:btn-md bg-black/40 border-none hover:bg-black/60 text-white"
                aria-label="Sebelumnya"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                className="btn btn-circle btn-sm md:btn-md bg-black/40 border-none hover:bg-black/60 text-white"
                aria-label="Berikutnya"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-10 right-0 btn btn-circle btn-sm bg-white/90 hover:bg-white text-base-content shadow"
              aria-label="Tutup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" /></svg>
            </button>
            <div className="mt-4 text-center text-xs text-white/70 select-none">
              {lightboxIndex + 1} / {gallery.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
