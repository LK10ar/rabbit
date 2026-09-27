import { useMemo } from "react";

interface CylindricalTextDrumProps {
  scrollProgress: number;
}

interface TextSegment {
  text: string;
  highlight: boolean;
}

const RAW_LINES: string[] = [
  "Welcome to the [ultimate convergence]",
  "of [digital rebels], [underground creators],",
  "and [top-tier product builders] who",
  "refuse to follow [guidelines].",
  "This is where [high-end design principles]",
  "meet [pure technical execution],",
  "without the [corporate bureaucracy] and",
  "meaningless [standard aesthetics].",
  "We [gather in the shadows] to build",
  "the [next generation] of [scalable interfaces],",
  "[automated workflows], and [decentralized assets]",
  "that move the [cultural needle forward].",
  "Experience [zero-bullshit networking],",
  "weekly [alpha allocations], and [unreleased]",
  "[toolkits] to shape the [internet's landscape].",
  "",
  "This is [not another social club]",
  "for casual enthusiasts or [template consumers].",
  "This is a [highly selective environment]",
  "engineered for [hyper-productive creators],",
  "[UI/UX visionaries], and [AI prompt architects]",
  "who operate at the [absolute limits]",
  "of [digital product creation].",
  "Our [framework is simple]:",
  "[eliminate intermediate noise],",
  "[automate the execution layer],",
  "and [deploy elite digital products]",
  "while others are still [scheduling meetings].",
  "We loop through [complex design systems],",
  "[break conventional grids], and",
  "[execute fluid interactions] that",
  "[redefine digital environments].",
];

function parseLine(raw: string): TextSegment[] {
  if (raw === "") return [];
  const parts = raw.split(/(\[[^\]]+\])/g).filter((p) => p.length > 0);
  return parts.map((part) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      return { text: part.slice(1, -1), highlight: true };
    }
    return { text: part, highlight: false };
  });
}

const LINES: TextSegment[][] = RAW_LINES.map(parseLine);

const R = 380;
const LINE_HEIGHT = 32;
const DRUM_START = 1.45;
const DRUM_SPAN = 2.05;

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export default function CylindricalTextDrum({ scrollProgress }: CylindricalTextDrumProps) {
  const targetIndex = useMemo(
    () => clamp01((scrollProgress - DRUM_START) / DRUM_SPAN) * (LINES.length - 1),
    [scrollProgress]
  );

  return (
    <div
      className="absolute inset-y-0 left-0 w-full sm:w-[65%] md:w-[60%] z-30 flex flex-col items-start justify-center pointer-events-none select-none text-left pl-6 sm:pl-12 md:pl-20 py-16"
      style={{ perspective: "1000px", perspectiveOrigin: "25% 50%" }}
    >
      <div
        className="relative w-full h-[85vh] flex flex-col justify-center items-start overflow-visible"
        style={{ transformStyle: "preserve-3d" }}
      >
        {LINES.map((segments, idx) => {
          const indexDiff = idx - targetIndex;
          const translateY = indexDiff * LINE_HEIGHT;
          const angleRad = translateY / R;
          const angleDeg = (angleRad * 180) / Math.PI;
          const translateZ = Math.cos(angleRad) * R - R;
          const baseScale = 0.78 + Math.cos(angleRad) * 0.22;
          const opacity = Math.max(0, (Math.cos(angleRad) - 0.2) / 0.8);
          const depthBlur = Math.min(8, Math.max(0, (Math.abs(indexDiff) - 1.5) * 0.75));

          if (segments.length === 0) {
            return (
              <p
                key={idx}
                className="font-manrope text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold leading-[0.90] tracking-tight whitespace-nowrap"
                style={{
                  letterSpacing: "-0.035em",
                  opacity: opacity * 0.3,
                  transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${-angleDeg * 0.8}deg) scale(${baseScale})`,
                  transformOrigin: "left center",
                  filter: depthBlur > 0.1 ? `blur(${depthBlur}px)` : "none",
                }}
              >
                &nbsp;
              </p>
            );
          }

          return (
            <p
              key={idx}
              className="font-manrope text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold leading-[0.90] tracking-tight whitespace-nowrap"
              style={{
                letterSpacing: "-0.035em",
                opacity,
                transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${-angleDeg * 0.8}deg) scale(${baseScale})`,
                transformOrigin: "left center",
                filter: depthBlur > 0.1 ? `blur(${depthBlur}px)` : "none",
              }}
            >
              {segments.map((seg, segIdx) => (
                <span
                  key={segIdx}
                  className={seg.highlight ? "text-white font-bold opacity-100" : "text-white/60"}
                >
                  {seg.text}
                </span>
              ))}
            </p>
          );
        })}
      </div>
    </div>
  );
}
