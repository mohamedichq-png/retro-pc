// RETRO Qatar — Announcement Bar

'use client';

import React from 'react';
import type { Dictionary } from '@/i18n/dictionaries';

interface AnnouncementBarProps {
  dict: Dictionary;
  locale: string;
}

export function AnnouncementBar({ dict, locale }: AnnouncementBarProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-retro-cyan-dim/40 via-retro-bg-secondary to-retro-purple-dim/40 border-b border-retro-border">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-center py-2">
          <p className="text-[11px] sm:text-xs font-semibold text-retro-text-secondary tracking-wide text-center">
            {dict.announcement.text}
          </p>
        </div>
      </div>
    </div>
  );
}
