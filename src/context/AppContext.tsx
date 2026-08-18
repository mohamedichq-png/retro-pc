"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initialProducts, 
  initialCustomers, 
  initialEmployees, 
  initialRepairs, 
  initialTransactions, 
  Product, 
  ProductVariation,
  Customer, 
  Employee, 
  RepairTicket, 
  Transaction 
} from '../data/mockData';
import { supabase } from '../lib/supabase';

export interface CartItem {
  product: Product;
  qty: number;
  variation?: ProductVariation;
}

interface AppContextType {
  // Language & Localization
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
  isRtl: boolean;

  // Toast & Loading
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  loading: boolean;

  // Databases (State)
  products: Product[];
  customers: Customer[];
  employees: Employee[];
  repairs: RepairTicket[];
  transactions: Transaction[];

  // Cart Management
  cart: CartItem[];
  addToCart: (product: Product, qty?: number, variation?: ProductVariation) => void;
  removeFromCart: (productId: string, variationSku?: string) => void;
  updateCartQty: (productId: string, qty: number, variationSku?: string) => void;
  clearCart: () => void;
  cartTotal: number;

  // E-commerce Features
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => void;

  // POS / Checkout Actions
  activeCashier: Employee | null;
  setActiveCashier: (employee: Employee | null) => void;
  checkoutPOS: (paymentDetails: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    paymentMethod: string;
    discountAmount: number;
    splitDetails?: Record<string, number>;
  }) => { success: boolean; invoiceNo: string; error?: string };

  // Repair Management
  bookRepair: (repairData: Omit<RepairTicket, 'id' | 'ticketId' | 'createdAt' | 'updatedAt' | 'finalCost' | 'paidAmount' | 'status'>) => RepairTicket;
  updateRepair: (ticketId: string, updates: Partial<RepairTicket>) => void;

  // ERP Admin Actions
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, qty: number) => void;
  importProducts: (newProducts: Product[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomerPoints: (customerId: string, points: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Arabic-English Translations dictionary
const translations: Record<string, Record<'en' | 'ar', string>> = {
  // General Header & Nav
  "retro": { en: "RETRO", ar: "ريترو" },
  "home": { en: "Home", ar: "الرئيسية" },
  "shop": { en: "E-Commerce", ar: "المتجر الإلكتروني" },
  "pcBuilder": { en: "PC Builder", ar: "باني الحواسيب" },
  "repairCenter": { en: "Repair Hub", ar: "مركز الصيانة" },
  "pos": { en: "POS Terminal", ar: "نقطة البيع" },
  "adminDashboard": { en: "ERP Dashboard", ar: "لوحة التحكم ERP" },
  "languageLabel": { en: "العربية", ar: "English" },
  
  // Hero Section
  "heroTitle": { en: "RETRO - Gaming • Computers • Consoles • Repair", ar: "ريترو - ألعاب • حواسيب • أجهزة ألعاب • صيانة" },
  "heroSubtitle": { en: "Qatar's Premier Enterprise Gaming & Computer Center", ar: "المركز الأول للألعاب والحواسيب المخصصة في قطر" },
  "shopNow": { en: "Shop Now", ar: "تسوق الآن" },
  "bookRepairBtn": { en: "Repair Device", ar: "أصلح جهازك" },
  "buildPcBtn": { en: "Build Your PC", ar: "ابنِ حاسوبك الخاص" },
  
  // Product Cards
  "category": { en: "Category", ar: "الفئة" },
  "condition": { en: "Condition", ar: "الحالة" },
  "stock": { en: "Stock", ar: "المخزون" },
  "lowStock": { en: "Low Stock!", ar: "مخزون منخفض!" },
  "outOfStock": { en: "Out of Stock", ar: "نفذت الكمية" },
  "inStock": { en: "In Stock", ar: "متوفر" },
  "new": { en: "New", ar: "جديد" },
  "used": { en: "Used", ar: "مستعمل" },
  "refurbished": { en: "Refurbished", ar: "مجدد" },
  "addToCartBtn": { en: "Add to Cart", ar: "أضف إلى السلة" },
  "quickView": { en: "Quick View", ar: "عرض سريع" },
  "compare": { en: "Compare", ar: "مقارنة" },
  "currency": { en: "QAR", ar: "ر.ق" },
  
  // PC Builder
  "selectParts": { en: "Select Parts for Your Custom Gaming Rig", ar: "اختر قطع جهاز الألعاب المخصص لك" },
  "pcBuilderTitle": { en: "Interactive Gaming PC Builder", ar: "باني الحواسيب التفاعلي" },
  "compatCheck": { en: "Compatibility Status", ar: "حالة التوافق" },
  "compatOk": { en: "All parts are compatible!", ar: "جميع القطع متوافقة بنجاح!" },
  "compatErr": { en: "Warning: Part incompatibility detected!", ar: "تنبيه: تم رصد تعارض بين بعض القطع!" },
  "estPower": { en: "Estimated Power Draw", ar: "استهلاك الطاقة المقدر" },
  "recommendedPsu": { en: "Recommended PSU", ar: "مزود الطاقة الموصى به" },
  "estFps": { en: "Estimated Game Performance (4K Ultra / Average FPS)", ar: "الأداء المتوقع في الألعاب (أقصى دقة / متوسط الإطارات)" },
  "fpsCyberpunk": { en: "Cyberpunk 2077 (DLSS)", ar: "سايبربانك 2077" },
  "fpsCoD": { en: "Call of Duty: Warzone", ar: "كول أوف ديوتي" },
  "fpsValorant": { en: "Valorant (1080p/4K)", ar: "فالورانت" },
  
  // Repair Center
  "repairBooking": { en: "Book a Repair Appointment", ar: "حجز موعد صيانة" },
  "repairTracker": { en: "Track Your Repair Ticket", ar: "تتبع حالة جهازك" },
  "repairTitle": { en: "Professional Hardware Repair & Service", ar: "صيانة وتجديد الأجهزة الاحترافية" },
  "deviceInfo": { en: "Device Details", ar: "تفاصيل الجهاز" },
  "problemDesc": { en: "Describe the Issue", ar: "وصف العطل" },
  "submitTicket": { en: "Book Repair Session", ar: "حجز جلسة صيانة" },
  "whatsappBooking": { en: "Book via WhatsApp", ar: "حجز سريع عبر واتساب" },
  "ticketIdLabel": { en: "Enter Ticket ID (e.g. RT-2601)", ar: "أدخل رقم تذكرة الصيانة (مثال: RT-2601)" },
  "trackBtn": { en: "Track Status", ar: "تتبع الحالة" },
  "ticketStatus": { en: "Repair Status", ar: "حالة الإصلاح" },
  "techNotes": { en: "Technician Notes", ar: "ملاحظات الفني" },
  
  // POS System
  "posTerminal": { en: "Cashier POS Terminal", ar: "محطة نقاط بيع الكاشير" },
  "barcodeSearch": { en: "Scan Barcode or Search Product...", ar: "امسح الباركود أو ابحث عن منتج..." },
  "paymentMethod": { en: "Payment Method", ar: "طريقة الدفع" },
  "cash": { en: "Cash", ar: "نقداً" },
  "card": { en: "Card", ar: "بطاقة" },
  "applePay": { en: "Apple Pay", ar: "أبل باي" },
  "bankTransfer": { en: "Bank Transfer", ar: "تحويل بنكي" },
  "splitPayments": { en: "Split Payment", ar: "دفع مجزأ" },
  "discount": { en: "Discount (QAR)", ar: "خصم (ر.ق)" },
  "subtotal": { en: "Subtotal", ar: "المجموع الفرعي" },
  "total": { en: "Total Amount", ar: "المجموع الكلي" },
  "payAndPrint": { en: "Process Payment & Print Receipt", ar: "إتمام عملية الدفع وطباعة الفاتورة" },
  
  // ERP Admin
  "erpTitle": { en: "RETRO Enterprise ERP Cockpit", ar: "مركز إدارة الموارد والعمليات ERP" },
  "inventory": { en: "Inventory List", ar: "لائحة المخزون" },
  "crmCustomers": { en: "CRM Customers", ar: "إدارة العملاء CRM" },
  "employeesList": { en: "Employees & Commission", ar: "الموظفون والعمولات" },
  "analytics": { en: "Financial Analytics & P&L", ar: "التحليلات المالية والأرباح والخسائر" },
  "addInventory": { en: "Add Product to Inventory", ar: "إضافة منتج للمخزون" },
  "lowStockAlerts": { en: "Low Stock Warnings", ar: "تنبيهات انخفاض المخزون" },
  "salesToday": { en: "Today's Sales", ar: "مبيعات اليوم" },
  "totalProfit": { en: "Total Gross Profit", ar: "إجمالي الأرباح الصافية" },
  "activeRepairs": { en: "Active Repairs Count", ar: "عدد الأجهزة قيد الصيانة" },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global States
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [repairs, setRepairs] = useState<RepairTicket[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [activeCashier, setActiveCashier] = useState<Employee | null>(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // DB mapping helper functions
  const mapToProduct = (dbRow: any): Product => ({
    id: dbRow.id,
    sku: dbRow.sku,
    barcode: dbRow.barcode || '',
    nameEn: dbRow.name_en,
    nameAr: dbRow.name_ar,
    descriptionEn: dbRow.description_en || '',
    descriptionAr: dbRow.description_ar || '',
    category: dbRow.category,
    subCategory: dbRow.sub_category || '',
    brand: dbRow.brand || '',
    model: dbRow.model || '',
    condition: dbRow.condition || 'New',
    costPrice: Number(dbRow.cost_price),
    sellingPrice: Number(dbRow.selling_price),
    salePrice: dbRow.sale_price ? Number(dbRow.sale_price) : undefined,
    stockQty: Number(dbRow.stock_qty),
    lowStockThreshold: Number(dbRow.low_stock_threshold),
    imageUrl: dbRow.image_url || '',
    galleryUrls: dbRow.gallery_urls || [],
    specs: dbRow.specs || {},
    isDigital: dbRow.is_digital,
    isFeatured: dbRow.is_featured,
    status: dbRow.status || 'published',
    variations: dbRow.variations || undefined,
    
    // Upgraded Fields
    productType: dbRow.product_type || 'PHYSICAL PRODUCT',
    primaryCategory: dbRow.primary_category || '',
    secondaryCategory: dbRow.secondary_category || '',
    platform: dbRow.platform || '',
    generation: dbRow.generation || '',
    categories: dbRow.categories || [],
    tags: dbRow.tags || [],
    collections: dbRow.collections || [],
    reservedQty: Number(dbRow.reserved_qty || 0),
    availableQty: Number(dbRow.available_qty || dbRow.stock_qty || 0),
    stockStatus: dbRow.stock_status || 'IN STOCK',
    warranty: dbRow.warranty || '',
    weight: dbRow.weight || '',
    dimensions: dbRow.dimensions || '',
    relatedProducts: dbRow.related_products || [],
    compatibleProducts: dbRow.compatible_products || [],
    accessories: dbRow.accessories || [],
  });

  const mapToDbProduct = (p: Product) => ({
    id: p.id,
    sku: p.sku,
    barcode: p.barcode || null,
    name_en: p.nameEn,
    name_ar: p.nameAr,
    description_en: p.descriptionEn || null,
    description_ar: p.descriptionAr || null,
    category: p.category,
    sub_category: p.subCategory || null,
    brand: p.brand || null,
    model: p.model || null,
    condition: p.condition,
    cost_price: p.costPrice,
    selling_price: p.sellingPrice,
    sale_price: p.salePrice || null,
    stock_qty: p.stockQty,
    low_stock_threshold: p.lowStockThreshold,
    image_url: p.imageUrl || null,
    gallery_urls: p.galleryUrls || null,
    specs: p.specs || {},
    is_digital: p.isDigital || false,
    is_featured: p.isFeatured || false,
    status: p.status || 'published',
    variations: p.variations || null,
    
    // Upgraded Fields
    product_type: p.productType || 'PHYSICAL PRODUCT',
    primary_category: p.primaryCategory || '',
    secondary_category: p.secondaryCategory || '',
    platform: p.platform || null,
    generation: p.generation || null,
    categories: p.categories || [],
    tags: p.tags || [],
    collections: p.collections || [],
    reserved_qty: p.reservedQty || 0,
    available_qty: p.availableQty || p.stockQty || 0,
    stock_status: p.stockStatus || 'IN STOCK',
    warranty: p.warranty || '',
    weight: p.weight || '',
    dimensions: p.dimensions || '',
    related_products: p.relatedProducts || [],
    compatible_products: p.compatibleProducts || [],
    accessories: p.accessories || [],
  });

  const mapToCustomer = (dbRow: any): Customer => ({
    id: dbRow.id,
    name: dbRow.name,
    phone: dbRow.phone,
    email: dbRow.email || '',
    loyaltyPoints: Number(dbRow.loyalty_points || 0),
    storeCredit: Number(dbRow.store_credit || 0),
    membershipLevel: dbRow.membership_level || 'Bronze',
    outstandingBalance: Number(dbRow.outstanding_balance || 0),
  });

  const mapToDbCustomer = (c: Customer) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email || null,
    loyalty_points: c.loyaltyPoints,
    store_credit: c.storeCredit,
    membership_level: c.membershipLevel,
    outstanding_balance: c.outstandingBalance,
  });

  const mapToRepair = (dbRow: any): RepairTicket => ({
    id: dbRow.id,
    ticketId: dbRow.ticket_id,
    customerName: dbRow.customer_name,
    customerPhone: dbRow.customer_phone,
    deviceType: dbRow.device_type,
    deviceBrand: dbRow.device_brand || '',
    deviceModel: dbRow.device_model || '',
    serialNumber: dbRow.serial_number || '',
    problemDescription: dbRow.problem_description,
    technicianNotes: dbRow.technician_notes || '',
    status: dbRow.status || 'Received',
    priority: dbRow.priority || 'Normal',
    estimatedCost: Number(dbRow.estimated_cost || 0),
    finalCost: Number(dbRow.final_cost || 0),
    paidAmount: Number(dbRow.paid_amount || 0),
    warrantyMonths: Number(dbRow.warranty_months || 0),
    warrantyExpiry: dbRow.warranty_expiry || '',
    technicianId: dbRow.technician_id || undefined,
    imagesUrls: dbRow.images_urls || [],
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
  });

  const mapToDbRepair = (r: RepairTicket) => ({
    id: r.id,
    ticket_id: r.ticketId,
    customer_name: r.customerName,
    customer_phone: r.customerPhone,
    device_type: r.deviceType,
    device_brand: r.deviceBrand || null,
    device_model: r.deviceModel || null,
    serial_number: r.serialNumber || null,
    problem_description: r.problemDescription,
    technician_notes: r.technicianNotes || null,
    status: r.status,
    priority: r.priority,
    estimated_cost: r.estimatedCost,
    final_cost: r.finalCost,
    paid_amount: r.paidAmount,
    warranty_months: r.warrantyMonths,
    warranty_expiry: r.warrantyExpiry || null,
    technician_id: r.technicianId || null,
    images_urls: r.imagesUrls || [],
    created_at: r.createdAt,
    updated_at: r.updatedAt,
  });

  const mapToTransaction = (dbRow: any): Transaction => ({
    id: dbRow.id,
    invoiceNo: dbRow.invoice_no,
    customerName: dbRow.customer_name || 'Walk-in Customer',
    customerPhone: dbRow.customer_phone || 'N/A',
    employeeName: dbRow.employee_name || 'System POS',
    source: dbRow.source || 'POS',
    branch: dbRow.branch || 'Msheireb HQ',
    subtotal: Number(dbRow.subtotal),
    discountAmount: Number(dbRow.discount_amount || 0),
    vatAmount: Number(dbRow.vat_amount || 0),
    totalAmount: Number(dbRow.total_amount),
    profitAmount: Number(dbRow.profit_amount || 0),
    paymentMethod: dbRow.payment_method,
    paymentStatus: dbRow.payment_status || 'Paid',
    items: dbRow.items || [],
    createdAt: dbRow.created_at,
  });

  const mapToDbTransaction = (t: Transaction) => ({
    id: t.id,
    invoice_no: t.invoiceNo,
    customer_name: t.customerName,
    customer_phone: t.customerPhone,
    employee_name: t.employeeName,
    source: t.source,
    branch: t.branch,
    subtotal: t.subtotal,
    discount_amount: t.discountAmount,
    vat_amount: t.vatAmount,
    total_amount: t.totalAmount,
    profit_amount: t.profitAmount,
    payment_method: t.paymentMethod,
    payment_status: t.paymentStatus,
    items: t.items,
    created_at: t.createdAt,
  });

  // Initialize DB from Supabase or LocalStorage Fallback
  useEffect(() => {
    const localLang = localStorage.getItem('retro_lang');
    if (localLang === 'ar' || localLang === 'en') {
      setLanguage(localLang);
    }

    const loadLocalData = () => {
      const loadData = <T,>(key: string, fallback: T): T => {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
      };

      // Version-based cache invalidation for products
      // Increment this version string whenever initialProducts is updated
      const PRODUCTS_VERSION = 'v2026-08-15-consoles-hd-final';
      const storedVersion = localStorage.getItem('retro_products_version');
      if (storedVersion !== PRODUCTS_VERSION) {
        // Clear old cached products and reset to latest initialProducts
        localStorage.removeItem('retro_products');
        localStorage.setItem('retro_products_version', PRODUCTS_VERSION);
        setProducts(initialProducts);
      } else {
        setProducts(loadData('retro_products', initialProducts));
      }

      setCustomers(loadData('retro_customers', initialCustomers));
      setEmployees(loadData('retro_employees', initialEmployees));
      setRepairs(loadData('retro_repairs', initialRepairs));
      setTransactions(loadData('retro_transactions', initialTransactions));

      
      const emps = loadData('retro_employees', initialEmployees);
      const defaultCashier = emps.find(e => e.role === 'cashier' || e.role === 'manager') || emps[0];
      setActiveCashier(defaultCashier);
    };

    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (isSupabaseConfigured) {
      setLoading(true);
      const fetchSupabaseData = async () => {
        try {
          // Fetch products with timeout protection
          const { data: pData, error: pError } = await supabase.from('products').select('*');
          if (!pError && pData && pData.length > 0) {
            setProducts(pData.map(mapToProduct));
          } else {
            loadLocalData();
          }

          // Fetch customers
          const { data: cData, error: cError } = await supabase.from('customers').select('*');
          if (!cError && cData && cData.length > 0) {
            setCustomers(cData.map(mapToCustomer));
          }

          // Fetch employees
          const { data: eData, error: eError } = await supabase.from('employees').select('*');
          if (!eError && eData && eData.length > 0) {
            setEmployees(eData);
          }

          // Fetch repairs
          const { data: rData, error: rError } = await supabase.from('repairs').select('*');
          if (!rError && rData) {
            setRepairs(rData.map(mapToRepair));
          }

          // Fetch transactions
          const { data: tData, error: tError } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
          if (!tError && tData) {
            setTransactions(tData.map(mapToTransaction));
          }
        } catch {
          // Graceful fallback to verified local dataset
          loadLocalData();
        } finally {
          setLoading(false);
        }
      };

      fetchSupabaseData();
    } else {
      loadLocalData();
    }
  }, []);

  // Save changes helper
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Language translation helper
  const t = (key: string): string => {
    const val = translations[key];
    if (!val) return key;
    return val[language];
  };

  const isRtl = language === 'ar';

  useEffect(() => {
    localStorage.setItem('retro_lang', language);
  }, [language]);

  // Cart logic
  const addToCart = (product: Product, qty: number = 1, variation?: ProductVariation) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.variation?.sku === variation?.sku);
      let updated;
      if (existing) {
        updated = prev.map(item => 
          (item.product.id === product.id && item.variation?.sku === variation?.sku) ? { ...item, qty: item.qty + qty } : item
        );
      } else {
        updated = [...prev, { product, qty, variation }];
      }
      return updated;
    });
  };

  const removeFromCart = (productId: string, variationSku?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.variation?.sku === variationSku)));
  };

  const updateCartQty = (productId: string, qty: number, variationSku?: string) => {
    setCart(prev => prev.map(item => 
      (item.product.id === productId && item.variation?.sku === variationSku) ? { ...item, qty: Math.max(1, qty) } : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => {
    let price = item.product.salePrice ?? item.product.sellingPrice;
    if (item.variation) {
      price = item.variation.salePrice ?? item.variation.sellingPrice;
    }
    return total + (price * item.qty);
  }, 0);

  // E-commerce logic
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const updated = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      return updated;
    });
  };

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) return prev; // Max 3 items
      return [...prev, product];
    });
  };

  // Checkout logic (POS & Online)
  const checkoutPOS = (paymentDetails: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    paymentMethod: string;
    discountAmount: number;
    splitDetails?: Record<string, number>;
  }) => {
    if (cart.length === 0) {
      return { success: false, invoiceNo: '', error: 'Cart is empty' };
    }

    // Check Stock
    for (const item of cart) {
      if (item.variation) {
        if (item.variation.stockQty < item.qty) {
          return { 
            success: false, 
            invoiceNo: '', 
            error: `Insufficient stock for ${language === 'ar' ? item.product.nameAr : item.product.nameEn} (${item.variation.edition})` 
          };
        }
      } else if (item.product.stockQty < item.qty) {
        return { 
          success: false, 
          invoiceNo: '', 
          error: `Insufficient stock for ${language === 'ar' ? item.product.nameAr : item.product.nameEn}` 
        };
      }
    }

    const sub = cartTotal;
    const disc = paymentDetails.discountAmount;
    const finalTotal = Math.max(0, sub - disc);
    
    // Calculate Profit & Cost
    const totalCost = cart.reduce((acc, item) => {
      const cost = item.variation ? item.variation.costPrice : item.product.costPrice;
      return acc + (cost * item.qty);
    }, 0);
    const profit = finalTotal - totalCost;

    // Create Invoice Number
    const invoiceNo = `INV-RETRO-${Date.now().toString().slice(-6)}`;

    // Update product stocks
    const updatedProducts = products.map(prod => {
      const cartItemsForProd = cart.filter(ci => ci.product.id === prod.id);
      if (cartItemsForProd.length > 0) {
        let updatedProd = { ...prod };
        for (const cartItem of cartItemsForProd) {
          if (cartItem.variation && updatedProd.variations) {
            updatedProd.variations = updatedProd.variations.map(v => 
              v.sku === cartItem.variation!.sku ? { ...v, stockQty: Math.max(0, v.stockQty - cartItem.qty) } : v
            );
          } else {
            updatedProd.stockQty = Math.max(0, updatedProd.stockQty - cartItem.qty);
          }
        }
        return updatedProd;
      }
      return prod;
    });

    setProducts(updatedProducts);
    saveState('retro_products', updatedProducts);

    // Update Customer CRM Points / credit if registered
    let updatedCustomers = [...customers];
    if (paymentDetails.customerId || paymentDetails.customerPhone) {
      const targetPhone = paymentDetails.customerPhone;
      const customerIndex = customers.findIndex(c => c.phone === targetPhone);
      
      const pointsEarned = Math.floor(finalTotal / 10); // 1 point for every 10 QAR
      
      if (customerIndex !== -1) {
        updatedCustomers = customers.map((cust, idx) => {
          if (idx === customerIndex) {
            const nextPoints = cust.loyaltyPoints + pointsEarned;
            let level = cust.membershipLevel;
            if (nextPoints > 3000) level = 'Platinum';
            else if (nextPoints > 1500) level = 'Gold';
            else if (nextPoints > 500) level = 'Silver';

            return {
              ...cust,
              loyaltyPoints: nextPoints,
              membershipLevel: level
            };
          }
          return cust;
        });
      } else {
        // Create new customer profile
        const newCust: Customer = {
          id: `c-${Date.now()}`,
          name: paymentDetails.customerName || 'Walk-in Customer',
          phone: paymentDetails.customerPhone,
          loyaltyPoints: pointsEarned,
          storeCredit: 0,
          membershipLevel: pointsEarned > 500 ? 'Silver' : 'Bronze',
          outstandingBalance: 0
        };
        updatedCustomers.push(newCust);
      }
      setCustomers(updatedCustomers);
      saveState('retro_customers', updatedCustomers);
    }

    // Register Transaction
    const newTx: Transaction = {
      id: `t-${Date.now()}`,
      invoiceNo,
      customerName: paymentDetails.customerName || 'Walk-in Customer',
      customerPhone: paymentDetails.customerPhone || 'N/A',
      employeeName: activeCashier?.nameEn || 'System POS',
      source: 'POS',
      branch: 'Msheireb HQ',
      subtotal: sub,
      discountAmount: disc,
      vatAmount: 0,
      totalAmount: finalTotal,
      profitAmount: profit,
      paymentMethod: paymentDetails.paymentMethod,
      paymentStatus: 'Paid',
      items: cart.map(item => ({
        productId: item.product.id,
        sku: item.variation?.sku ?? item.product.sku,
        nameEn: item.variation ? `${item.product.nameEn} - ${item.variation.edition} (${item.variation.condition})` : item.product.nameEn,
        nameAr: item.variation ? `${item.product.nameAr} - ${item.variation.edition} (${item.variation.condition})` : item.product.nameAr,
        qty: item.qty,
        price: item.variation ? (item.variation.salePrice ?? item.variation.sellingPrice) : (item.product.salePrice ?? item.product.sellingPrice),
        cost: item.variation ? item.variation.costPrice : item.product.costPrice
      })),
      createdAt: new Date().toISOString()
    };

    const newTxs = [newTx, ...transactions];
    setTransactions(newTxs);
    saveState('retro_transactions', newTxs);

    // Sync checkout details to Supabase if configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (isSupabaseConfigured) {
      const syncCheckout = async () => {
        try {
          // 1. Insert transaction
          const dbTx = mapToDbTransaction(newTx);
          await supabase.from('transactions').insert(dbTx);

          // 2. Update stock quantities in DB
          for (const item of cart) {
            if (item.variation) {
              const pData = updatedProducts.find(p => p.id === item.product.id);
              if (pData) {
                await supabase.from('products').update({ variations: pData.variations }).eq('id', item.product.id);
              }
            } else {
              const nextStock = Math.max(0, item.product.stockQty - item.qty);
              await supabase.from('products').update({ stock_qty: nextStock }).eq('id', item.product.id);
            }
          }

          // 3. Update or Insert Customer
          if (paymentDetails.customerId || paymentDetails.customerPhone) {
            const phone = paymentDetails.customerPhone;
            const customer = updatedCustomers.find(c => c.phone === phone);
            if (customer) {
              const dbCust = mapToDbCustomer(customer);
              await supabase.from('customers').upsert(dbCust, { onConflict: 'phone' });
            }
          }
          showToast(language === 'ar' ? 'تمت عملية البيع ومزامنتاً سحابياً!' : 'Sale processed and synced to cloud!', 'success');
        } catch (err) {
          console.error("Supabase POS checkout sync failed:", err);
          showToast(language === 'ar' ? 'تم البيع بنجاح (فشل مزامنة السحابة)' : 'Sale processed (cloud sync failed)', 'info');
        }
      };
      syncCheckout();
    } else {
      showToast(language === 'ar' ? 'تم إتمام البيع بنجاح!' : 'Sale processed successfully!', 'success');
    }

    // Clear cart on successful POS checkout
    setCart([]);

    return { success: true, invoiceNo };
  };

  // Book a repair
  const bookRepair = (repairData: Omit<RepairTicket, 'id' | 'ticketId' | 'createdAt' | 'updatedAt' | 'finalCost' | 'paidAmount' | 'status'>) => {
    const ticketId = `RT-${Date.now().toString().slice(-4)}`;
    
    const newTicket: RepairTicket = {
      ...repairData,
      id: `r-${Date.now()}`,
      ticketId,
      status: 'Received',
      finalCost: repairData.estimatedCost,
      paidAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedRepairs = [newTicket, ...repairs];
    setRepairs(updatedRepairs);
    saveState('retro_repairs', updatedRepairs);

    // Sync to Supabase
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (isSupabaseConfigured) {
      const syncRepair = async () => {
        try {
          const dbRepair = mapToDbRepair(newTicket);
          await supabase.from('repairs').insert(dbRepair);
          showToast(language === 'ar' ? 'تم تسجيل الصيانة ومزامنتها!' : 'Repair booked and synced!', 'success');
        } catch (err) {
          console.error("Supabase repair booking failed:", err);
          showToast(language === 'ar' ? 'تم حجز الصيانة محلياً' : 'Repair booked locally', 'info');
        }
      };
      syncRepair();
    } else {
      showToast(language === 'ar' ? 'تم تسجيل الصيانة بنجاح!' : 'Repair booked successfully!', 'success');
    }

    return newTicket;
  };

  // Update repair ticket
  const updateRepair = (ticketId: string, updates: Partial<RepairTicket>) => {
    let updatedTicket: RepairTicket | undefined;
    const updated = repairs.map(rep => {
      if (rep.ticketId === ticketId) {
        updatedTicket = {
          ...rep,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        return updatedTicket;
      }
      return rep;
    });
    setRepairs(updated);
    saveState('retro_repairs', updated);

    // Sync to Supabase
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (isSupabaseConfigured && updatedTicket) {
      const syncUpdate = async () => {
        try {
          const dbRepair = mapToDbRepair(updatedTicket!);
          await supabase.from('repairs').update(dbRepair).eq('ticket_id', ticketId);
          showToast(language === 'ar' ? 'تم تحديث تذكرة الصيانة بنجاح!' : 'Repair ticket updated successfully!', 'success');
        } catch (err) {
          console.error("Supabase repair update failed:", err);
          showToast(language === 'ar' ? 'تم تحديث التذكرة محلياً' : 'Repair updated locally', 'info');
        }
      };
      syncUpdate();
    } else {
      showToast(language === 'ar' ? 'تم تحديث الصيانة محلياً!' : 'Repair updated locally!', 'success');
    }
  };

  // ERP Product / Inventory updates
  const addProduct = (product: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.sku === product.sku);
      let updated;
      if (exists) {
        updated = prev.map(p => p.sku === product.sku ? product : p);
      } else {
        updated = [product, ...prev];
      }
      saveState('retro_products', updated);
      return updated;
    });

    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (isSupabaseConfigured) {
      const syncAdd = async () => {
        try {
          const dbProduct = mapToDbProduct(product);
          await supabase.from('products').upsert(dbProduct, { onConflict: 'sku' });
          showToast(language === 'ar' ? 'تم حفظ ونشر المنتج سحابياً!' : 'Product saved and synced to cloud!', 'success');
        } catch (err) {
          console.error("Supabase addProduct failed:", err);
          showToast(language === 'ar' ? 'تم حفظ المنتج محلياً' : 'Product saved locally', 'info');
        }
      };
      syncAdd();
    } else {
      showToast(language === 'ar' ? 'تم حفظ المنتج محلياً بنجاح!' : 'Product saved locally successfully!', 'success');
    }
  };

  const updateProductStock = (productId: string, qty: number) => {
    let updatedProduct: Product | undefined;
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === productId) {
          updatedProduct = { ...p, stockQty: Math.max(0, qty) };
          return updatedProduct;
        }
        return p;
      });
      saveState('retro_products', updated);
      return updated;
    });

    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (isSupabaseConfigured && updatedProduct) {
      const syncStock = async () => {
        try {
          await supabase.from('products').update({ stock_qty: Math.max(0, qty) }).eq('id', productId);
          showToast(language === 'ar' ? 'تم تحديث المخزون بنجاح!' : 'Stock updated successfully!', 'success');
        } catch (err) {
          console.error("Supabase updateProductStock failed:", err);
        }
      };
      syncStock();
    } else {
      showToast(language === 'ar' ? 'تم تعديل المخزون محلياً!' : 'Stock adjusted locally!', 'success');
    }
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    let updatedProduct: Product | undefined;
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === productId) {
          updatedProduct = { ...p, ...updates };
          return updatedProduct;
        }
        return p;
      });
      saveState('retro_products', updated);
      return updated;
    });

    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (isSupabaseConfigured && updatedProduct) {
      const syncUpdate = async () => {
        try {
          const dbProduct = mapToDbProduct(updatedProduct!);
          await supabase.from('products').update(dbProduct).eq('id', productId);
          showToast(language === 'ar' ? 'تم تعديل تفاصيل المنتج!' : 'Product details modified!', 'success');
        } catch (err) {
          console.error("Supabase updateProduct failed:", err);
          showToast(language === 'ar' ? 'تم التعديل محلياً' : 'Changes saved locally', 'info');
        }
      };
      syncUpdate();
    } else {
      showToast(language === 'ar' ? 'تم حفظ التعديلات محلياً!' : 'Changes saved locally!', 'success');
    }
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      saveState('retro_products', updated);
      return updated;
    });

    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (isSupabaseConfigured) {
      const syncDelete = async () => {
        try {
          await supabase.from('products').delete().eq('id', productId);
          showToast(language === 'ar' ? 'تم حذف المنتج من السحابة!' : 'Product deleted from cloud!', 'success');
        } catch (err) {
          console.error("Supabase deleteProduct failed:", err);
          showToast(language === 'ar' ? 'تم الحذف محلياً' : 'Product deleted locally', 'info');
        }
      };
      syncDelete();
    } else {
      showToast(language === 'ar' ? 'تم حذف المنتج محلياً!' : 'Product deleted locally!', 'success');
    }
  };

  const importProducts = (newProducts: Product[]) => {
    if (!Array.isArray(newProducts) || newProducts.length === 0) return;
    setProducts(newProducts);
    saveState('retro_products', newProducts);
    localStorage.setItem('retro_products_version', 'v2026-08-18-imported-custom');
    showToast(language === 'ar' ? `تم استيراد ${newProducts.length} منتج بنجاح!` : `Imported ${newProducts.length} products!`, 'success');
  };

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => {
      const updated = [...prev, customer];
      saveState('retro_customers', updated);
      return updated;
    });
  };

  const updateCustomerPoints = (customerId: string, points: number) => {
    setCustomers(prev => {
      const updated = prev.map(c => c.id === customerId ? { ...c, loyaltyPoints: points } : c);
      saveState('retro_customers', updated);
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      isRtl,
      toast,
      showToast,
      loading,
      products,
      customers,
      employees,
      repairs,
      transactions,
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      cartTotal,
      compareList,
      toggleCompare,
      wishlist,
      toggleWishlist,
      activeCashier,
      setActiveCashier,
      checkoutPOS,
      bookRepair,
      updateRepair,
      addProduct,
      updateProduct,
      deleteProduct,
      updateProductStock,
      importProducts,
      addCustomer,
      updateCustomerPoints
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
