// RETRO Qatar — Performance Estimate Component

'use client';

import React from 'react';
import { usePCBuilderStore } from '@/stores/usePCBuilderStore';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface PerformanceEstimateProps {
  dict: Dictionary;
  locale: Locale;
}

export function PerformanceEstimate({ dict, locale }: PerformanceEstimateProps) {
  const { selectedParts } = usePCBuilderStore();
  const cpu = selectedParts.cpu;
  const gpu = selectedParts.gpu;
  const ram = selectedParts.ram;

  // Very basic heuristic for visual flair
  let fps = 0;
  let res = '1080p';
  
  if (gpu && cpu) {
    const gpuTier = gpu.nameEn.toLowerCase();
    const cpuTier = cpu.nameEn.toLowerCase();
    
    let baseFps = 60;
    if (gpuTier.includes('4090') || gpuTier.includes('7900 xtx')) { baseFps = 240; res = '4K'; }
    else if (gpuTier.includes('4080') || gpuTier.includes('7900 xt')) { baseFps = 180; res = '4K'; }
    else if (gpuTier.includes('4070') || gpuTier.includes('7800 xt')) { baseFps = 144; res = '1440p'; }
    else if (gpuTier.includes('4060') || gpuTier.includes('7600')) { baseFps = 120; res = '1080p'; }

    fps = baseFps;
  }

  if (!gpu && !cpu) return null;

  return (
    <div className="bg-retro-bg-card border border-retro-border rounded-2xl p-6 mt-6">
      <h3 className="text-sm font-bold text-retro-text mb-4 uppercase tracking-wider flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-retro-purple"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        {locale === 'ar' ? 'الأداء المتوقع' : 'Estimated Performance'}
      </h3>
      
      {gpu && cpu ? (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-retro-text-secondary">Cyberpunk 2077 ({res} High)</span>
              <span className="font-bold text-retro-cyan">~{Math.floor(fps * 0.7)} FPS</span>
            </div>
            <div className="h-1.5 w-full bg-retro-bg-input rounded-full overflow-hidden">
              <div className="h-full bg-retro-cyan rounded-full transition-all" style={{ width: `${Math.min((fps * 0.7) / 240 * 100, 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-retro-text-secondary">Valorant ({res} Competitive)</span>
              <span className="font-bold text-retro-purple">~{fps * 3} FPS</span>
            </div>
            <div className="h-1.5 w-full bg-retro-bg-input rounded-full overflow-hidden">
              <div className="h-full bg-retro-purple rounded-full transition-all" style={{ width: `${Math.min((fps * 3) / 800 * 100, 100)}%` }} />
            </div>
          </div>
          {!ram && (
            <p className="text-[10px] text-retro-text-dim italic mt-2">
              * Add RAM to ensure these estimates are accurate.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-retro-text-dim text-center py-4">
          Select a CPU and Graphics Card to see estimated performance.
        </p>
      )}
    </div>
  );
}
