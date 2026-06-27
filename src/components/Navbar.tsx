import React from "react";
import { Sparkles, Compass } from "lucide-react";

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  return (
    <header className="w-full py-5 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between z-40 relative border-b border-white/5">
      
      {/* Brand Logo (Concentric aperture circle to perfectly match the original) */}
      <div className="flex items-center gap-2.5 group cursor-pointer">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-md transition-transform group-hover:rotate-12 duration-500">
          <Compass size={18} strokeWidth={2.2} />
          <div className="absolute inset-0.5 rounded-lg border border-white/20" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
          Aura
        </span>
      </div>

      {/* Nav links (Clean desktop list, styled beautifully) */}
      <nav className="hidden lg:flex items-center gap-7 bg-white/5 border border-white/10 shadow-sm rounded-full px-7 py-2.5 text-xs font-semibold text-white/50">
        <a href="#home" className="text-white hover:text-indigo-300 transition-colors">Home</a>
        <a href="#about" className="hover:text-white transition-colors">About us</a>
        <a href="#platform" className="hover:text-white transition-colors">Platform</a>
        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        <a href="#resources" className="hover:text-white transition-colors">Resources</a>
        <a href="#web3" className="hover:text-white transition-colors font-mono tracking-wider text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-indigo-300">Web3.0</a>
      </nav>

      {/* Login CTA (Fidelity frosted-glass pill shape to match the original layout) */}
      <div>
        <button
          onClick={onLoginClick}
          className="bg-white text-black font-semibold px-6 py-2.5 rounded-full text-xs transition-all shadow-sm hover:bg-white/90 tracking-wide cursor-pointer"
        >
          Login
        </button>
      </div>

    </header>
  );
}
