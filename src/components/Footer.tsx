"use client";

import React from 'react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { t, isRtl } = useApp();

  return (
    <footer className="w-full border-t border-purple-500/10 bg-slate-950 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Col */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
              RETRO
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {isRtl 
              ? "ريترو لبيع وصيانة الألعاب الإلكترونية ومستلزماتها وأجهزة الكومبيوتر المخصصة للألعاب بالدوحة، قطر."
              : "Retro for toys trading, custom gaming PCs, retro consoles and professional repair in Doha, Qatar."}
          </p>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            {isRtl ? "أوقات العمل" : "Operating Hours"}
          </h4>
          <ul className="text-sm space-y-2">
            <li>
              <span className="font-semibold text-slate-300">{isRtl ? "السبت - الخميس:" : "Saturday - Thursday:"}</span>
              <br />
              9:00 AM - 1:00 PM
              <br />
              4:00 PM - 10:00 PM
            </li>
            <li className="text-pink-500 font-semibold">
              {isRtl ? "الجمعة: مغلق" : "Friday: OFF"}
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            {isRtl ? "اتصل بنا" : "Contact Us"}
          </h4>
          <ul className="text-sm space-y-2">
            <li>
              <span className="font-semibold text-slate-300">{isRtl ? "الهاتف الثابت:" : "Phone:"}</span>{" "}
              <a href="tel:40001133" className="hover:text-cyan-400 transition">4000 1133</a>
            </li>
            <li>
              <span className="font-semibold text-slate-300">{isRtl ? "واتساب المبيعات:" : "Sales WhatsApp:"}</span>{" "}
              <a href="https://wa.me/97466223445" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">6622 3445</a>
            </li>
            <li>
              <span className="font-semibold text-slate-300">{isRtl ? "واتساب الصيانة:" : "Repair WhatsApp:"}</span>{" "}
              <a href="https://wa.me/97431473585" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">3147 3585</a>
            </li>
          </ul>
        </div>

        {/* Location maps */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            {isRtl ? "موقعنا" : "Our Location"}
          </h4>
          <p className="text-sm leading-relaxed">
            {isRtl 
              ? "قطر - الدوحة - مشيرب"
              : "Qatar - Doha - Msheireb HQ"}
          </p>
          <a 
            href="https://maps.app.goo.gl/x76S1zh9Hq8Q84VA9" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-pink-500 hover:text-pink-400 transition-all border border-pink-500/20 hover:border-pink-500/40 bg-pink-500/5 hover:bg-pink-500/10 px-3 py-1.5 rounded-lg"
          >
            {isRtl ? "عرض على خرائط Google" : "View on Google Maps"}
          </a>
        </div>

      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 RETRO Qatar. All Rights Reserved.</p>
        <p className="mt-2 md:mt-0">{isRtl ? "صنع بكل فخر بالدوحة" : "Proudly built for RETRO Doha"}</p>
      </div>
    </footer>
  );
}
