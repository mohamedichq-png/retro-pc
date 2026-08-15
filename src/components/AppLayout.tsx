"use client";

import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AiAssistant from "../components/AiAssistant";
import { useEffect, useState } from "react";
import { CartIcon, TrashIcon, CheckIcon, CloseIcon } from "./Icons";
import { supabase } from "../lib/supabase";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { 
    isRtl, 
    language,
    cart,
    removeFromCart,
    updateCartQty,
    cartTotal,
    clearCart,
    t,
    toast
  } = useApp();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [checkoutMethod, setCheckoutMethod] = useState('Card');
  const [orderInvoice, setOrderInvoice] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [isRtl, language]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custPhone.trim()) return;

    const randomId = 'RT-ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderInvoice(randomId);

    // Construct WhatsApp message
    let message = "";
    if (language === 'ar') {
      message += `🛒 طلب جديد من موقع ريترو (RETRO)\n`;
      message += `-------------------------------\n`;
      message += `👤 اسم العميل: ${custName || 'عميل غير مسجل'}\n`;
      message += `📞 رقم الهاتف: ${custPhone}\n`;
      message += `💳 طريقة الدفع المفضلة: ${checkoutMethod === 'Card' ? 'بطاقة ائتمان / مدى' : checkoutMethod === 'Apple Pay' ? 'Apple Pay' : 'نقداً'}\n\n`;
      message += `📦 المنتجات المطلوبة:\n`;
      cart.forEach((item, index) => {
        const price = item.variation ? (item.variation.salePrice ?? item.variation.sellingPrice) : (item.product.salePrice ?? item.product.sellingPrice);
        const name = item.product.nameAr;
        const variationText = item.variation ? ` (${item.variation.edition})` : '';
        message += `${index + 1}. ${name}${variationText} (${item.qty} × ${price} ر.ق)\n`;
      });
      message += `\n💵 المجموع الكلي: ${cartTotal} ر.ق`;
    } else {
      message += `🛒 New Order from RETRO Website\n`;
      message += `-------------------------------\n`;
      message += `👤 Customer Name: ${custName || 'Guest'}\n`;
      message += `📞 Phone Number: ${custPhone}\n`;
      message += `💳 Preferred Payment: ${checkoutMethod}\n\n`;
      message += `📦 Ordered Items:\n`;
      cart.forEach((item, index) => {
        const price = item.variation ? (item.variation.salePrice ?? item.variation.sellingPrice) : (item.product.salePrice ?? item.product.sellingPrice);
        const name = item.product.nameEn;
        const variationText = item.variation ? ` (${item.variation.edition})` : '';
        message += `${index + 1}. ${name}${variationText} (${item.qty} x ${price} QAR)\n`;
      });
      message += `\n💵 Order Total: ${cartTotal} QAR`;
    }

    const whatsappUrl = `https://wa.me/97466223445?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp to send order details
    try {
      window.open(whatsappUrl, '_blank');
    } catch (openErr) {
      console.error("WhatsApp redirect blocked:", openErr);
      window.location.href = whatsappUrl;
    }

    // Sync transaction to Supabase if configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (isSupabaseConfigured) {
      const syncCheckout = async () => {
        try {
          // 1. Check or upsert customer loyalty profile
          let customerId = null;
          if (custPhone) {
            const { data: existingCust } = await supabase
              .from('customers')
              .select('*')
              .eq('phone', custPhone)
              .maybeSingle();

            const pointsEarned = Math.floor(cartTotal / 10);

            if (existingCust) {
              customerId = existingCust.id;
              const nextPoints = (existingCust.loyalty_points || 0) + pointsEarned;
              let level = existingCust.membership_level || 'Bronze';
              if (nextPoints > 3000) level = 'Platinum';
              else if (nextPoints > 1500) level = 'Gold';
              else if (nextPoints > 500) level = 'Silver';

              await supabase
                .from('customers')
                .update({
                  name: custName,
                  loyalty_points: nextPoints,
                  membership_level: level
                })
                .eq('phone', custPhone);
            } else {
              const { data: newCust, error: insertCustErr } = await supabase
                .from('customers')
                .insert({
                  name: custName || 'Online Customer',
                  phone: custPhone,
                  loyalty_points: pointsEarned,
                  membership_level: pointsEarned > 500 ? 'Silver' : 'Bronze',
                  store_credit: 0,
                  outstanding_balance: 0
                })
                .select()
                .single();
              
              if (!insertCustErr && newCust) {
                customerId = newCust.id;
              }
            }
          }

          // 2. Insert transaction
          const totalCost = cart.reduce((acc, item) => {
            const cost = item.variation ? item.variation.costPrice : item.product.costPrice;
            return acc + (cost * item.qty);
          }, 0);

          const dbTx = {
            invoice_no: randomId,
            customer_id: customerId,
            customer_name: custName || 'Online Customer',
            customer_phone: custPhone,
            employee_name: 'Online System',
            source: 'E-Commerce',
            branch: 'Online Store',
            subtotal: cartTotal,
            discount_amount: 0,
            vat_amount: 0,
            total_amount: cartTotal,
            profit_amount: cartTotal - totalCost,
            payment_method: checkoutMethod === 'Card' ? 'Card' : checkoutMethod === 'Apple Pay' ? 'Apple Pay' : 'Cash',
            payment_status: 'Unpaid',
            items: cart.map(item => ({
              productId: item.product.id,
              sku: item.variation?.sku ?? item.product.sku,
              nameEn: item.variation ? `${item.product.nameEn} - ${item.variation.edition} (${item.variation.condition})` : item.product.nameEn,
              nameAr: item.variation ? `${item.product.nameAr} - ${item.variation.edition} (${item.variation.condition})` : item.product.nameAr,
              qty: item.qty,
              price: item.variation ? (item.variation.salePrice ?? item.variation.sellingPrice) : (item.product.salePrice ?? item.product.sellingPrice),
              cost: item.variation ? item.variation.costPrice : item.product.costPrice
            })),
            created_at: new Date().toISOString()
          };

          const { error: txError } = await supabase.from('transactions').insert(dbTx);
          if (txError) throw txError;

          // 3. Update stock quantities in DB
          for (const item of cart) {
            if (item.variation) {
              const { data: pData } = await supabase.from('products').select('variations').eq('id', item.product.id).single();
              if (pData && pData.variations) {
                const updatedVariations = (pData.variations as any[]).map(v => 
                  v.sku === item.variation!.sku ? { ...v, stockQty: Math.max(0, v.stockQty - item.qty) } : v
                );
                await supabase.from('products').update({ variations: updatedVariations }).eq('id', item.product.id);
              }
            } else {
              const nextStock = Math.max(0, item.product.stockQty - item.qty);
              await supabase.from('products').update({ stock_qty: nextStock }).eq('id', item.product.id);
            }
          }
        } catch (err) {
          console.error("Supabase AppLayout checkout sync failed:", err);
        }
      };
      syncCheckout();
    }

    // Clear cart and reset inputs
    clearCart();
    setCustName('');
    setCustPhone('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
      <AiAssistant />

      {/* Dynamic Cart Slide-out Panel */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 lg:bottom-6 left-6 z-40 max-w-sm w-full rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-md glow-cyan animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <CartIcon className="text-cyan-400" />
              <h3 className="text-xs font-bold text-white tracking-wider">
                {isRtl ? "سلة المشتريات" : "Your Shopping Cart"}
              </h3>
            </div>
            <span className="text-xs bg-cyan-500/10 text-cyan-400 font-bold px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>

          <div className="max-h-[200px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
            {cart.map((item) => (
              <div key={item.product.id + (item.variation?.sku || '')} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-200 line-clamp-1">
                    {isRtl ? item.product.nameAr : item.product.nameEn}
                    {item.variation && <span className="text-[10px] text-slate-400 block">{item.variation.edition} ({item.variation.condition})</span>}
                  </h4>
                  <span className="text-[10px] text-cyan-400">
                    {(item.variation?.salePrice ?? item.variation?.sellingPrice ?? item.product.salePrice ?? item.product.sellingPrice)} {t('currency')} x {item.qty}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateCartQty(item.product.id, parseInt(e.target.value), item.variation?.sku)}
                    className="w-10 rounded bg-slate-900 border border-slate-800 text-center py-0.5 text-slate-100 focus:outline-none"
                  />
                  <button onClick={() => removeFromCart(item.product.id, item.variation?.sku)} className="text-pink-500 hover:text-pink-400">
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-3 mt-3 flex items-center justify-between text-xs font-extrabold">
            <span>{isRtl ? "المجموع:" : "Subtotal:"}</span>
            <span className="text-cyan-400">{cartTotal} {t('currency')}</span>
          </div>

          <button
            onClick={() => setCheckoutModalOpen(true)}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-2.5 text-xs font-bold text-white mt-4 cursor-pointer hover:shadow-lg transition-all"
          >
            {isRtl ? "شراء وتأكيد الطلب" : "Checkout Order"}
          </button>
        </div>
      )}

      {/* Checkout Modal Form */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-purple-500/20 bg-slate-950 p-6 shadow-2xl">
            <button
              onClick={() => {
                setCheckoutModalOpen(false);
                setOrderInvoice(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <CloseIcon size={20} />
            </button>

            {!orderInvoice ? (
              <form onSubmit={handleCheckout} className="space-y-4">
                <h3 className="text-base font-bold text-white tracking-wider border-b border-slate-900 pb-2 mb-4">
                  {isRtl ? "إتمام الشراء والدفع" : "Complete Order Details"}
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">
                    {isRtl ? "الاسم الكامل (اختياري)" : "Full Name (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder={isRtl ? "عبدالله الكواري" : "e.g. Jassim Al-Kuwari"}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">
                    {isRtl ? "رقم الهاتف القطري (مطلوب)" : "Phone Number (Required)"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="e.g. 55663344"
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">
                    {isRtl ? "طريقة الدفع" : "Payment Method"}
                  </label>
                  <select
                    value={checkoutMethod}
                    onChange={(e) => setCheckoutMethod(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none"
                  >
                    <option value="Card">{isRtl ? "بطاقة ائتمان / مدى" : "Credit Card / Debit"}</option>
                    <option value="Apple Pay">Apple Pay</option>
                    <option value="Cash">{isRtl ? "نقداً" : "Cash"}</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400">{isRtl ? "المجموع الكلي:" : "Order Total:"}</span>
                  <span className="font-black text-cyan-400 text-base">{cartTotal} {t('currency')}</span>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-xs font-bold text-white shadow-lg cursor-pointer"
                >
                  {isRtl ? "تأكيد الطلب والدفع" : "Pay & Confirm"}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                  <CheckIcon size={24} />
                </div>
                <h3 className="text-base font-bold text-white">
                  {isRtl ? "تم إرسال طلبك بنجاح!" : "Order Placed Successfully!"}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {isRtl
                    ? `رقم فاتورتك هو ${orderInvoice}. تم تسجيل طلبك وتعديل المخزون وحساب نقاط الوفاء في ملفك.`
                    : `Your invoice number is ${orderInvoice}. Your inventory has been updated and loyalty points credited.`}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setCheckoutModalOpen(false);
                      setOrderInvoice(null);
                    }}
                    className="rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold px-4 py-2 hover:bg-slate-800"
                  >
                    {isRtl ? "العودة للتسوق" : "Close"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`fixed top-6 ${isRtl ? 'left-6' : 'right-6'} z-50 max-w-sm w-full rounded-2xl border bg-slate-950/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' 
            ? 'border-emerald-500/30 text-emerald-400 shadow-emerald-500/10' 
            : toast.type === 'error' 
              ? 'border-pink-500/30 text-pink-400 shadow-pink-500/10' 
              : 'border-cyan-500/30 text-cyan-400 shadow-cyan-500/10'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${
              toast.type === 'success' 
                ? 'bg-emerald-400 animate-pulse' 
                : toast.type === 'error' 
                  ? 'bg-pink-400 animate-pulse' 
                  : 'bg-cyan-400 animate-pulse'
            }`}></span>
            <p className="text-xs font-bold text-slate-100 leading-normal">
              {toast.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
