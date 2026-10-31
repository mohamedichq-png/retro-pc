/* eslint-disable @next/next/no-img-element */
'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {RETRO_BRANDS,RETRO_KINDS} from '@/lib/retro-navigation';
import type {RetroBrand,RetroDevice} from '@/lib/retro-navigation';
import {useOffersStore, DEFAULT_RETRO_BRAND_LOGOS} from '@/stores/useOffersStore';


function DeviceImage({src,name,ar}:{src:string;name:string;ar:boolean}){
 const [failed,setFailed]=useState(false);
 if(failed)return <span className="text-center text-xs text-slate-500">{ar?'صورة الجهاز غير متوفرة بعد':'Device photo unavailable'}</span>;
 return <img src={src} alt={name} loading="lazy" onError={()=>setFailed(true)} className="h-full w-full object-contain"/>;
}

const suppliedBrandLogos: Record<string,string> = {'playstation':'/brand-logos/playstation.png','atari':'/brand-logos/atari.png','xbox':'/brand-logos/xbox.png','sega':'/brand-logos/sega.png','amiga':'/brand-logos/amiga.png','panasonic':'/brand-logos/panasonic.png','nec':'/brand-logos/pc-engine.png','philips':'/brand-logos/philips.webp','arcade':'/brand-logos/arcade.jpg'};

export default function RetroStorePage(){
 const params=useParams<{locale:string}>();
 const locale=params.locale==='en'?'en':'ar';
 const ar=locale==='ar';
 const [brand,setBrand]=useState<RetroBrand|null>(null);
 const [device,setDevice]=useState<RetroDevice|null>(null);
 const back=()=>{if(device)setDevice(null);else setBrand(null)};

 const retroBrandLogos = useOffersStore((s) => s.retroBrandLogos);
 const retroDeviceImages = useOffersStore((s) => s.retroDeviceImages);

 return <main dir={ar?'rtl':'ltr'} className="mx-auto max-w-7xl px-4 py-12 sm:px-7 sm:py-16 min-h-[75vh]">
  <div className="flex items-center justify-between gap-3 mb-8">
    <button onClick={back} className="text-sm text-cyan-300 hover:underline" disabled={!brand} style={{visibility:brand?'visible':'hidden'}}>{ar?'← رجوع':'← Back'}</button>
    <Link href={`/${locale}`} className="text-sm text-cyan-300 hover:underline">{ar?'اختيار المتجر':'Choose store'}</Link>
  </div>
  <div className="text-center mb-10"><p className="text-xs uppercase tracking-[.3em] font-bold text-cyan-400">RETRO QATAR</p>
    <h1 className="mt-4 text-3xl md:text-5xl font-black text-white">{!brand?(ar?'اختر الشركة':'Choose a brand'):!device?brand.name:device.name}</h1>
    <p className="mt-3 text-slate-400">{!brand?(ar?'اختر الشركة ثم الجهاز':'Select a brand, then a console'):!device?(ar?'اختر صورة الجهاز':'Choose your console'):(ar?'اختر نوع المنتج':'Choose product type')}</p>
  </div>
  {!brand?<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
   {RETRO_BRANDS.map(b=>{
     const logoSrc = retroBrandLogos[b.id] || suppliedBrandLogos[b.id] || DEFAULT_RETRO_BRAND_LOGOS[b.id] || `/brand-logos/${b.id}.svg`;
     return (
       <button key={b.id} onClick={()=>{setBrand(b);setDevice(null)}} aria-label={b.name} className="group flex min-h-40 flex-col items-center justify-center rounded-2xl border border-white/15 bg-black p-2 text-center transition duration-200 hover:-translate-y-1 hover:border-cyan-400/75 hover:shadow-[0_10px_36px_rgba(0,205,240,.10)] focus-visible:outline-2 focus-visible:outline-cyan-400">
        <span className="flex h-32 w-full items-center justify-center">
          <img src={logoSrc} alt={b.name} loading="lazy" className="h-[125px] max-h-full w-[94%] object-contain transition duration-200 group-hover:scale-105"/>
        </span>
       </button>
     );
   })}
  </div>:!device?<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
    {brand.devices.map(d=>{
      const deviceImg = retroDeviceImages[`${brand.id}:${d.id}`] || d.image;
      return (
        <button key={d.id} onClick={()=>setDevice(d)} className="rounded-2xl border border-white/10 bg-slate-900/70 overflow-hidden transition hover:border-cyan-400 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-cyan-400">
          <div className="aspect-[4/3] flex items-center justify-center bg-black p-5">
            {deviceImg ? <DeviceImage src={deviceImg} name={d.name} ar={ar}/> : <span className="text-center text-xs text-slate-500">{ar?'صورة الجهاز قريباً':'Image coming soon'}</span>}
          </div>
          <div className="py-4 text-white font-bold text-center">{d.name}</div>
        </button>
      );
    })}
  </div>:<div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
    {RETRO_KINDS.map(k=><Link key={k.id} href={`/${locale}/retro/browse/${brand.id}/${device.id}/${k.id}`} className="rounded-2xl border border-white/15 bg-slate-900/80 px-6 py-12 text-center transition hover:border-cyan-400 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-cyan-400">
      <div className="text-2xl font-black text-white">{ar?k.ar:k.en}</div><div className="mt-3 text-slate-400 text-sm">{ar?k.hintAr:k.en}</div>
    </Link>)}
  </div>}
 </main>;
}
