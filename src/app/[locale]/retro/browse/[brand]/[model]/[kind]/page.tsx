import Link from 'next/link';
import {notFound} from 'next/navigation';
import {hasLocale,getDictionary} from '@/i18n/dictionaries';
import type {Locale} from '@/i18n/dictionaries';
import {getStoreProducts} from '@/lib/productsData';
import {ProductGrid} from '@/components/product/ProductGrid';
import {RETRO_BRANDS,RETRO_KINDS} from '@/lib/retro-navigation';
import type {Product} from '@/types';

export const dynamic='force-dynamic';
function typeMatches(p:Product,kind:string){
 const type=[p.section,p.subCategory,p.secondaryCategory,p.primaryCategory,p.category,p.productType].filter(Boolean).join(' ').toLowerCase();
 if(kind==='consoles')return /(^|\W)(consoles?|hardware|systems?|أجهزة|كونسول)(\W|$)/i.test(type) && !/accessor|controller|game(s|s-cds)?|ألعاب|إكسسوار/i.test(type);
 if(kind==='games')return /game(s|s-cds)?|ألعاب|cd|disc|software/i.test(type)&&!/accessor|controller/i.test(type);
 return /accessor|controller|peripheral|إكسسوار|ملحق|يد تحكم/i.test(type);
}
function deviceMatches(p:Product,tokens:string[]){
 const searchable=[p.platform,p.model,p.subCategory,p.secondaryCategory,p.category,p.nameEn,p.nameAr].filter(Boolean).join(' ').toLowerCase();
 return tokens.some(token=>new RegExp(`(^|[^a-z0-9])${token.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^a-z0-9]|$)`,'i').test(searchable));
}
export default async function RetroProducts({params}:{params:Promise<{locale:string;brand:string;model:string;kind:string}>}){
 const {locale,brand:brandId,model:modelId,kind:kindId}=await params;
 if(!hasLocale(locale))notFound();
 const brand=RETRO_BRANDS.find(x=>x.id===brandId);
 const model=brand?.devices.find(x=>x.id===modelId);
 const kind=RETRO_KINDS.find(x=>x.id===kindId);
 if(!brand||!model||!kind)notFound();
 const all=await getStoreProducts();
 const items=all.filter(p=>p.status!=='draft' && deviceMatches(p,model.tokens) && typeMatches(p,kind.id));
 const dict=await getDictionary(locale as Locale);
 const ar=locale==='ar';
 return <main className="mx-auto max-w-7xl px-5 py-12 min-h-[70vh]" dir={ar?'rtl':'ltr'}>
  <Link href={`/${locale}/retro`} className="text-sm text-cyan-300 hover:underline">{ar?'← العودة لاختيار الجهاز':'← Back to consoles'}</Link>
  <p className="mt-8 text-sm text-slate-400">{brand.name} / {model.name}</p>
  <h1 className="mt-2 mb-8 text-3xl font-black text-white">{ar?kind.ar:kind.en}</h1>
  {items.length?<ProductGrid products={items} dict={dict} locale={locale as Locale}/>:<div className="rounded-2xl border border-white/10 bg-slate-900/50 p-10 text-center text-slate-300">{ar?'لا توجد منتجات مصنفة لهذا الجهاز في هذا القسم حالياً.':'No products are classified for this console and category yet.'}</div>}
 </main>;
}
