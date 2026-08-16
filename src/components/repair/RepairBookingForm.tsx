// RETRO Qatar — Repair Booking Form

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUIStore } from '@/stores/useUIStore';
import type { Dictionary, Locale } from '@/i18n/dictionaries';
import { BUSINESS_INFO } from '@/lib/constants';

interface RepairBookingFormProps {
  dict: Dictionary;
  locale: Locale;
}

const DEVICE_TYPES = ['Gaming PC', 'Laptop', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Retro Console', 'Controller', 'Other'];
const PROBLEM_TYPES = ['HDMI Port Replacement', 'Deep Cleaning & Thermal Repasting', 'Power / No Boot Issue', 'Overheating / Fan Noise', 'GPU / Component Repair', 'Retro Recapping & Tuning', 'Software / OS Reinstall', 'Other'];

export function RepairBookingForm({ dict, locale }: RepairBookingFormProps) {
  const isRtl = locale === 'ar';
  const { showToast } = useUIStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deviceType: 'Gaming PC',
    deviceModel: '',
    problemType: 'Deep Cleaning & Thermal Repasting',
    issue: '',
    pickupRequested: false,
    zone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `*طلب صيانة جديد — RETRO Qatar* 🛠️
👤 الاسم: ${formData.name}
📱 الهاتف: ${formData.phone}
💻 نوع الجهاز: ${formData.deviceType} (${formData.deviceModel || 'غير محدد'})
🔧 نوع المشكلة: ${formData.problemType}
📝 الوصف: ${formData.issue}
🚚 طلب استلام وتوصيل من المنزل: ${formData.pickupRequested ? `نعم (المنطقة: ${formData.zone})` : 'لا (تسليم في الفرع)'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${BUSINESS_INFO.repairWhatsApp}?text=${encodedMessage}`;
    
    showToast(isRtl ? 'جاري تحويلك إلى واتساب لتأكيد طلب الصيانة...' : 'Redirecting to WhatsApp for repair confirmation...', 'success');
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setFormData({ name: '', phone: '', deviceType: 'Gaming PC', deviceModel: '', problemType: 'Deep Cleaning & Thermal Repasting', issue: '', pickupRequested: false, zone: '' });
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-retro-bg-card border border-retro-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-retro-text">{dict.repair?.bookRepair || (isRtl ? 'احجز موعد صيانة' : 'Book a Repair Service')}</h3>
        <p className="text-xs text-retro-text-secondary">{dict.repair?.costDisclaimer || (isRtl ? 'املأ النموذج وسيقوم فني الصيانة بالتواصل الفوري معك.' : 'Fill out the form and our technician will contact you immediately.')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label={dict.checkout?.fullName || (isRtl ? 'الاسم الكامل' : 'Full Name')} 
          required 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <Input 
          label={dict.checkout?.phone || (isRtl ? 'رقم الهاتف القطري' : 'Qatar Phone Number')} 
          type="tel" 
          placeholder="5555 5555" 
          required 
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      {/* Device Type */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-retro-text">{dict.repair?.deviceType || (isRtl ? 'نوع الجهاز' : 'Device Type')}</label>
        <div className="flex flex-wrap gap-2">
          {DEVICE_TYPES.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({...formData, deviceType: type})}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                formData.deviceType === type 
                  ? 'border-retro-purple bg-retro-purple/15 text-retro-purple shadow-sm' 
                  : 'border-retro-border text-retro-text-secondary hover:border-retro-purple/50 bg-retro-bg-input'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <Input 
        label={dict.repair?.deviceModel || (isRtl ? 'الموديل أو الإصدار' : 'Device Model / Edition (e.g. PS5 Slim, RTX 4080)')} 
        value={formData.deviceModel}
        onChange={(e) => setFormData({...formData, deviceModel: e.target.value})}
      />

      {/* Problem Category */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-retro-text">{dict.repair?.problemType || (isRtl ? 'نوع المشكلة أو الخدمة المطلوبة' : 'Issue Category')}</label>
        <div className="flex flex-wrap gap-2">
          {PROBLEM_TYPES.map(pType => (
            <button
              key={pType}
              type="button"
              onClick={() => setFormData({...formData, problemType: pType})}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                formData.problemType === pType 
                  ? 'border-retro-cyan bg-retro-cyan/15 text-retro-cyan shadow-sm' 
                  : 'border-retro-border text-retro-text-secondary hover:border-retro-cyan/40 bg-retro-bg-input'
              }`}
            >
              {pType}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Description */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-retro-text">{dict.repair?.problemDesc || (isRtl ? 'وصف المشكلة بالتفصيل' : 'Problem Description')}</label>
        <textarea
          rows={3}
          required
          value={formData.issue}
          onChange={(e) => setFormData({...formData, issue: e.target.value})}
        />
      </div>

      {/* Home Pickup Checkbox Option */}
      <div className="p-4 rounded-2xl border border-retro-cyan/30 bg-retro-cyan/5 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.pickupRequested}
            onChange={(e) => setFormData({...formData, pickupRequested: e.target.checked})}
            className="w-4 h-4 rounded text-retro-cyan bg-retro-bg-input border-retro-border"
          />
          <span className="text-xs font-bold text-retro-text">
            {dict.repair?.pickupRequest || (isRtl ? 'طلب خدمة استلام الجهاز وتوصيله من باب المنزل في قطر 🚚' : 'Request Home Pickup & Delivery Service in Qatar 🚚')}
          </span>
        </label>

        {formData.pickupRequested && (
          <Input 
            label={dict.checkout?.zone || (isRtl ? 'المنطقة أو الحي في قطر' : 'Qatar Zone / Area')} 
            placeholder={isRtl ? 'مثال: الوعب، الدفنة، لوسيل، الريان...' : 'e.g. Al Waab, Lusail, West Bay...'} 
            value={formData.zone}
            onChange={(e) => setFormData({...formData, zone: e.target.value})}
          />
        )}
      </div>

      <Button 
        type="submit" 
        size="lg" 
        fullWidth 
        variant="accent"
        className="font-black text-xs py-3.5 shadow-lg shadow-retro-purple/20"
      >
        {dict.repair?.submitTicket || (isRtl ? 'إرسال طلب الصيانة وتأكيد الموعد عبر واتساب' : 'Submit Repair Request to WhatsApp')}
      </Button>
    </form>
  );
}
