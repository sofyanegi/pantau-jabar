import { AlertTriangle } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/fantasy/index.css';

interface VideoPlayerProps {
  hlsSrc: string;
}

export const CCTVVideo: FC<VideoPlayerProps> = ({ hlsSrc }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isWide, setIsWide] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.4 });
    observerRef.current.observe(videoRef.current);

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    if (!isVisible) {
      playerRef.current?.dispose();
      playerRef.current = null;
      setHasError(false);
      return;
    }

    if (playerRef.current) return;

    const originalLogError = videojs.log.error;
    videojs.log.error = () => {};

    videoRef.current.innerHTML = '';

    const videoElement = document.createElement('video-js') as HTMLVideoElement;
    videoElement.classList.add('vjs-big-play-centered', 'w-full', 'h-full', 'object-contain');

    videoElement.addEventListener('loadedmetadata', () => {
      setIsWide(videoElement.videoWidth / videoElement.videoHeight >= 16 / 9);
    });

    videoRef.current.appendChild(videoElement);

    playerRef.current = videojs(videoElement, {
      preload: 'auto',
      autoplay: 'play',
      muted: true,
      playsinline: true,
      controls: true,
      fluid: false,
      responsive: true,
      liveui: true,
      html5: {
        vhs: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          experimentalBufferBasedABR: true,
          bandwidth: { default: 500000 },
          bufferWatermark: { low: 5, high: 10 },
        },
      },
      sources: [{ src: hlsSrc, type: hlsSrc.endsWith('.mp4') ? 'video/mp4' : 'application/x-mpegURL' }],
    });

    playerRef.current.on('error', () => {
      setHasError(true);
      playerRef.current?.addClass('vjs-hidden');
    });

    return () => {
      playerRef.current?.dispose();
      playerRef.current = null;
      videojs.log.error = originalLogError;
    };
  }, [hlsSrc, isVisible]);

  return (
    <div data-vjs-player ref={videoRef} className={`relative w-full ${isWide ? 'aspect-video' : 'h-full'}`}>
      {hasError && isVisible && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white text-lg font-semibold gap-2">
          <div className="absolute inset-0 bg-[url('/noise.webp')] opacity-30 mix-blend-overlay" />
          <AlertTriangle size={48} className="text-red-800 animate-pulse" />
          <span className="animate-pulse">Failed to load CCTV stream</span>
        </div>
      )}
    </div>
  );
};
