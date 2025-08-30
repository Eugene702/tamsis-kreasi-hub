"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";

// Daftar video playlist
const videos = [
    "/assets/video/landing-page-journey.mp4",
    "/assets/video/landing-page-student-learning.mp4",
];

const VideoPlaylist = () => {
    // index video yang sedang diputar
    const [index, setIndex] = useState(0);
    // penanda player aktif (0 atau 1) untuk cross-fade
    const [active, setActive] = useState<0 | 1>(0);
    // sumber preloaded berikutnya
    const [nextSrc, setNextSrc] = useState(videos[(index + 1) % videos.length]);

    const videoARef = useRef<HTMLVideoElement>(null);
    const videoBRef = useRef<HTMLVideoElement>(null);

    const playActive = useCallback(() => {
        const el = active === 0 ? videoARef.current : videoBRef.current;
        const other = active === 0 ? videoBRef.current : videoARef.current;
        if (el) {
            el.play().catch(() => {});
        }
        if (other) {
            other.pause();
        }
    }, [active]);

    // Mulai putar saat mount & saat berpindah active
    useEffect(() => {
        playActive();
    }, [active, playActive]);

    const handleEnded = () => {
        // siapkan index baru
        const newIndex = (index + 1) % videos.length;
        // toggle player aktif
        setActive((p) => (p === 0 ? 1 : 0));
        setIndex(newIndex);
        // tentukan sumber berikutnya untuk pre-load (setelah state index update)
        const upcoming = videos[(newIndex + 1) % videos.length];
        setNextSrc(upcoming);
        // Mulai play video tidak aktif (yang baru diisi) sedikit ditunda agar DOM update
        requestAnimationFrame(() => {
            const el = (active === 0 ? videoBRef.current : videoARef.current);
            el?.play().catch(() => {});
        });
    };

    // Tentukan src masing-masing player berdasarkan active/index
    const srcA = active === 0 ? videos[index] : nextSrc;
    const srcB = active === 1 ? videos[index] : nextSrc;

    return (
        <section>
            <div className="relative">
                <div className="w-full rounded-xl overflow-hidden relative aspect-video">
                    {/* Video A */}
                    <video
                        key="player-a"
                        ref={videoARef}
                        src={srcA}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${active === 0 ? 'opacity-100' : 'opacity-0'} [backface-visibility:hidden]`}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        onEnded={active === 0 ? handleEnded : undefined}
                    />
                    {/* Video B */}
                    <video
                        key="player-b"
                        ref={videoBRef}
                        src={srcB}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${active === 1 ? 'opacity-100' : 'opacity-0'} [backface-visibility:hidden]`}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        onEnded={active === 1 ? handleEnded : undefined}
                    />
                </div>
                <div className="absolute text-black bg-white/90 backdrop-blur-sm rounded-xl shadow-xl px-4 py-2 z-20 right-2 bottom-3">
                    <p className="text-sm font-medium">SMK Taman Siswa 2 Jakarta</p>
                </div>
            </div>
        </section>
    );
};

export default VideoPlaylist;