// RETRO Qatar — Toast Component

'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/stores/useUIStore';

const icons: Record<string, React.ReactNode> = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

const colorClasses: Record<string, string> = {
  success: 'border-retro-green/30 bg-retro-green/10 text-retro-green',
  error: 'border-retro-red/30 bg-retro-red/10 text-retro-red',
  info: 'border-retro-cyan/30 bg-retro-cyan/10 text-retro-cyan',
};

export function Toast() {
  const { toast, clearToast } = useUIStore();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`
            fixed top-6 left-1/2 z-[100]
            flex items-center gap-3 rounded-xl border px-5 py-3
            backdrop-blur-xl shadow-2xl shadow-black/30
            ${colorClasses[toast.type]}
          `}
        >
          {icons[toast.type]}
          <span className="text-sm font-semibold">{toast.message}</span>
          <button
            onClick={clearToast}
            className="ml-2 text-current opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
