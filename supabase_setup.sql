-- Create a generic table to store JSON settings (like Visual Categories and Banners)
CREATE TABLE IF NOT EXISTS store_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist to avoid duplicate policy error
DROP POLICY IF EXISTS "Public Read Access" ON store_settings;
DROP POLICY IF EXISTS "Public Write Access" ON store_settings;

-- Allow anyone to read the settings
CREATE POLICY "Public Read Access"
  ON store_settings
  FOR SELECT
  USING (true);

-- Allow anyone to update/insert the settings
CREATE POLICY "Public Write Access"
  ON store_settings
  FOR ALL
  USING (true);

-- Insert / Update the default Visual Categories data
INSERT INTO store_settings (id, data) VALUES (
  'visual_categories',
  '[
    { "id": "gaming-pcs", "link": "/products?category=pc&subCategory=gaming-pcs", "icon": "🖥️", "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80", "accent": "cyan", "nameAr": "تجميعات Gaming PC", "nameEn": "Gaming PCs" },
    { "id": "gpus", "link": "/products?category=pc&subCategory=gpus", "icon": "⚡", "image": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80", "accent": "cyan", "nameAr": "كروت الشاشة", "nameEn": "Graphics Cards" },
    { "id": "cpus", "link": "/products?category=pc&subCategory=cpus", "icon": "⚙️", "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80", "accent": "purple", "nameAr": "المعالجات", "nameEn": "Processors" },
    { "id": "motherboards", "link": "/products?category=pc&subCategory=motherboards", "icon": "🧩", "image": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&auto=format&fit=crop&q=80", "accent": "purple", "nameAr": "اللوحات الرئيسية", "nameEn": "Motherboards" },
    { "id": "ram", "link": "/products?category=pc&subCategory=ram", "icon": "💾", "image": "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&auto=format&fit=crop&q=80", "accent": "cyan", "nameAr": "الذاكرة RAM", "nameEn": "RAM Memory" },
    { "id": "ssd", "link": "/products?category=pc&subCategory=storage", "icon": "💽", "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80", "accent": "cyan", "nameAr": "وحدات التخزين SSD", "nameEn": "SSD Storage" },
    { "id": "monitors", "link": "/products?category=pc&subCategory=monitors", "icon": "📺", "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80", "accent": "purple", "nameAr": "الشاشات", "nameEn": "Monitors" },
    { "id": "playstation", "link": "/products?category=playstation", "icon": "🎮", "image": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&auto=format&fit=crop&q=80", "accent": "cyan", "nameAr": "PlayStation", "nameEn": "PlayStation" },
    { "id": "xbox", "link": "/products?category=xbox", "icon": "🟩", "image": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&auto=format&fit=crop&q=80", "accent": "green", "nameAr": "Xbox", "nameEn": "Xbox" },
    { "id": "nintendo", "link": "/products?category=nintendo", "icon": "🔴", "image": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&auto=format&fit=crop&q=80", "accent": "pink", "nameAr": "Nintendo", "nameEn": "Nintendo" },
    { "id": "retro-gaming", "link": "/products?category=retro-games", "icon": "🕹️", "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80", "accent": "purple", "nameAr": "Retro Gaming", "nameEn": "Retro Gaming" },
    { "id": "accessories", "link": "/products?category=consoles-accessories", "icon": "🎧", "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80", "accent": "cyan", "nameAr": "ملحقات Gaming", "nameEn": "Gaming Accessories" }
  ]'::jsonb
) 
ON CONFLICT (id) DO UPDATE 
SET data = EXCLUDED.data, updated_at = NOW();

-- Insert / Update the default Offer Slides (Banners) data
INSERT INTO store_settings (id, data) VALUES (
  'offer_slides',
  '[
    { "key": "slide-mega-deals", "ctaAr": "تسوق العروض الآن", "ctaEn": "Shop Deals", "tagAr": "عرض لفترة محدودة", "tagEn": "MEGA DEALS", "ctaLink": "/products", "titleAr": "عروض ريترو الكبرى — خصم يصل إلى 30%", "titleEn": "Retro Mega Offers — Up to 30% Off", "gradient": "from-retro-cyan-dim/50 via-retro-bg-secondary to-retro-bg", "glowColor": "cyan", "subtitleAr": "أقوى حواسيب قيمنق مزودة بكروت شاشة RTX 4090 مع ضمان عامين كاملين.", "subtitleEn": "The strongest prebuilt gaming systems equipped with RTX 4090 graphic cards with a 2-year warranty." },
    { "key": "slide-pc-builder", "ctaAr": "ابدأ التجميع", "ctaEn": "Start Builder", "tagAr": "تركيب وتطوير", "tagEn": "CUSTOMIZE RIG", "ctaLink": "/pc-builder", "titleAr": "ابنِ حاسوب أحلامك الآن", "titleEn": "Build Your Custom PC", "gradient": "from-retro-purple-dim/50 via-retro-bg-secondary to-retro-bg", "glowColor": "purple", "subtitleAr": "أطلق العنان للقوة الكاملة. استخدم محاكي التركيب التفاعلي للقطع مع فحص التوافق التلقائي للجهد والمقابس.", "subtitleEn": "Unleash extreme power. Use our step-by-step interactive simulator with dynamic compatibility checks." },
    { "key": "slide-repair-hub", "ctaAr": "احجز صيانة لجهازك", "ctaEn": "Book a Repair", "tagAr": "صيانة فورية", "tagEn": "REPAIR SERVICES", "ctaLink": "/repair", "titleAr": "مركز صيانة الأجهزة المعتمد", "titleEn": "Certified Repair Hub", "gradient": "from-retro-pink/10 via-retro-bg-secondary to-retro-bg", "glowColor": "pink", "subtitleAr": "من استبدال منافذ العرض إلى إعادة تلحيم مكثفات البورد لأجهزة سيغا ونينتندو. احصل على تذكرة فحص مجانية.", "subtitleEn": "From screen swap to professional recap on Sega, Nintendo and retro chips. Get a free diagnostics ticket." },
    { "key": "slide-retro-classics", "ctaAr": "تصفح أجهزة الريترو", "ctaEn": "Explore Retro", "tagAr": "أساطير زمان", "tagEn": "RETRO LEGENDS", "ctaLink": "/category/retro-gaming", "titleAr": "توفير أجهزة ألعاب كلاسيكية نادرة", "titleEn": "Classic Console Restocks", "gradient": "from-retro-purple-dim/40 via-retro-cyan-dim/20 to-retro-bg", "glowColor": "purple", "subtitleAr": "أجهزة قيم بوي الملونة، وألعاب زمان، وتعديلات الشاشات المضيئة. استعد ذكريات الطفولة الجميلة.", "subtitleEn": "Handhelds, original games, and custom modded retro hardware. Relive your childhood gaming days." }
  ]'::jsonb
) 
ON CONFLICT (id) DO UPDATE 
SET data = EXCLUDED.data, updated_at = NOW();
