/* eslint-disable @next/next/no-img-element */
'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { RETRO_BRANDS, RETRO_KINDS } from '@/lib/retro-navigation';
import { useOffersStore, DEFAULT_RETRO_BRAND_LOGOS } from '@/stores/useOffersStore';

function DeviceImage({ src, name, ar }: { src: string; name: string; ar: boolean }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return (
      <span className="text-center text-xs text-slate-500">
        {ar ? 'صورة الجهاز غير متوفرة بعد' : 'Device photo unavailable'}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
    />
  );
}

function BrandLogoImage({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return (
      <span className="px-4 text-xl font-black tracking-wider text-white uppercase group-hover:text-cyan-300 transition">
        {name}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className="h-31.25 max-h-full w-[94%] object-contain transition duration-200 group-hover:scale-105"
    />
  );
}

function KindSectionImage({ src, name, kindId, ar }: { src?: string; name: string; kindId: string; ar: boolean }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const placeholderIcon = kindId === 'consoles' ? '🕹️' : kindId === 'games' ? '💿' : '🎮';

  if (!src || failed) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-slate-500 select-none">
        <span className="text-3xl opacity-50 transition duration-200 group-hover:scale-110 group-hover:opacity-80">
          {placeholderIcon}
        </span>
        <span className="text-center text-xs text-slate-500">
          {ar ? 'صورة القسم قريباً' : 'Image coming soon'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
    />
  );
}

const suppliedBrandLogos: Record<string, string> = {
  playstation: '/brand-logos/playstation.png',
  atari: '/brand-logos/atari.png',
  xbox: '/brand-logos/xbox.png',
  sega: '/brand-logos/sega.png',
  amiga: '/brand-logos/amiga.png',
  panasonic: '/brand-logos/panasonic.png',
  nec: '/brand-logos/pc-engine.png',
  philips: '/brand-logos/philips.webp',
  arcade: '/brand-logos/arcade.jpg',
  nintendo: '/brand-logos/nintendo.svg',
  snk: '/brand-logos/snk.svg',
};

function RetroStoreContent() {
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale === 'en' ? 'en' : 'ar';
  const ar = locale === 'ar';

  const retroBrands = useOffersStore((s) => s.retroBrands);
  const retroBrandLogos = useOffersStore((s) => s.retroBrandLogos);
  const retroDeviceImages = useOffersStore((s) => s.retroDeviceImages);
  const retroKindImages = useOffersStore((s) => s.retroKindImages);

  useEffect(() => {
    useOffersStore.getState().initializeFromCloud();
  }, []);

  const activeBrands = (retroBrands && retroBrands.length > 0 ? retroBrands : RETRO_BRANDS).filter(
    (b) => !b.hidden
  );

  const brandParam = searchParams.get('brand');
  const modelParam = searchParams.get('model');

  const brand = brandParam ? activeBrands.find((b) => b.id === brandParam) || null : null;
  const activeDevices = brand ? brand.devices.filter((d) => !d.hidden) : [];
  const device = brand && modelParam ? activeDevices.find((d) => d.id === modelParam) || null : null;

  const handleBack = () => {
    if (brand && device) {
      router.push(`/${locale}/retro?brand=${encodeURIComponent(brand.id)}`);
    } else if (brand) {
      router.push(`/${locale}/retro`);
    }
  };

  const brandDisplayName = brand ? (ar && brand.nameAr ? brand.nameAr : brand.name) : '';
  const deviceDisplayName = device ? (ar && device.nameAr ? device.nameAr : device.name) : '';

  return (
    <main dir={ar ? 'rtl' : 'ltr'} className="mx-auto max-w-7xl px-4 py-12 sm:px-7 sm:py-16 min-h-[75vh]">
      <div className="flex items-center justify-between gap-3 mb-8">
        <button
          type="button"
          onClick={handleBack}
          className={`text-sm text-cyan-300 hover:underline cursor-pointer ${brand ? 'visible' : 'invisible'}`}
          disabled={!brand}
        >
          {ar ? '← رجوع' : '← Back'}
        </button>
        <Link href={`/${locale}`} className="text-sm text-cyan-300 hover:underline">
          {ar ? 'اختيار المتجر' : 'Choose store'}
        </Link>
      </div>

      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[.3em] font-bold text-cyan-400">RETRO QATAR</p>
        <h1 className="mt-4 text-3xl md:text-5xl font-black text-white">
          {!brand
            ? ar
              ? 'اختر الشركة'
              : 'Choose a brand'
            : !device
            ? brandDisplayName
            : deviceDisplayName}
        </h1>
        <p className="mt-3 text-slate-400">
          {!brand
            ? ar
              ? 'اختر الشركة ثم الجهاز'
              : 'Select a brand, then a console'
            : !device
            ? ar
              ? 'اختر صورة الجهاز'
              : 'Choose your console'
            : ar
            ? 'اختر نوع المنتج'
            : 'Choose product type'}
        </p>
      </div>

      {!brand ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeBrands.map((b) => {
            const logoSrc =
              retroBrandLogos[b.id] ||
              b.logo ||
              suppliedBrandLogos[b.id] ||
              DEFAULT_RETRO_BRAND_LOGOS[b.id] ||
              `/brand-logos/${b.id}.svg`;
            const bName = ar && b.nameAr ? b.nameAr : b.name;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => router.push(`/${locale}/retro?brand=${encodeURIComponent(b.id)}`)}
                aria-label={bName}
                className="group flex min-h-40 flex-col items-center justify-center rounded-2xl border border-white/15 bg-black p-2 text-center transition duration-200 hover:-translate-y-1 hover:border-cyan-400/75 hover:shadow-[0_10px_36px_rgba(0,205,240,.10)] focus-visible:outline-2 focus-visible:outline-cyan-400 cursor-pointer"
              >
                <span className="flex h-32 w-full items-center justify-center">
                  <BrandLogoImage key={logoSrc} src={logoSrc} name={bName} />
                </span>
              </button>
            );
          })}
        </div>
      ) : !device ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {activeDevices.map((d) => {
            const defaultBrand = RETRO_BRANDS.find((b) => b.id === brand.id);
            const defaultDev = defaultBrand?.devices.find((x) => x.id === d.id);
            const deviceImg = retroDeviceImages[`${brand.id}:${d.id}`] || d.image || defaultDev?.image || '';
            const dName = ar && d.nameAr ? d.nameAr : d.name;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() =>
                  router.push(
                    `/${locale}/retro?brand=${encodeURIComponent(brand.id)}&model=${encodeURIComponent(d.id)}`
                  )
                }
                className="group rounded-2xl border border-white/10 bg-slate-900/70 overflow-hidden transition hover:border-cyan-400 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-cyan-400 cursor-pointer"
              >
                <div className="aspect-4/3 flex items-center justify-center bg-black p-5">
                  {deviceImg ? (
                    <DeviceImage key={deviceImg} src={deviceImg} name={dName} ar={ar} />
                  ) : (
                    <span className="text-center text-xs text-slate-500">
                      {ar ? 'صورة الجهاز قريباً' : 'Image coming soon'}
                    </span>
                  )}
                </div>
                <div className="py-4 px-2 text-white font-bold text-center">{dName}</div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {RETRO_KINDS.map((k) => {
            const kindKey = `${brand.id}:${device.id}:${k.id}`;
            const customKindImg = retroKindImages[kindKey] || device.kindImages?.[k.id];
            const defaultKindImg =
              k.id === 'consoles'
                ? (retroDeviceImages[`${brand.id}:${device.id}`] || device.image)
                : '';
            const kindImg = customKindImg || defaultKindImg || '';
            return (
              <Link
                key={k.id}
                href={`/${locale}/retro/browse/${encodeURIComponent(brand.id)}/${encodeURIComponent(device.id)}/${k.id}`}
                className="group flex flex-col rounded-2xl border border-white/15 bg-slate-900/80 overflow-hidden text-center transition hover:border-cyan-400 hover:-translate-y-1 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-cyan-400"
              >
                <div className="aspect-4/3 w-full flex items-center justify-center bg-black p-5 border-b border-white/10">
                  <KindSectionImage
                    key={kindImg || 'placeholder'}
                    src={kindImg}
                    name={`${deviceDisplayName} - ${ar ? k.ar : k.en}`}
                    kindId={k.id}
                    ar={ar}
                  />
                </div>
                <div className="px-6 py-6">
                  <div className="text-2xl font-black text-white">{ar ? k.ar : k.en}</div>
                  <div className="mt-2 text-slate-400 text-sm">{ar ? k.hintAr : k.en}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function RetroStorePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 min-h-[75vh]" />}>
      <RetroStoreContent />
    </Suspense>
  );
}
