import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/dictionaries';

export default async function ProcessorBrandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const ar = locale === 'ar';
  return (
    <main dir={ar ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-6xl px-4 pb-20 pt-12 sm:px-6">
      <Link href={`/${locale}/retro-pc`} className="text-sm text-cyan-300 hover:text-white">{ar ? '← العودة لقسم الكمبيوتر' : '← Back to Retro PC'}</Link>
      <div className="mb-10 mt-10 text-center">
        <p className="text-xs font-bold tracking-[.24em] text-cyan-400">RETRO PC</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">{ar ? 'اختر شركة المعالج' : 'Choose a CPU brand'}</h1>
        <p className="mt-4 text-sm text-slate-400">{ar ? 'اضغط على Intel أو AMD لعرض المعالجات المتوفرة' : 'Select Intel or AMD to browse available processors'}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {(['intel', 'amd'] as const).map(brand => (
          <Link key={brand} href={`/${locale}/retro-pc/processors/${brand}`} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c1525] transition hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_14px_45px_rgba(0,190,230,.15)]" aria-label={brand === 'intel' ? 'Intel processors' : 'AMD processors'}>
            <div className="relative aspect-[16/10] w-full">
              <Image src={`/media/retro-pc/${brand}-processors.jpg`} alt={brand === 'intel' ? 'Intel' : 'AMD'} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
