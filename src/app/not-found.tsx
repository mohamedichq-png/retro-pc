import Link from 'next/link';

export default function RootNotFound() {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="h-full bg-[#050817] text-[#f1f5f9] flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-3xl font-black font-mono shadow-xl">
            404
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">الصفحة غير موجودة | Page Not Found</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/ar"
              className="px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-[#050817] font-black text-xs transition-all shadow-lg shadow-cyan-400/20"
            >
              العودة للرئيسية (العربية)
            </Link>
            <Link
              href="/en"
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700"
            >
              Home (English)
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
