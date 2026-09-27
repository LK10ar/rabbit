import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  gap?: string;
  speed?: number;
  fade?: boolean;
}

export default function Marquee({ children, gap = "80px", speed = 25 }: MarqueeProps) {
  return (
    <div className="marquee-container">
      <div
        className="marquee-track"
        style={{ gap, animationDuration: `${speed}s` }}
      >
        <div className="flex items-center" style={{ gap }}>
          {children}
        </div>
        <div className="flex items-center" style={{ gap, marginLeft: gap }} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
