// RETRO Qatar — Vector-Based Dynamic Logo Component
// Renders either the general "Toys Trading & Repair" brand or the "PC Department" brand

'use client';

import React from 'react';
import { useUIStore } from '@/stores/useUIStore';

interface LogoProps {
  forcePC?: boolean;
}

export function Logo({ forcePC = false }: LogoProps) {
  const activeDepartment = useUIStore((s) => s.activeDepartment);
  const locale = useUIStore((s) => s.locale);
  const isRtl = locale === 'ar';

  const showPCLogo = forcePC || activeDepartment === 'pc';

  if (showPCLogo) {
    // 🖥️ RETRO PC FOR COMPUTERS BRANDING
    return (
      <div className="flex items-center gap-3 select-none">
        {/* Glow PC Case SVG */}
        <div className="relative shrink-0 flex items-center justify-center h-10 w-10">
          <div className="absolute inset-0 bg-retro-cyan/15 blur-md rounded-full animate-pulse" />
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
          >
            {/* Outer Case */}
            <rect x="5" y="3" width="14" height="18" rx="2" />
            {/* Front Panel Grid */}
            <line x1="19" y1="6" x2="19" y2="18" />
            {/* Glowing Dual Fans inside Case */}
            <circle cx="12" cy="8" r="2.5" className="stroke-retro-cyan animate-pulse" />
            <circle cx="12" cy="15" r="2.5" className="stroke-retro-cyan animate-pulse" />
            {/* Feet */}
            <line x1="8" y1="21" x2="9" y2="21" />
            <line x1="15" y1="21" x2="16" y2="21" />
          </svg>
        </div>

        {/* Text Logo */}
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white tracking-wider font-mono">
              RETRO
            </span>
            <span className="text-[10px] font-black bg-retro-cyan text-retro-bg px-1 rounded animate-pulse">
              PC
            </span>
          </div>
          <span className="text-[8px] font-bold text-retro-cyan tracking-widest uppercase mt-0.5">
            {isRtl ? 'ريترو بي سي للكمبيوتر' : 'PC FOR COMPUTERS'}
          </span>
        </div>
      </div>
    );
  }

  // 🎮 RETRO GENERAL TOYS TRADING & REPAIR BRANDING
  return (
    <div className="flex flex-col leading-none select-none">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-retro-pink via-[#9f54fb] to-retro-cyan bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(159,84,251,0.25)]">
          RETRO
        </span>
      </div>
      <span className="text-[7.5px] sm:text-[8px] font-black bg-gradient-to-r from-retro-pink to-retro-cyan bg-clip-text text-transparent tracking-wide mt-1">
        {isRtl ? 'لتجارة الألعاب الإلكترونية والصيانة' : 'For Toys Trading and Repair'}
      </span>
    </div>
  );
}
