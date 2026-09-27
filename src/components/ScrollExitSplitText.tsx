import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";

interface ScrollExitSplitTextProps {
  scrollProgress: number;
  containerClassName?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export default function ScrollExitSplitText({
  scrollProgress,
  containerClassName,
  style,
  children,
}: ScrollExitSplitTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const text = typeof children === "string" ? children : "";
  const words = text.split(" ");

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = Array.from(container.querySelectorAll<HTMLSpanElement>(".char"));

    const tl = gsap.timeline({ paused: true });
    tl.fromTo(
      chars,
      { opacity: 1, yPercent: 0, y: 0, scaleY: 1, scaleX: 1, transformOrigin: "50% 0%" },
      {
        opacity: 0,
        yPercent: 300,
        y: "25vh",
        scaleY: 1.2,
        scaleX: 0.9,
        stagger: 0.03,
        ease: "power2.inOut",
      }
    );
    timelineRef.current = tl;

    return () => {
      tl.kill();
      timelineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words.join("|")]);

  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    gsap.to(tl, {
      progress: scrollProgress,
      duration: 0.6,
      ease: "power1.out",
      overwrite: "auto",
    });
  }, [scrollProgress]);

  return (
    <div ref={containerRef} className={containerClassName} style={style}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block">
          {word.split("").map((char, charIdx) => (
            <span key={charIdx} className="char inline-block will-change-transform">
              {char}
            </span>
          ))}
          {wordIdx < words.length - 1 && (
            <span
              className="char inline-block will-change-transform"
              dangerouslySetInnerHTML={{ __html: "&nbsp;" }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
