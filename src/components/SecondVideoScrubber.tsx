import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const VIDEO_URL =
  "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/2026060218225-v_kcy5rl.mp4";
const FALLBACK_DURATION = 4.2;
const DRUM_START = 1.45;
const DRUM_END = 3.5;

interface SecondVideoScrubberProps {
  scrollProgress: number;
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export default function SecondVideoScrubber({ scrollProgress }: SecondVideoScrubberProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(FALLBACK_DURATION);
  const scrollProgressRef = useRef(scrollProgress);
  const rafRef = useRef<number | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      if (video.duration && !Number.isNaN(video.duration) && Number.isFinite(video.duration)) {
        durationRef.current = video.duration;
      }
      setIsLoaded(true);
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("canplay", handleLoaded);

    const tick = () => {
      const duration = durationRef.current;
      const drumProgress = clamp01((scrollProgressRef.current - DRUM_START) / (DRUM_END - DRUM_START));
      const target = drumProgress * duration;
      currentTimeRef.current += (target - currentTimeRef.current) * 0.15;

      if (!video.seeking && Math.abs(video.currentTime - currentTimeRef.current) > 0.01) {
        video.currentTime = currentTimeRef.current;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("canplay", handleLoaded);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const mx = e.clientX / window.innerWidth - 0.5;
      const my = e.clientY / window.innerHeight - 0.5;
      gsap.to(container, {
        x: -mx * 40,
        y: -my * 40,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 w-full h-full will-change-transform" style={{ scale: "1.05" }}>
        <video
          ref={videoRef}
          src={VIDEO_URL}
          playsInline
          muted
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#11010af4]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-pink-500/20 animate-ping" />
              <span className="w-10 h-10 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin" />
            </div>
            <span
              className="font-manrope font-semibold text-[12px] uppercase tracking-[0.25em] text-pink-500"
              style={{ filter: "drop-shadow(0 0 8px rgba(234,31,99,0.4))" }}
            >
              LOADING DRUM STREAM...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
