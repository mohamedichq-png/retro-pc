// RETRO Qatar — Certified Retro Inspection Standards & Quality Assurance
// Detailed transparent guide for collectors & gamers

import React from 'react';
import Link from 'next/link';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { BUSINESS_INFO } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return {
    title: isAr 
      ? 'معايير فحص وضمان أجهزة Retro الكلاسيكية | ريترو قطر'
      : 'Certified Retro Inspection Standards & Quality Guarantee | RETRO Qatar',
    description: isAr
      ? 'تعرف على معايير الفحص التقني الشامل، التنظيف بالموجات فوق الصوتية، وتجديد المكثفات وضمان أجهزة وألعاب الريترو في ريترو قطر.'
      : 'Discover our certified inspection process, ultrasonic cleaning, capacitor recapping, condition grading, and warranty for retro gear.',
    alternates: {
      canonical: `/${locale}/retro-inspection-standards`,
      languages: {
        'ar': '/ar/retro-inspection-standards',
        'en': '/en/retro-inspection-standards',
        'x-default': '/ar/retro-inspection-standards',
      },
    },
  };
}

export default async function RetroInspectionStandardsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const isAr = locale === 'ar';

  const GRADES = [
    {
      grade: 'Grade A+ (Collector Grade)',
      gradeAr: 'الفئة A+ (درجة المقتنين النادرة)',
      color: 'text-amber-400 border-amber-400/30 bg-amber-500/10',
      descAr: 'الجهاز أو الشريط في حالة ممتازة شبه جديدة (Mint)، يشمل الصندوق الأصلي والكتيبات، بدون أي خدوش ظاهرة.',
      descEn: 'Pristine mint collector condition. Includes original matching box, manuals, and zero noticeable cosmetic wear.',
    },
    {
      grade: 'Grade A (Excellent Tested)',
      gradeAr: 'الفئة A (ممتاز مفحوص 100%)',
      color: 'text-retro-cyan border-retro-cyan/30 bg-retro-cyan/10',
      descAr: 'حالة ممتازة مع علامات استخدام خفيفة جداً تكاد لا تُذكر. تم تنظيف وفحص جميع الأزرار والمنافذ وعدسة الليزر.',
      descEn: 'Excellent condition with minimal minor signs of use. Laser lens, buttons, and power circuitry 100% operational.',
    },
    {
      grade: 'Grade B (Great Value Player)',
      gradeAr: 'الفئة B (حالة جيدة جداً لعشاق اللعب)',
      color: 'text-purple-400 border-purple-400/30 bg-purple-500/10',
      descAr: 'آثار استخدام طبيعية على الهيكل الخارجي، تم اختباره وتشغيله بالكامل مع استبدال الأجزاء الاستهلاكية إذا لزم.',
      descEn: 'Normal cosmetic wear on outer shell. Fully tested, cleaned, and perfectly operational for daily retro gaming.',
    },
  ];

  const INSPECTION_STEPS = [
    {
      step: '01',
      titleAr: 'التفكيك والفحص البصري الدقيق',
      titleEn: 'Disassembly & Visual Circuit Inspection',
      descAr: 'فتح الجهاز بواسطة فنيين متخصصين لفحص لوحة الأم بحثاً عن أي تلف أو أكسدة أو تسريب لمكثفات الطاقة.',
      descEn: 'Complete teardown by senior technicians to check the motherboard for oxidation, solder cracks, or battery leaks.',
    },
    {
      step: '02',
      titleAr: 'التنظيف بالموجات فوق الصوتية (Ultrasonic Cleaning)',
      titleEn: 'Ultrasonic Deep Cleaning',
      descAr: 'غسيل البوردات والأزرار بمحاليل إلكترونية خاصة داخل أحواض الموجات فوق الصوتية لإزالة الأتربة المتراكمة لعقود.',
      descEn: 'Motherboards and buttons undergo ultrasonic bath cleaning with specialized electronic solutions to remove decades of grime.',
    },
    {
      step: '03',
      titleAr: 'تجديد المكثفات والصوت والصورة (Recapping & Tuning)',
      titleEn: 'Recapping & Video/Audio Tuning',
      descAr: 'استبدال المكثفات القديمة بمكثفات يابانية عالية الجودة لضمان صفاء الصورة والصوت وعمر تشغيلي يدوم طويلاً.',
      descEn: 'Replacing aged capacitors with high-grade Japanese capacitors to ensure sharp video output, clear audio, and longevity.',
    },
    {
      step: '04',
      titleAr: 'اختبار الجهد ودرجة الحرارة لـ 60 دقيقة',
      titleEn: '60-Minute Stress & Thermal Testing',
      descAr: 'تشغيل ألعاب فعلية لمدة ساعة متواصلة للتأكد من ثبات درجات الحرارة واستجابة أذرع التحكم ومحرك الأقراص.',
      descEn: 'Continuous 60-minute stress gameplay to verify thermal stability, disc drive read speed, and controller latency.',
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-retro-cyan/10 border border-retro-cyan/30 text-retro-cyan">
          {isAr ? 'ضمان وجودة ريترو قطر' : 'RETRO Qatar Certified Standard'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-retro-text tracking-tight">
          {isAr ? 'معايير فحص وضمان أجهزة وألعاب Retro' : 'Retro Hardware Inspection & Certification Standards'}
        </h1>
        <p className="text-sm text-retro-text-secondary leading-relaxed">
          {isAr
            ? 'في ريترو قطر، نحن لا نبيع مجرد أجهزة قديمة — بل نُعيد إحياء تاريخ الألعاب بفحص تقني متخصص، تنظيف عميق، وشفافية كاملة لحالة كل قطعة.'
            : 'At RETRO Qatar, we do not just sell vintage games — we restore gaming history with professional engineering, ultrasonic cleaning, and full transparency.'}
        </p>
      </div>

      {/* Condition Grades */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-retro-text border-b border-retro-border pb-3">
          {isAr ? '🎯 تصنيف درجات الحالة (Condition Grading)' : '🎯 Condition Grading System'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GRADES.map((g, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border ${g.color} space-y-3 shadow-lg`}>
              <span className="text-xs font-black uppercase tracking-wider block">
                {isAr ? g.gradeAr : g.grade}
              </span>
              <p className="text-xs text-retro-text-secondary leading-relaxed">
                {isAr ? g.descAr : g.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Step Inspection Workflow */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-retro-text border-b border-retro-border pb-3">
          {isAr ? '🛠️ مراحل الفحص والتجهيز الفني (4 Steps)' : '🛠️ 4-Step Technical Inspection Process'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INSPECTION_STEPS.map((s, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-retro-bg-card border border-retro-border space-y-3 relative overflow-hidden shadow-md">
              <span className="text-2xl font-black text-retro-cyan font-mono">{s.step}</span>
              <h3 className="text-sm font-black text-retro-text">
                {isAr ? s.titleAr : s.titleEn}
              </h3>
              <p className="text-xs text-retro-text-secondary leading-relaxed">
                {isAr ? s.descAr : s.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Box Contents & Warranty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-retro-bg-card border border-retro-border space-y-4 shadow-xl">
          <h3 className="text-lg font-black text-retro-text flex items-center gap-2">
            <span>📦</span>
            <span>{isAr ? 'ما الذي يشمله الصندوق؟' : 'What is in the Box?'}</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-retro-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-retro-green font-bold">✓</span>
              <span>{isAr ? 'جهاز الكونسول الأصلي مفحوص ومطهر 100%' : 'Original tested & sanitized console unit'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-retro-green font-bold">✓</span>
              <span>{isAr ? 'ذراع تحكم أصلية (Original OEM Controller)' : 'Original OEM matching controller'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-retro-green font-bold">✓</span>
              <span>{isAr ? 'محول الطاقة وكابلات العرض المتوافقة مع الشاشات الحديثة' : 'Power supply adapter and modern display cables'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-retro-green font-bold">✓</span>
              <span>{isAr ? 'شهادة فحص الجودة وتاريخ الفحص من فني ريترو قطر' : 'Quality inspection certificate and testing stamp'}</span>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-retro-bg-card border border-retro-border space-y-4 shadow-xl">
          <h3 className="text-lg font-black text-retro-text flex items-center gap-2">
            <span>🛡️</span>
            <span>{isAr ? 'الضمان المحلي والاسترجاع' : 'Local Warranty & Returns'}</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-retro-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-retro-cyan font-bold">✓</span>
              <span>{isAr ? 'ضمان تشغيلي محلي موثق على الفاتورة' : 'Local operational warranty printed on official invoice'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-retro-cyan font-bold">✓</span>
              <span>{isAr ? 'إمكانية الاسترجاع أو الاستبدال خلال 7 أيام عند وجود أي عطل تقني' : '7-day return or exchange in case of any technical defect'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-retro-cyan font-bold">✓</span>
              <span>{isAr ? 'دعم فني وصيانة مخصصة في مركزنا بمشيرب، الدوحة' : 'Dedicated in-house repair center in Msheireb, Doha'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-retro-cyan font-bold">✓</span>
              <span>{isAr ? 'دعم واستشارات فنية فورية عبر واتساب المتجر' : 'Direct WhatsApp customer support for setup guidance'}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-retro-cyan/10 via-retro-purple/10 to-retro-bg-card border border-retro-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-start">
          <h3 className="text-base sm:text-lg font-black text-retro-text">
            {isAr ? 'تصفح مختارات Retro النادرة والمفحوصة الآن' : 'Explore Inspected Retro Classics Today'}
          </h3>
          <p className="text-xs text-retro-text-secondary">
            {isAr ? 'جميع الأجهزة متوفرة في مخزننا بالدوحة وجاهزة للتوصيل الفوري.' : 'All items in stock in Doha and ready for fast delivery.'}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/${locale}/products?category=retro-games`}
            className="px-5 py-3 rounded-2xl bg-retro-cyan text-retro-bg font-black text-xs hover:bg-retro-cyan/90 transition-all shadow-lg shadow-retro-cyan/20"
          >
            {isAr ? 'تصفح أجهزة وألعاب الريترو' : 'Browse Retro Collection'}
          </Link>
          <a
            href={`https://wa.me/${BUSINESS_INFO.salesWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-500 transition-all shadow-lg"
          >
            {isAr ? 'استفسر عبر واتساب' : 'WhatsApp Inquiry'}
          </a>
        </div>
      </div>
    </div>
  );
}
