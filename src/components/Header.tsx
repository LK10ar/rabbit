import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { NAVIGATION_ITEMS } from "../data";

interface HeaderProps {
  activeSectionId: string;
  onNavigate: (scrollRatio: number) => void;
}

export default function Header({ activeSectionId, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (ratio: number) => {
    onNavigate(ratio);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="absolute top-4 left-4 right-4 sm:top-8 sm:left-8 sm:right-8 md:top-[64px] md:left-[64px] md:right-[64px] flex items-center justify-between z-40">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNav(0)}
        >
          <Logo />
          <div className="hidden sm:flex flex-col font-manrope font-normal tracking-wide text-[12px] leading-[16px] text-white">
            <span>Full Workflow Automation.</span>
            <span>We Manage Everything. You</span>
            <span>Unwind.</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.scrollRatio)}
              className="font-manrope font-medium text-[12px] leading-[16px] tracking-wider text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#11010a]/98 backdrop-blur-xl z-30 flex flex-col justify-center">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.scrollRatio)}
              className={`font-michroma text-[16px] uppercase tracking-widest py-4 px-6 border-b border-white/5 text-left ${
                activeSectionId === item.id ? "text-[#FF005E] font-semibold" : "text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
