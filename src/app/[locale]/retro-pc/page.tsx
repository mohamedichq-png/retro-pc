import Link from 'next/link';
import Image from 'next/image';
import { hasLocale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';

const departments = [
  { ar: 'تجميعات Gaming PC', en: 'Gaming PCs', subAr: 'أجهزة جاهزة للألعاب والعمل', subEn: 'Ready-to-go PCs', slug: 'gaming-pcs', symbol: '▣', feature: true },
  { ar: 'قطع الكمبيوتر', en: 'PC Components', subAr: 'كل ما تحتاجه لتجميعتك', subEn: 'Everything for your build', slug: 'pc', symbol: '⌘', feature: true },
  { ar: 'كروت الشاشة', en: 'Graphics Cards', subAr: 'GPU', subEn: 'GPU', slug: 'gpus', symbol: '▤' },
  { ar: 'المعالجات', en: 'Processors', subAr: 'CPU', subEn: 'CPU', slug: 'cpus', symbol: '▦' },
  { ar: 'اللوحات الأم', en: 'Motherboards', subAr: 'Motherboards', subEn: 'Motherboards', slug: 'motherboards', symbol: '▧' },
  { ar: 'الرامات', en: 'Memory', subAr: 'RAM / DDR5', subEn: 'RAM / DDR5', slug: 'ram', symbol: '▥' },
  { ar: 'التخزين', en: 'Storage', subAr: 'SSD / NVMe', subEn: 'SSD / NVMe', slug: 'storage', symbol: '▭' },
  { ar: 'مزودات الطاقة', en: 'Power Supplies', subAr: 'PSU', subEn: 'PSU', slug: 'psu', symbol: '◈' },
  { ar: 'الكيسات', en: 'PC Cases', subAr: 'Cases', subEn: 'Cases', slug: 'pc-cases', symbol: '▣' },
  { ar: 'التبريد', en: 'Cooling', subAr: 'Cooling / Fans', subEn: 'Cooling / Fans', slug: 'cooling', symbol: '❄' },
  { ar: 'الشاشات', en: 'Monitors', subAr: 'Gaming Displays', subEn: 'Gaming Displays', slug: 'monitors', symbol: '▰' },
  { ar: 'الملحقات', en: 'Accessories', subAr: 'Keyboards / Mice', subEn: 'Keyboards / Mice', slug: 'accessories', symbol: '⌨' },
];

export default async function RetroPcPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const ar = locale === 'ar';
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8" dir={ar ? 'rtl' : 'ltr'}>
      <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition-colors hover:text-white">
        {ar ? '↩ الرجوع لاختيار المتجر' : '↩ Back to store selection'}
      </Link>

      <section className="relative mt-7 min-h-[310px] overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#081423] sm:min-h-[390px]">
        <Image src="/media/retro-pc/pc-section-hero.webp" alt={ar ? 'كمبيوتر ألعاب وتجميعة RGB' : 'RGB gaming desktop PC setup'} fill priority sizes="(max-width: 768px) 100vw, 1200px" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#061220]/95 via-[#061220]/75 to-[#061220]/10 rtl:bg-gradient-to-r" />
        <div className="relative z-10 flex min-h-[310px] max-w-xl flex-col items-start justify-center p-7 sm:min-h-[390px] sm:p-12">
          <p className="mb-3 text-sm font-black tracking-[0.22em] text-cyan-300">RETRO PC</p>
          <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl">{ar ? 'عالم الكمبيوتر والقيمنق' : 'Gaming PCs & Hardware'}</h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-200 sm:text-base">{ar ? 'تجميعات احترافية، قطع كمبيوتر وإكسسوارات. اختر القسم المناسب أو صمّم تجميعتك بنفسك.' : 'Gaming builds, PC components and peripherals. Explore departments or build your own PC.'}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/${locale}/pc-builder`} className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300">{ar ? 'صمّم تجميعتك' : 'Build Your PC'}</Link>
            <Link href={`/${locale}/products?category=pc`} className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:border-cyan-300">{ar ? 'تصفح قطع الكمبيوتر' : 'Shop PC Parts'}</Link>
          </div>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="pc-departments-title">
        <div className="mb-6">
          <p className="text-xs font-bold tracking-[0.2em] text-cyan-400">RETRO PC</p>
          <h2 id="pc-departments-title" className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{ar ? 'تصفح الأقسام' : 'Browse departments'}</h2>
          <p className="mt-2 text-sm text-slate-400">{ar ? 'اختر القسم الذي تبحث عنه' : 'Choose a department to explore'}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {departments.map((d) => (
            <Link key={d.slug} href={`/${locale}/products?category=${encodeURIComponent(d.slug)}`}
              className={`group relative flex min-h-[156px] flex-col items-start justify-between overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_12px_35px_rgba(0,185,230,.12)] sm:min-h-[180px] ${d.feature ? 'border-cyan-500/25 from-[#142b43] to-[#0b1525]' : 'border-white/10 from-[#142034] to-[#0b1423]'}`}>
              <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-300 transition-colors group-hover:bg-cyan-400/20">{d.symbol}</span>
              <span className="block">
                <span className="block text-sm font-extrabold text-white sm:text-base">{ar ? d.ar : d.en}</span>
                <span className="mt-1 block text-xs text-slate-400">{ar ? d.subAr : d.subEn}</span>
              </span>
              <span aria-hidden="true" className="absolute bottom-5 end-5 text-cyan-400/60 transition-transform group-hover:-translate-x-1">←</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-cyan-400/20 bg-[#10243b] p-7 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-extrabold text-white">{ar ? 'تبي تجميعة على ذوقك؟' : 'Want a custom PC?'}</h2>
          <p className="mt-2 text-sm text-slate-300">{ar ? 'ابدأ باختيار المعالج وكرت الشاشة وباقي القطع في PC Builder.' : 'Pick your CPU, GPU, and components in PC Builder.'}</p>
        </div>
        <Link href={`/${locale}/pc-builder`} className="shrink-0 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-extrabold text-[#061321] hover:bg-cyan-300">PC Builder</Link>
      </section>
    </main>
  );
}
