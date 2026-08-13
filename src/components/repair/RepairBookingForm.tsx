// RETRO Qatar — Repair Booking Form

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUIStore } from '@/stores/useUIStore';
import type { Dictionary, Locale } from '@/i18n/dictionaries';

interface RepairBookingFormProps {
  dict: Dictionary;
  locale: Locale;
}

const DEVICE_TYPES = ['Gaming PC', 'Laptop', 'PlayStation', 'Xbox', 'Nintendo', 'Other'];

export function RepairBookingForm({ dict, locale }: RepairBookingFormProps) {
  const isRtl = locale === 'ar';
  const { showToast } = useUIStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deviceType: '',
    deviceModel: '',
    issue: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would save to Supabase here
    // For now, we generate a WhatsApp link
    
    const message = `*New Repair Request* 🛠️
Name: ${formData.name}
Phone: ${formData.phone}
Device: ${formData.deviceType} (${formData.deviceModel})
Issue: ${formData.issue}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/97412345678?text=${encodedMessage}`; // Mock phone number
    
    showToast(isRtl ? 'جاري تحويلك إلى واتساب...' : 'Redirecting to WhatsApp...', 'success');
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      // Reset form after redirect
      setFormData({ name: '', phone: '', deviceType: '', deviceModel: '', issue: '' });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-retro-bg-card border border-retro-border rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-retro-text">{isRtl ? 'حجز موعد صيانة' : 'Book a Repair'}</h3>
        <p className="text-sm text-retro-text-secondary">{isRtl ? 'املأ النموذج أدناه وسيقوم فريقنا بالتواصل معك في أقرب وقت.' : 'Fill out the form below and our team will get back to you shortly.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label={isRtl ? 'الاسم الكامل' : 'Full Name'} 
          required 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <Input 
          label={isRtl ? 'رقم الهاتف (قطر)' : 'Phone Number (Qatar)'} 
          type="tel" 
          placeholder="5555 5555" 
          required 
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-retro-text">{isRtl ? 'نوع الجهاز' : 'Device Type'}</label>
        <div className="flex flex-wrap gap-2">
          {DEVICE_TYPES.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({...formData, deviceType: type})}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                formData.deviceType === type 
                  ? 'border-retro-purple bg-retro-purple/10 text-retro-purple' 
                  : 'border-retro-border text-retro-text-secondary hover:border-retro-purple/50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <Input 
        label={isRtl ? 'موديل الجهاز (اختياري)' : 'Device Model (Optional)'} 
        placeholder={isRtl ? 'مثال: PS5 Slim, RTX 4090' : 'e.g. PS5 Slim, RTX 4090'}
        value={formData.deviceModel}
        onChange={(e) => setFormData({...formData, deviceModel: e.target.value})}
      />

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-retro-text">{isRtl ? 'وصف المشكلة' : 'Describe the Issue'}</label>
        <textarea 
          className="w-full bg-retro-bg-input border border-retro-border rounded-xl px-4 py-3 text-sm text-retro-text placeholder-retro-text-dim focus:outline-none focus:border-retro-purple/50 focus:shadow-[0_0_10px_rgba(168,85,247,0.1)] transition-all min-h-[120px] resize-none"
          placeholder={isRtl ? 'صف المشكلة التي تواجهها بالتفصيل...' : 'Please describe the problem in detail...'}
          required
          value={formData.issue}
          onChange={(e) => setFormData({...formData, issue: e.target.value})}
        />
      </div>

      <Button 
        type="submit" 
        size="lg" 
        fullWidth 
        variant="accent"
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>}
      >
        {isRtl ? 'إرسال الطلب عبر واتساب' : 'Submit via WhatsApp'}
      </Button>
    </form>
  );
}
