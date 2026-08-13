// RETRO Qatar — Tabs Component

'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
}

export function Tabs({ tabs, defaultTab, onChange, variant = 'pill', className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  if (variant === 'underline') {
    return (
      <div className={`flex items-center gap-6 border-b border-retro-border ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex items-center gap-2 pb-3 text-sm font-semibold transition-all cursor-pointer
              ${activeTab === tab.id
                ? 'text-retro-cyan border-b-2 border-retro-cyan'
                : 'text-retro-text-muted hover:text-retro-text-secondary'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 p-1 rounded-xl bg-retro-bg-card border border-retro-border ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer
            ${activeTab === tab.id
              ? 'bg-retro-cyan/10 text-retro-cyan border border-retro-cyan/20'
              : 'text-retro-text-muted hover:text-retro-text-secondary hover:bg-white/5'
            }
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
