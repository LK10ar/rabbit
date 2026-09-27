import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import VideoScrubber from "./components/VideoScrubber";
import SecondVideoScrubber from "./components/SecondVideoScrubber";
import ScrollExitSplitText from "./components/ScrollExitSplitText";
import SoapTiles from "./components/SoapTiles";
import CylindricalTextDrum from "./components/CylindricalTextDrum";
import Marquee from "./components/Marquee";
import { GoogleWordmark, GithubWordmark } from "./components/Logos";

const MAX_PROGRESS = 3.5;

const LOGO_URLS = [
  { name: "Voiceflow", url: "https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/voiceflow-logo-svg-150px.svg" },
  { name: "Zendesk", url: "https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/zendesk-logo-svg-150px.svg" },
  { name: "Pendo", url: "https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/pendo-logo-svg-150px.svg" },
  { name: "Glide", url: "https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/glide-logo-svg-150px.svg" },
  { name: "Canva", url: "https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/canva-logo-svg-150px.svg" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clamp01(v: number) {
  return clamp(v, 0, 1);
}

function updateActiveSection(progress: number): string {
  if (progress < 0.18) return "hero";
  if (progress < 0.45) return "projects";
  if (progress < 0.68) return "expertise";
  if (progress < 1.15) return "about";
  return "contact";
}

function easeInOutCubic(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lerpedScrollProgress, setLerpedScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState("hero");

  const scrollProgressRef = useRef(0);
  const lerpRef = useRef(0);
  const navAnimationRef = useRef<number | null>(null);
  const lastTouchYRef = useRef(0);

  const cancelNavAnimation = () => {
    if (navAnimationRef.current !== null) {
      cancelAnimationFrame(navAnimationRef.current);
      navAnimationRef.current = null;
    }
  };

  const handleNavigateToSection = (scrollRatio: number) => {
    cancelNavAnimation();
    const startVal = scrollProgressRef.current;
    const target = clamp(scrollRatio, 0, MAX_PROGRESS);
    const duration = 1200;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(p);
      const value = startVal + (target - startVal) * eased;

      scrollProgressRef.current = value;
      setScrollProgress(value);
      setActiveSectionId(updateActiveSection(value));

      if (p < 1) {
        navAnimationRef.current = requestAnimationFrame(step);
      } else {
        navAnimationRef.current = null;
      }
    };

    navAnimationRef.current = requestAnimationFrame(step);
  };

  // Gesture controller — runs once on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cancelNavAnimation();
      const next = clamp(scrollProgressRef.current + e.deltaY * 0.0006, 0, MAX_PROGRESS);
      scrollProgressRef.current = next;
      setScrollProgress(next);
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      cancelNavAnimation();
      const currentTouchY = e.touches[0].clientY;
      const deltaTouchY = lastTouchYRef.current - currentTouchY;
      lastTouchYRef.current = currentTouchY;
      const next = clamp(scrollProgressRef.current + deltaTouchY * 0.0015, 0, MAX_PROGRESS);
      scrollProgressRef.current = next;
      setScrollProgress(next);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // rAF smoothing loop for lerpedScrollProgress
  useEffect(() => {
    let rafId: number;

    const tick = () => {
      const target = scrollProgressRef.current;
      let next = lerpRef.current + (target - lerpRef.current) * 0.08;
      if (Math.abs(target - next) < 0.0001) next = target;
      lerpRef.current = next;
      setLerpedScrollProgress(next);
      setActiveSectionId(updateActiveSection(next));
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    return () => cancelNavAnimation();
  }, []);

  void scrollProgress;

  const secondScreenProgress = clamp01((lerpedScrollProgress - 1.15) / 0.5);
  const easedRisingProgress = 1 - Math.pow(1 - secondScreenProgress, 3);
  const smoothBlurAmount = Math.sin((secondScreenProgress * Math.PI) / 2) * 64;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#FF005E] text-white">
      <div className="relative w-full h-full overflow-hidden">
        {/* FIRST SCREEN — gets blurred as second screen rises */}
        <div
          className="absolute inset-0 w-full h-full z-10 transition-transform duration-[100ms] ease-out"
          style={{ filter: secondScreenProgress > 0 ? `blur(${smoothBlurAmount}px)` : "none" }}
        >
          <VideoScrubber scrollProgress={Math.min(1, lerpedScrollProgress)} />

          {/* Hero title strip pinned to bottom */}
          <div className="absolute bottom-[40px] left-[1%] right-[1%] w-[98%] pointer-events-none z-20 select-none flex justify-center items-center">
            <ScrollExitSplitText
              scrollProgress={Math.min(1, lerpedScrollProgress)}
              containerClassName="w-full text-[10.4vw] leading-none font-michroma font-normal uppercase text-white whitespace-nowrap text-center transition-all duration-300 will-change-transform"
              style={{ letterSpacing: "-0.07em" }}
            >
              INNER CIRCLE
            </ScrollExitSplitText>
          </div>

          <SoapTiles scrollProgress={lerpedScrollProgress} />
        </div>

        <Header activeSectionId={activeSectionId} onNavigate={handleNavigateToSection} />

        {/* SECOND SCREEN — rises from below, rounded top */}
        <div
          className="absolute bottom-0 left-0 w-full h-full bg-[#11010a] rounded-t-[48px] overflow-hidden z-40"
          style={{
            transform: `translateY(${(1 - easedRisingProgress) * 100}%)`,
            visibility: secondScreenProgress > 0 ? "visible" : "hidden",
            willChange: "transform",
          }}
        >
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-[5px] bg-white rounded-full z-50 pointer-events-none" />
          <SecondVideoScrubber scrollProgress={lerpedScrollProgress} />
          <CylindricalTextDrum scrollProgress={lerpedScrollProgress} />

          <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 w-full sm:w-[65%] md:w-[60%] pl-6 sm:pl-12 md:pl-20 pr-6 sm:pr-12 md:pr-16 z-50 pointer-events-auto">
            <div className="w-full border-t border-white/[0.08] pt-6">
              <Marquee gap="80px" speed={25} fade>
                <GoogleWordmark size={100} />
                <GithubWordmark size={100} />
                {LOGO_URLS.map((logo) => (
                  <img
                    key={logo.name}
                    src={logo.url}
                    alt={logo.name}
                    className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
