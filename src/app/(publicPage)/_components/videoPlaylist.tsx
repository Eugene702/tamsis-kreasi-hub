"use client"

import React, { useRef, useState } from "react";

const videos = [
    "/assets/video/landing-page-journey.mp4",
    "/assets/video/landing-page-student-learning.mp4",
];

const VideoPlaylist = () => {
    const [current, setCurrent] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleEnded = () => {
        setCurrent((prev) => (prev + 1) % videos.length);
    };

    React.useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play();
        }
    }, [current]);

    return (
        <section>
            <div className="relative">
                <div className="w-full rounded-xl overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="object-cover w-full h-full"
                        onEnded={handleEnded}
                    >
                        <source src={videos[current]} type="video/mp4" />
                    </video>
                </div>
                <div className="absolute text-black bg-white rounded-xl shadow-xl p-3 z-20 right-2 bottom-3">
                    <p>SMK Taman Siswa 2 Jakarta</p>
                </div>
            </div>
        </section>
    );
};

export default VideoPlaylist