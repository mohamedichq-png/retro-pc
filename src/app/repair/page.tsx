"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RepairIcon } from '../../components/Icons';
import { motion } from 'framer-motion';

export default function RepairCenter() {
  const { language, t, isRtl } = useApp();

  // Booking Form States
  const [deviceType, setDeviceType] = useState('Gaming PC');
  const [deviceBrand, setDeviceBrand] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Normal' | 'High' | 'Urgent'>('Normal');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceType, setServiceType] = useState('Cleaning');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  const handleBookRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !problemDescription) return;

    let message = "";
    if (language === 'ar') {
      message += `🛠️ طلب صيانة جديد من موقع ريترو (RETRO)\n`;
      message += `-------------------------------------\n`;
      message += `👤 اسم العميل: ${clientName}\n`;
      message += `📞 رقم الهاتف: ${clientPhone}\n`;
      message += `💻 نوع الجهاز: ${deviceType}\n`;
      message += `🏷️ الشركة المصنعة: ${deviceBrand || 'غير محدد'}\n`;
      message += `📦 الموديل: ${deviceModel || 'غير محدد'}\n`;
      message += `🔢 الرقم التسلسلي: ${serialNumber || 'غير محدد'}\n`;
      message += `🔧 الخدمة المطلوبة: ${serviceType}\n`;
      message += `📅 موعد الحجز: ${appointmentDate || 'غير محدد'}\n\n`;
      message += `📝 تفاصيل العطل:\n${problemDescription}`;
    } else {
      message += `🛠️ New Repair Booking from RETRO Web\n`;
      message += `-------------------------------------\n`;
      message += `👤 Name: ${clientName}\n`;
      message += `📞 Phone: ${clientPhone}\n`;
      message += `💻 Device: ${deviceType}\n`;
      message += `🏷️ Brand: ${deviceBrand || 'N/A'}\n`;
      message += `📦 Model: ${deviceModel || 'N/A'}\n`;
      message += `🔢 Serial: ${serialNumber || 'N/A'}\n`;
      message += `🔧 Service: ${serviceType}\n`;
      message += `📅 Appointment: ${appointmentDate || 'Not specified'}\n\n`;
      message += `📝 Issue Description:\n${problemDescription}`;
    }

    const whatsappUrl = `https://wa.me/97431473585?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;

    // Reset Form
    setDeviceBrand('');
    setDeviceModel('');
    setSerialNumber('');
    setProblemDescription('');
    setClientName('');
    setClientPhone('');
    setAppointmentDate('');
    setUploadedPhoto(null);
  };

  return (
    <div className="flex-1 bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 max-w-xl mx-auto">
      
      {/* Centered: Repair Booking Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-purple-500/20 neon-glass rounded-2xl p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-500/10 p-2">
            <RepairIcon size={24} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-wide uppercase">
              {t('repairBooking')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {t('repairTitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleBookRepair} className="space-y-4">
          
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">{isRtl ? 'الاسم الكامل' : 'Your Name'}</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={isRtl ? "عبدالله الكواري" : "Abdullah Al-Kuwari"}
                className="w-full rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">{isRtl ? 'رقم الهاتف القطري' : 'Phone Number'}</label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="e.g. 55663344"
                className="w-full rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Device Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">{isRtl ? 'نوع الجهاز' : 'Device Type'}</label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="w-full rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
              >
                <option value="Gaming PC">{isRtl ? "كمبيوتر ألعاب مكتبي" : "Gaming PC Desktop"}</option>
                <option value="Laptop">{isRtl ? "كمبيوتر محمول / لابتوب" : "Laptop"}</option>
                <option value="PlayStation">PlayStation 5 / 4</option>
                <option value="Xbox">Xbox Series X / S</option>
                <option value="Nintendo">Nintendo Switch</option>
                <option value="Controller">{isRtl ? "يد تحكم" : "Controller"}</option>
                <option value="Retro Console">{isRtl ? "جهاز ألعاب كلاسيكي" : "Retro Console"}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">{isRtl ? 'الشركة المصنعة' : 'Brand'}</label>
              <input
                type="text"
                value={deviceBrand}
                onChange={(e) => setDeviceBrand(e.target.value)}
                placeholder="e.g. Sony, ASUS, Custom"
                className="w-full rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">{isRtl ? 'الموديل' : 'Model'}</label>
              <input
                type="text"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                placeholder="e.g. PS5 Slim, ROG Zephyrus"
                className="w-full rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">{isRtl ? 'الرقم التسلسلي (إن وجد)' : 'Serial Number (Optional)'}</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. SN-8293749"
                className="w-full rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Service Selection & Appointment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">{isRtl ? 'الخدمة المطلوبة' : 'Requested Service'}</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
              >
                <option value="Cleaning">{isRtl ? "تنظيف داخلي (100 ر.ق)" : "Internal Cleaning (100 QAR)"}</option>
                <option value="Thermal Paste">{isRtl ? "تغيير معجون حراري (150 ر.ق)" : "Thermal Paste Replacement (150 QAR)"}</option>
                <option value="Virus Removal">{isRtl ? "إزالة الفيروسات (120 ر.ق)" : "Virus Removal (120 QAR)"}</option>
                <option value="OS/Software Installation">{isRtl ? "تثبيت نظام تشغيل / برامج (150 ر.ق)" : "OS / Software Installation (150 QAR)"}</option>
                <option value="Data Recovery">{isRtl ? "استعادة البيانات (300 ر.ق)" : "Data Recovery (300 QAR)"}</option>
                <option value="Hardware Upgrades">{isRtl ? "ترقية قطع الهاردوير (200 ر.ق)" : "Hardware Upgrade (200 QAR)"}</option>
                <option value="Diagnosis">{isRtl ? "فحص وتشخيص عام (150 ر.ق)" : "General Diagnosis (150 QAR)"}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">{isRtl ? 'وقت الموعد المفضل' : 'Preferred Appointment'}</label>
              <input
                type="datetime-local"
                required
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Image Upload simulation */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400">{isRtl ? 'إرفاق صور للجهاز (اختياري)' : 'Upload Device Photos (Optional)'}</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUploadedPhoto('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=200')}
                className={`flex-1 border-2 border-dashed py-4 rounded-xl text-xs font-medium transition-all ${
                  uploadedPhoto 
                    ? 'border-green-500 bg-green-500/5 text-green-400' 
                    : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-purple-500/40 hover:text-slate-300'
                }`}
              >
                {uploadedPhoto 
                  ? (isRtl ? '✅ تم رفع الصورة بنجاح!' : '✅ Photo uploaded successfully!') 
                  : (isRtl ? '📷 اضغط هنا لرفع صور للجهاز' : '📷 Click to simulate uploading device photo')}
              </button>
              {uploadedPhoto && (
                <button 
                  type="button" 
                  onClick={() => setUploadedPhoto(null)} 
                  className="rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-500 text-xs px-3 font-bold hover:bg-pink-500/20"
                >
                  {isRtl ? 'حذف' : 'Delete'}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400">{isRtl ? 'وصف المشكلة بالتفصيل' : 'Problem Description'}</label>
            <textarea
              required
              rows={3}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder={isRtl ? "اكتب العطل بالتفصيل هنا... (مثال: الجهاز يرتفع حرارته وينطفئ فجأة بعد ربع ساعة)" : "Describe the overheating, blue screen, physical damage, etc."}
              className="w-full rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400">{isRtl ? 'مستوى الأولوية' : 'Priority Level'}</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
            >
              <option value="Low">{isRtl ? "منخفضة" : "Low"}</option>
              <option value="Normal">{isRtl ? "عادية" : "Normal"}</option>
              <option value="High">{isRtl ? "مرتفعة (إصلاح سريع)" : "High (Fast Track)"}</option>
              <option value="Urgent">{isRtl ? "عاجل جداً" : "Urgent"}</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-xs font-bold text-white shadow-lg cursor-pointer hover:scale-[1.01] transition-transform"
            >
              {isRtl ? 'حجز الصيانة عبر الواتساب 💬' : 'Book Repair via WhatsApp 💬'}
            </button>
          </div>

        </form>
      </motion.div>

    </div>
  );
}
