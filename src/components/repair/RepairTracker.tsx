// RETRO Qatar — Repair Tracker Component

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface RepairTrackerProps {
  dict: Dictionary;
  locale: Locale;
}

type RepairStatus = 'received' | 'diagnosing' | 'waiting_parts' | 'repairing' | 'ready';

interface TrackingData {
  id: string;
  device: string;
  status: RepairStatus;
  date: string;
}

const STATUS_STEPS: { id: RepairStatus; labelEn: string; labelAr: string; icon: React.ReactNode }[] = [
  { id: 'received', labelEn: 'Received', labelAr: 'تم الاستلام', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
  { id: 'diagnosing', labelEn: 'Diagnosing', labelAr: 'جاري الفحص', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { id: 'waiting_parts', labelEn: 'Waiting for Parts', labelAr: 'بانتظار القطع', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { id: 'repairing', labelEn: 'Repairing', labelAr: 'جاري الإصلاح', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
  { id: 'ready', labelEn: 'Ready for Pickup', labelAr: 'جاهز للاستلام', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
];

export function RepairTracker({ dict, locale }: RepairTrackerProps) {
  const isRtl = locale === 'ar';
  const [ticketId, setTicketId] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) return;

    setIsLoading(true);
    setError('');

    // Mock API Call
    setTimeout(() => {
      if (ticketId.toLowerCase().startsWith('rt-')) {
        setTrackingData({
          id: ticketId.toUpperCase(),
          device: 'PlayStation 5',
          status: 'repairing', // Mocking a specific status
          date: new Date().toLocaleDateString(),
        });
      } else {
        setError(isRtl ? 'رقم التذكرة غير صحيح. جرب "RT-1234"' : 'Invalid Ticket ID. Try "RT-1234"');
        setTrackingData(null);
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="bg-retro-bg-card border border-retro-cyan/20 rounded-2xl p-6 sm:p-8 overflow-hidden relative">
      {/* Bg glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-retro-cyan/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative">
        <div className="space-y-2 mb-6">
          <h3 className="text-xl font-black text-retro-text flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-retro-cyan"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/></svg>
            {isRtl ? 'تتبع حالة جهازك' : 'Track Your Repair'}
          </h3>
          <p className="text-sm text-retro-text-secondary">{isRtl ? 'أدخل رقم التذكرة الخاص بك لمعرفة حالة جهازك مباشرة.' : 'Enter your ticket ID to see the live status of your repair.'}</p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-3 mb-8">
          <div className="flex-1">
            <Input 
              placeholder="e.g. RT-1234" 
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="shrink-0 mt-6">
            {isLoading ? (isRtl ? 'جاري البحث...' : 'Searching...') : (isRtl ? 'تتبع' : 'Track')}
          </Button>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-retro-red/10 border border-retro-red/20 text-retro-red text-sm font-semibold mb-6">
            {error}
          </div>
        )}

        {trackingData && (
          <div className="border border-retro-border rounded-xl p-6 bg-retro-bg-input">
            <div className="flex justify-between items-start mb-8 pb-4 border-b border-retro-border">
              <div>
                <div className="text-xs font-bold text-retro-text-dim uppercase tracking-wider mb-1">Ticket ID</div>
                <div className="text-lg font-black text-retro-cyan">{trackingData.id}</div>
              </div>
              <div className="text-end">
                <div className="text-xs font-bold text-retro-text-dim uppercase tracking-wider mb-1">Device</div>
                <div className="text-sm font-semibold text-retro-text">{trackingData.device}</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-retro-border hidden sm:block" />
              
              <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-2">
                {STATUS_STEPS.map((step, index) => {
                  const currentIdx = STATUS_STEPS.findIndex(s => s.id === trackingData.status);
                  const isPast = index < currentIdx;
                  const isActive = index === currentIdx;
                  const isFuture = index > currentIdx;

                  return (
                    <div key={step.id} className="relative z-10 flex sm:flex-col items-center gap-4 sm:gap-2 text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                        isPast ? 'bg-retro-cyan border-retro-cyan text-retro-bg' :
                        isActive ? 'bg-retro-bg border-retro-cyan text-retro-cyan shadow-[0_0_15px_rgba(34,211,238,0.5)]' :
                        'bg-retro-bg-card border-retro-border text-retro-text-dim'
                      }`}>
                        {isPast ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : step.icon}
                      </div>
                      <div className="text-start sm:text-center">
                        <div className={`text-xs font-bold ${isActive ? 'text-retro-text' : (isPast ? 'text-retro-text-secondary' : 'text-retro-text-dim')}`}>
                          {isRtl ? step.labelAr : step.labelEn}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
