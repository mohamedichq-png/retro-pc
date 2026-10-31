import Link from 'next/link';
import Image from 'next/image';
import { hasLocale } from '@/i18n/dictionaries';
import { notFound } from 'next/navigation';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const ar = locale === 'ar';

  return (
    <main className="mx-auto flex min-h-[76vh] max-w-6xl flex-col justify-center px-4 py-16 sm:px-8" dir={ar ? 'rtl' : 'ltr'}>
      <div className="mb-10 text-center">
        <p className="mb-3 text-sm font-bold tracking-[.28em] text-cyan-400">RETRO QATAR</p>
        <h1 className="text-4xl font-black text-white sm:text-6xl">{ar ? 'اختر متجرك' : 'Choose your store'}</h1>
        <p className="mt-4 text-base text-slate-300">{ar ? 'متجران مستقلان، وجهة واحدة' : 'Two unique stores, one destination'}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href={`/${locale}/retro`}
          className="group relative flex min-h-[415px] flex-col overflow-hidden rounded-3xl border border-amber-400/30 bg-zinc-950 shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
        >
          <div className="relative h-52 w-full overflow-hidden sm:h-56">
            <Image
              src="/media/store-selection/retro-card.webp"
              alt={ar ? 'أجهزة ألعاب كلاسيكية وشاشة ريترو' : 'Classic video game consoles and CRT display'}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" aria-hidden="true" />
          </div>
          <div className="relative z-10 flex flex-1 flex-col justify-between px-7 pb-7 pt-1 sm:px-9 sm:pb-9">
            <div>
              <span className="text-xs font-semibold tracking-widest text-amber-400">CLASSIC GAMING</span>
              <h2 className="mt-2 text-4xl font-black text-white">RETRO</h2>
              <p className="mt-3 max-w-sm text-base text-zinc-300">{ar ? 'أجهزة الألعاب الكلاسيكية، ألعاب الريترو والإكسسوارات' : 'Classic consoles, retro games and accessories'}</p>
            </div>
            <span className="mt-5 font-bold text-amber-400 group-hover:underline">{ar ? 'ادخل متجر Retro ←' : 'Enter Retro →'}</span>
          </div>
        </Link>

        <Link
          href={`/${locale}/retro-pc`}
          className="group relative flex min-h-[415px] flex-col overflow-hidden rounded-3xl border border-cyan-400/30 bg-[#071321] shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
        >
          <div className="relative h-52 w-full overflow-hidden sm:h-56">
            <Image
              src="/media/store-selection/retro-pc-card.webp"
              alt={ar ? 'كمبيوتر ألعاب بإضاءة زرقاء' : 'Gaming PC with blue RGB lighting'}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071321] via-[#071321]/10 to-transparent" aria-hidden="true" />
          </div>
          <div className="relative z-10 flex flex-1 flex-col justify-between px-7 pb-7 pt-1 sm:px-9 sm:pb-9">
            <div>
              <span className="text-xs font-semibold tracking-widest text-cyan-400">GAMING & HARDWARE</span>
              <h2 className="mt-2 text-4xl font-black text-white">RETRO PC</h2>
              <p className="mt-3 max-w-sm text-base text-slate-300">{ar ? 'كمبيوترات الألعاب، قطع الهاردوير والتجميعات' : 'Gaming PCs, components and custom builds'}</p>
            </div>
            <span className="mt-5 font-bold text-cyan-400 group-hover:underline">{ar ? 'ادخل متجر Retro PC ←' : 'Enter Retro PC →'}</span>
          </div>
        </Link>
      </div>
    </main>
  );
}
