// RETRO Qatar — Checkout Content Component (Client)

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/useCartStore';
import { useUIStore } from '@/stores/useUIStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import type { Dictionary, Locale } from '@/i18n/dictionaries';
import { BUSINESS_INFO } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

interface CheckoutContentProps {
  dict: Dictionary;
  locale: Locale;
}

export function CheckoutContent({ dict, locale }: CheckoutContentProps) {
  const { items, getTotal, clearCart } = useCartStore();
  const { showToast } = useUIStore();
  const isRtl = locale === 'ar';
  const totalPrice = getTotal();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Doha',
    address: '',
    paymentMethod: 'cod', // 'cod' or 'card'
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const shippingCost = totalPrice >= 500 ? 0 : 30;
  const grandTotal = totalPrice + shippingCost;

  const breadcrumbs = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.cart?.myCart || 'Cart', href: `/${locale}/cart` },
    { label: dict.cart?.checkout || 'Checkout' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a mock Order ID
    const randomId = 'RT-ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
    setIsSuccess(true);
    showToast(isRtl ? 'تم تسجيل طلبك بنجاح!' : 'Order placed successfully!', 'success');

    // Generate WhatsApp text for order details
    const orderItemsText = items.map(item => {
      const name = isRtl ? item.product.nameAr : item.product.nameEn;
      const variationText = item.variation ? ` (${item.variation.edition})` : '';
      return `- ${name}${variationText} x${item.qty}`;
    }).join('\n');

    const whatsappMessage = `*New Order: ${randomId}* 🛒
Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.city}, ${formData.address}
Payment Method: ${formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}

*Items:*
${orderItemsText}

*Total:* ${grandTotal.toLocaleString()} QAR`;

    const whatsappUrl = `https://wa.me/${BUSINESS_INFO.salesWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`;
    (window as any)._pendingWhatsappUrl = whatsappUrl;

    // Automatically open WhatsApp to send order details
    try {
      window.open(whatsappUrl, '_blank');
    } catch (openErr) {
      console.error("WhatsApp auto-open blocked by browser:", openErr);
    }

    // Sync transaction to Supabase if configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (isSupabaseConfigured) {
      const syncCheckout = async () => {
        try {
          // 1. Check or upsert customer loyalty profile
          let customerId = null;
          if (formData.phone) {
            const { data: existingCust } = await supabase
              .from('customers')
              .select('*')
              .eq('phone', formData.phone)
              .maybeSingle();

            const pointsEarned = Math.floor(grandTotal / 10);

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
                  name: formData.name,
                  email: formData.email,
                  loyalty_points: nextPoints,
                  membership_level: level
                })
                .eq('phone', formData.phone);
            } else {
              const { data: newCust, error: insertCustErr } = await supabase
                .from('customers')
                .insert({
                  name: formData.name,
                  phone: formData.phone,
                  email: formData.email,
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
          const totalCost = items.reduce((acc, item) => {
            const cost = item.variation ? item.variation.costPrice : item.product.costPrice;
            return acc + (cost * item.qty);
          }, 0);

          const dbTx = {
            invoice_no: randomId,
            customer_id: customerId,
            customer_name: formData.name,
            customer_phone: formData.phone,
            employee_name: 'Online System',
            source: 'E-Commerce',
            branch: 'Online Store',
            subtotal: totalPrice,
            discount_amount: 0,
            vat_amount: 0,
            total_amount: grandTotal,
            profit_amount: grandTotal - totalCost,
            payment_method: formData.paymentMethod === 'cod' ? 'Cash' : 'Card',
            payment_status: 'Unpaid',
            items: items.map(item => ({
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
          for (const item of items) {
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
          console.error("Supabase checkout sync failed:", err);
        }
      };
      syncCheckout();
    }
    
    // Clear cart state
    clearCart();
  };

  if (isSuccess) {
    return (
      <div className="bg-retro-bg min-h-[70vh] py-16 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-500 mb-8 animate-pulse">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="text-3xl font-black text-retro-text mb-4">
          {isRtl ? 'شكراً لطلبك!' : 'Thank you for your order!'}
        </h2>
        <p className="text-retro-text-secondary mb-2 max-w-md">
          {isRtl ? 'تم تسجيل طلبك بنجاح. رقم الطلب الخاص بك هو:' : 'Your order has been placed. Your Order ID is:'}
        </p>
        <span className="text-xl font-mono font-black text-retro-cyan bg-retro-bg-card border border-retro-border px-4 py-2 rounded-xl mb-8 block">
          {orderId}
        </span>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="accent"
            onClick={() => {
              const url = (window as any)._pendingWhatsappUrl;
              if (url) window.open(url, '_blank');
            }}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
          >
            {isRtl ? 'تأكيد عبر واتساب لتسريع التوصيل' : 'Confirm via WhatsApp for Faster Delivery'}
          </Button>
          <Link href={`/${locale}`}>
            <Button variant="secondary">
              {isRtl ? 'العودة للرئيسية' : 'Go back Home'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-retro-bg min-h-[60vh] py-12 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-black text-retro-text mb-4">{isRtl ? 'السلة فارغة' : 'Your cart is empty'}</h2>
        <Link href={`/${locale}/products`}>
          <Button>{dict.cart?.continueShopping || 'Continue Shopping'}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-retro-bg min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <h1 className="text-3xl font-black text-retro-text mb-8">{dict.cart?.checkout || 'Checkout'}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Shipping Form (Left) */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-retro-bg-card border border-retro-border rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-black text-retro-text mb-4">{isRtl ? 'عنوان التوصيل' : 'Shipping Information'}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label={isRtl ? 'الاسم الكامل' : 'Full Name'} 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <Input 
                  label={isRtl ? 'البريد الإلكتروني' : 'Email Address'} 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label={isRtl ? 'رقم الهاتف' : 'Phone Number'} 
                  type="tel" 
                  required 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-retro-text">{isRtl ? 'المدينة' : 'City'}</label>
                  <select 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-retro-bg-input border border-retro-border rounded-xl px-4 py-3 text-sm text-retro-text focus:outline-none focus:border-retro-cyan/50 focus:shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                  >
                    <option value="Doha">Doha (الدوحة)</option>
                    <option value="Al Rayyan">Al Rayyan (الريان)</option>
                    <option value="Al Wakrah">Al Wakrah (الوكرة)</option>
                    <option value="Al Khor">Al Khor (الخور)</option>
                    <option value="Umm Salal">Umm Salal (أم صلال)</option>
                  </select>
                </div>
              </div>

              <Input 
                label={isRtl ? 'العنوان بالتفصيل' : 'Street Address'} 
                placeholder={isRtl ? 'رقم المبنى، الشارع، المنطقة' : 'Building number, Street, Zone'} 
                required 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />

              <h2 className="text-xl font-black text-retro-text pt-4 border-t border-retro-border">{isRtl ? 'طريقة الدفع' : 'Payment Method'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-retro-cyan bg-retro-cyan/5' : 'border-retro-border bg-retro-bg-input hover:border-retro-cyan/30'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => setFormData({...formData, paymentMethod: 'cod'})}
                    className="accent-retro-cyan"
                  />
                  <div>
                    <div className="text-sm font-bold text-retro-text">{isRtl ? 'الدفع عند التوصيل' : 'Cash on Delivery (COD)'}</div>
                    <div className="text-xs text-retro-text-secondary">{isRtl ? 'ادفع نقداً عند باب بيتك' : 'Pay with cash at your doorstep'}</div>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-retro-cyan bg-retro-cyan/5' : 'border-retro-border bg-retro-bg-input hover:border-retro-cyan/30'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="card" 
                    checked={formData.paymentMethod === 'card'}
                    onChange={() => setFormData({...formData, paymentMethod: 'card'})}
                    className="accent-retro-cyan"
                  />
                  <div>
                    <div className="text-sm font-bold text-retro-text">{isRtl ? 'بطاقة الائتمان / الدفع الإلكتروني' : 'Credit / Debit Card'}</div>
                    <div className="text-xs text-retro-text-secondary">{isRtl ? 'ادفع بأمان عبر بوابة الدفع' : 'Secure payment gateway'}</div>
                  </div>
                </label>
              </div>

              <div className="pt-4">
                <Button type="submit" size="lg" fullWidth>
                  {isRtl ? 'إكمال وتأكيد الطلب' : 'Complete Purchase'}
                </Button>
              </div>
            </form>
          </div>

          {/* Cart Summary (Right) */}
          <div className="lg:col-span-2 bg-retro-bg-card border border-retro-border rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-black text-retro-text mb-6 pb-4 border-b border-retro-border">
              {dict.checkout?.orderSummary || 'Order Summary'}
            </h2>

            <div className="space-y-4 max-h-[30vh] overflow-y-auto mb-6 pr-2 scrollbar-thin">
              {items.map((item) => {
                const name = isRtl ? item.product.nameAr : item.product.nameEn;
                const price = item.variation ? (item.variation.salePrice ?? item.variation.sellingPrice) : (item.product.salePrice ?? item.product.sellingPrice);
                return (
                  <div key={`${item.product.id}-${item.variation?.id || ''}`} className="flex justify-between items-start text-sm gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-retro-text truncate">{name}</p>
                      <p className="text-xs text-retro-text-dim">Qty: {item.qty} {item.variation && `• ${item.variation.edition}`}</p>
                    </div>
                    <span className="font-bold text-retro-text shrink-0">
                      {(price * item.qty).toLocaleString()} QAR
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-retro-border space-y-2 mb-6">
              <div className="flex justify-between text-sm text-retro-text-secondary">
                <span>{dict.cart?.subtotal || 'Subtotal'}</span>
                <span>{totalPrice.toLocaleString()} QAR</span>
              </div>
              <div className="flex justify-between text-sm text-retro-text-secondary">
                <span>{isRtl ? 'الشحن' : 'Shipping'}</span>
                <span>{shippingCost === 0 ? (isRtl ? 'مجاني' : 'Free') : `30 QAR`}</span>
              </div>
              <div className="pt-4 border-t border-retro-border flex justify-between text-lg font-black text-retro-text">
                <span>{dict.cart?.total || 'Total'}</span>
                <span className="text-retro-cyan">{grandTotal.toLocaleString()} QAR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
