-- ==============================================================================
-- RETRO Qatar — Complete 200 Products Schema & Import Script for Supabase
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create products table if it does not exist
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    main_category VARCHAR(100),
    section VARCHAR(100),
    source VARCHAR(50) DEFAULT 'POS',
    brand VARCHAR(100),
    model VARCHAR(100),
    condition VARCHAR(50) DEFAULT 'PRE-OWNED',
    cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    sale_price DECIMAL(10, 2),
    vat_rate DECIMAL(5, 2) DEFAULT 0.00,
    stock_qty INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 1,
    image_url TEXT,
    gallery_urls TEXT[],
    specs JSONB,
    is_digital BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'published',
    slug TEXT,
    product_type VARCHAR(100) DEFAULT 'RETRO PRODUCT',
    primary_category VARCHAR(255),
    secondary_category VARCHAR(255),
    platform VARCHAR(100),
    generation VARCHAR(100),
    categories TEXT[],
    tags TEXT[],
    collections TEXT[],
    reserved_qty INT DEFAULT 0,
    available_qty INT DEFAULT 0,
    stock_status VARCHAR(50) DEFAULT 'IN STOCK',
    warranty VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Ensure all columns exist (for existing tables)
ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS sub_category VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS main_category VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS section VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'POS';
ALTER TABLE products ADD COLUMN IF NOT EXISTS platform VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS generation VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type VARCHAR(100) DEFAULT 'RETRO PRODUCT';
ALTER TABLE products ADD COLUMN IF NOT EXISTS primary_category VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS secondary_category VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published';
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_qty INT DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INT DEFAULT 1;

-- 4. Enable Row Level Security (RLS) and Public Read Access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access" ON products;
CREATE POLICY "Public Read Access"
  ON products
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public Full Access" ON products;
CREATE POLICY "Public Full Access"
  ON products
  FOR ALL
  USING (true);

-- 5. Insert / Update all 200 Products
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030930029807', '5030930029807', '007 Agent Under Fire', '007 Agent Under Fire', '007 Agent Under Fire for GameCube. Pre-owned authentic item from Retro Qatar verified inventory.', '007 Agent Under Fire لمنصة GameCube. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'GameCube', 'GameCube', 'Nintendo', 'GameCube', 'PRE-OWNED', 220, 220, 1, 1, '/media/products/inventory-200/rq-0001-5030930029807-007-agent-under-fire.jpg', '{"platform":"GameCube","platformGeneration":"GameCube","productKind":"Game","sourceInventoryPage":1,"originalInventoryCategory":"Nintendo/GameCube","imageMatchStatus":"Exact barcode/title/platform","sourceUrl":"https://vgcollect.com/item/60788","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', '007-agent-under-fire-gamecube-0001')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030930036065', '5030930036065', '007 Nightfire', '007 Nightfire', '007 Nightfire for GameCube. Pre-owned authentic item from Retro Qatar verified inventory.', '007 Nightfire لمنصة GameCube. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'GameCube', 'GameCube', 'Nintendo', 'GameCube', 'PRE-OWNED', 220, 220, 1, 1, '/media/products/inventory-200/rq-0002-5030930036065-007-nightfire.jpg', '{"platform":"GameCube","platformGeneration":"GameCube","productKind":"Game","sourceInventoryPage":1,"originalInventoryCategory":"Nintendo/GameCube","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.thevideogamecompany.com/products/james-bond-007-nightfire-nintendo-gamecube","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', '007-nightfire-gamecube-0002')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633097498', '014633097498', '007 Tomorrow Never Dies', '007 Tomorrow Never Dies', '007 Tomorrow Never Dies for PlayStation 1. Pre-owned authentic item from Retro Qatar verified inventory.', '007 Tomorrow Never Dies لمنصة PlayStation 1. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 1', 'PS1', 'Sony', 'PS1', 'PRE-OWNED', 150, 150, 2, 1, '/media/products/inventory-200/rq-0003-014633097498-007-tomorrow-never-dies.jpg', '{"platform":"PlayStation 1","platformGeneration":"PS1","productKind":"Game","sourceInventoryPage":1,"originalInventoryCategory":"PlayStation/PS1","imageMatchStatus":"Title/platform verified","sourceUrl":"https://retronorthgames.com/products/007-tomorrow-never-dies-ps1","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', '007-tomorrow-never-dies-playstation-1-0003')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('711719604785', '711719604785', '24 The Game', '24 The Game', '24 The Game for PlayStation 2. Pre-owned authentic item from Retro Qatar verified inventory.', '24 The Game لمنصة PlayStation 2. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 2', 'PS2', 'Sony', 'PS2', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0004-711719604785-24-the-game.jpg', '{"platform":"PlayStation 2","platformGeneration":"PS2","productKind":"Game","sourceInventoryPage":2,"originalInventoryCategory":"PlayStation/PS2","imageMatchStatus":"Title/platform verified","sourceUrl":"https://www.meugameusado.com.br/jogo-24-the-game-ps2","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', '24-the-game-playstation-2-0004')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('879278340114', '879278340114', '30 Great Games', '30 Great Games', '30 Great Games for Wii. Pre-owned authentic item from Retro Qatar verified inventory.', '30 Great Games لمنصة Wii. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Wii', 'Wii', 'Nintendo', 'Wii', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0005-879278340114-30-great-games.jpg', '{"platform":"Wii","platformGeneration":"Wii","productKind":"Game","sourceInventoryPage":3,"originalInventoryCategory":"Nintendo/Wii","imageMatchStatus":"Title/platform verified; barcode variant review","sourceUrl":"https://www.thevideogamecompany.com/products/family-party-30-great-games-nintendo-wii","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', '30-great-games-wii-0005')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917025600', '5030917025600', 'A Series Of Unfortun Events', 'A Series Of Unfortun Events', 'A Series Of Unfortun Events for GameCube. Pre-owned authentic item from Retro Qatar verified inventory.', 'A Series Of Unfortun Events لمنصة GameCube. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'GameCube', 'GameCube', 'Nintendo', 'GameCube', 'PRE-OWNED', 220, 220, 1, 1, '/media/products/inventory-200/rq-0006-5030917025600-a-series-of-unfortun-events.jpg', '{"platform":"GameCube","platformGeneration":"GameCube","productKind":"Game","sourceInventoryPage":6,"originalInventoryCategory":"Nintendo/GameCube","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.estarland.com/product-description/GameCube/Lemony-Snickets-A-Series-of-Unfortunate-Events/18262","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'a-series-of-unfortun-events-gamecube-0006')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('722674021104', '722674021104', 'Ace Combat 04', 'Ace Combat 04', 'Ace Combat 04 for PlayStation 2. Pre-owned authentic item from Retro Qatar verified inventory.', 'Ace Combat 04 لمنصة PlayStation 2. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 2', 'PS2', 'Sony', 'PS2', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0007-722674021104-ace-combat-04.jpg', '{"platform":"PlayStation 2","platformGeneration":"PS2","productKind":"Game","sourceInventoryPage":6,"originalInventoryCategory":"PlayStation/PS2","imageMatchStatus":"Title/platform verified","sourceUrl":"https://www.spankyslootstash.com/products/ace-combat-04-shattered-skies-playstation-2","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'ace-combat-04-playstation-2-0007')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('4036636010126', '4036636010126', 'AeroWings', 'AeroWings', 'AeroWings for Dreamcast. Pre-owned authentic item from Retro Qatar verified inventory.', 'AeroWings لمنصة Dreamcast. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Dreamcast', 'Dreamcast', 'Sega', 'Dreamcast', 'PRE-OWNED', 250, 250, 1, 1, '/media/products/inventory-200/rq-0008-4036636010126-aerowings.jpg', '{"platform":"Dreamcast","platformGeneration":"Dreamcast","productKind":"Game","sourceInventoryPage":7,"originalInventoryCategory":"Sega/Dreamcast","imageMatchStatus":"Title/platform verified; PAL artwork review","sourceUrl":"https://shinkretrogamer.substack.com/p/fly-with-aerowings-and-aerowings","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'aerowings-dreamcast-0008')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('719593130017', '719593130017', 'Afrika', 'Afrika', 'Afrika for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Afrika لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 0, 2, 1, '/media/products/inventory-200/rq-0009-719593130017-afrika.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":7,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Exact barcode/title/platform","sourceUrl":"https://loja-dinossauro-games.lojaintegrada.com.br/afrika-ps3-japones","barcodeIsNumeric":true,"needsPriceReview":true,"currency":"QAR"}'::jsonb, false, 'draft', 'afrika-playstation-3-0009')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('882224043304', '882224043304', 'Age Of Empires', 'Age Of Empires', 'Age Of Empires for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Age Of Empires لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0010-882224043304-age-of-empires.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":8,"originalInventoryCategory":"PC/Games","imageMatchStatus":"Title/platform inferred as Age of Empires III; review edition","sourceUrl":"https://www.ageofempires.com/buy-now/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'age-of-empires-pc-0010')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5055277024926', '5055277024926', 'Alien Isolation Nostromo Edition', 'Alien Isolation Nostromo Edition', 'Alien Isolation Nostromo Edition for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Alien Isolation Nostromo Edition لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0011-5055277024926-alien-isolation-nostromo-edition.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":8,"originalInventoryCategory":"Xbox/Xbox One","imageMatchStatus":"Title/edition/platform verified","sourceUrl":"https://www.falabella.com/falabella-cl/product/152996368/alien-isolation-nostromo-edition-xbox-one/152996369","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'alien-isolation-nostromo-edition-xbox-one-0011')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5055277004706', '5055277004706', 'Aliens VS Predator', 'Aliens VS Predator', 'Aliens VS Predator for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Aliens VS Predator لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0012-5055277004706-aliens-vs-predator.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":8,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.stopgames.com.br/aliens-vs-predator-seminovo-ps3","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'aliens-vs-predator-playstation-3-0012')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('710425391590', '710425391590', 'All Pro Football 2K8', 'All Pro Football 2K8', 'All Pro Football 2K8 for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'All Pro Football 2K8 لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0013-710425391590-all-pro-football-2k8.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":9,"originalInventoryCategory":"Xbox/Xbox 360","imageMatchStatus":"Title/platform verified","sourceUrl":"https://www.walmart.com/ip/5716053","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'all-pro-football-2k8-xbox-360-0013')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('752919552483', '752919552483', 'WWE All Stars', 'WWE All Stars', 'WWE All Stars for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'WWE All Stars لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0014-752919552483-wwe-all-stars.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":9,"originalInventoryCategory":"Xbox/Xbox 360","imageMatchStatus":"Title/platform verified","sourceUrl":"https://www.walmart.com/ip/14904958","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'wwe-all-stars-xbox-360-0014')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3546430124314', '3546430124314', 'Alone In The Dark', 'Alone In The Dark', 'Alone In The Dark for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Alone In The Dark لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0015-3546430124314-alone-in-the-dark.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":9,"originalInventoryCategory":"Xbox/Xbox 360","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.gbhbl.com/alone-in-the-dark-x-box-360/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'alone-in-the-dark-xbox-360-0015')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3546430010976', '3546430010976', 'Alone In The Dark The New Nightmare', 'Alone In The Dark The New Nightmare', 'Alone In The Dark The New Nightmare for PlayStation 1. Pre-owned authentic item from Retro Qatar verified inventory.', 'Alone In The Dark The New Nightmare لمنصة PlayStation 1. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 1', 'PS1', 'Sony', 'PS1', 'PRE-OWNED', 200, 200, 1, 1, '/media/products/inventory-200/rq-0016-3546430010976-alone-in-the-dark-the-new-nightmare.jpg', '{"platform":"PlayStation 1","platformGeneration":"PS1","productKind":"Game","sourceInventoryPage":10,"originalInventoryCategory":"PlayStation/PS1","imageMatchStatus":"Title/platform verified","sourceUrl":"https://www.jnlgame.com/products/alone-in-the-dark-the-new-nightmare-ps1-playstation-1-pre-owned","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'alone-in-the-dark-the-new-nightmare-playstation-1-0016')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5016488138130', '5016488138130', 'Among Us Crewmate Edition', 'Among Us Crewmate Edition', 'Among Us Crewmate Edition for PlayStation 5. Pre-owned authentic item from Retro Qatar verified inventory.', 'Among Us Crewmate Edition لمنصة PlayStation 5. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 5', 'PS5', 'Sony', 'PS5', 'PRE-OWNED', 150, 150, 1, 1, '/media/products/inventory-200/rq-0017-5016488138130-among-us-crewmate-edition.jpg', '{"platform":"PlayStation 5","platformGeneration":"PS5","productKind":"Game","sourceInventoryPage":10,"originalInventoryCategory":"PlayStation/PS5","imageMatchStatus":"Title/edition/platform verified","sourceUrl":"https://www.gamebuster.com.gr/product/ps5-among-us-crewmate-edition/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'among-us-crewmate-edition-playstation-5-0017')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633153200', '014633153200', 'Arena Football', 'Arena Football', 'Arena Football for PlayStation 2. Pre-owned authentic item from Retro Qatar verified inventory.', 'Arena Football لمنصة PlayStation 2. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 2', 'PS2', 'Sony', 'PS2', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0018-014633153200-arena-football.jpg', '{"platform":"PlayStation 2","platformGeneration":"PS2","productKind":"Game","sourceInventoryPage":11,"originalInventoryCategory":"PlayStation/PS2","imageMatchStatus":"Title/platform verified","sourceUrl":"https://www.gamestop.com/video-games/retro-gaming/products/arena-football---playstation-2/20016647.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'arena-football-playstation-2-0018')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('008888524625', '008888524625', 'Armored Core For Answer', 'Armored Core For Answer', 'Armored Core For Answer for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Armored Core For Answer لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0019-008888524625-armored-core-for-answer.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":11,"originalInventoryCategory":"Xbox/Xbox 360","imageMatchStatus":"Title/platform verified","sourceUrl":"https://www.lukiegames.com/Armored-Core-For-Answer-Xbox-360-Game.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'armored-core-for-answer-xbox-360-0019')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5023117543326', '5023117543326', 'Worms Armageddon', 'Worms Armageddon', 'Worms Armageddon for Dreamcast. Pre-owned authentic item from Retro Qatar verified inventory.', 'Worms Armageddon لمنصة Dreamcast. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Dreamcast', 'Dreamcast', 'Sega', 'Dreamcast', 'PRE-OWNED', 250, 250, 1, 1, '/media/products/inventory-200/rq-0020-5023117543326-worms-armageddon.jpg', '{"platform":"Dreamcast","platformGeneration":"Dreamcast","productKind":"Game","sourceInventoryPage":11,"originalInventoryCategory":"Sega/Dreamcast","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://retrogameworld.ch/shop/worms-armageddon-dreamcast/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'worms-armageddon-dreamcast-0020')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('4949776342036', '4949776342036', 'Armored Core For Answer Ps3', 'Armored Core For Answer Ps3', 'Armored Core For Answer Ps3 for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Armored Core For Answer Ps3 لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0021-4949776342036-armored-core-for-answer-ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":12,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.meugameusado.com.br/Jogo-Armored-Core-For-Answer-PS3","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'armored-core-for-answer-ps3-playstation-3-0021')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('045496420369', '045496420369', 'ARMS NINTENDO SWITCH', 'ARMS NINTENDO SWITCH', 'ARMS NINTENDO SWITCH for Switch. Pre-owned authentic item from Retro Qatar verified inventory.', 'ARMS NINTENDO SWITCH لمنصة Switch. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Switch', 'Switch', 'Nintendo', 'Switch', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0022-045496420369-arms-nintendo-switch.jpg', '{"platform":"Switch","platformGeneration":"Switch","productKind":"Game","sourceInventoryPage":12,"originalInventoryCategory":"Nintendo/Switch","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.bestbuy.com/site/reviews/arms-nintendo-switch/5721505?page=5","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'arms-nintendo-switch-switch-0022')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633157130', '014633157130', 'Army Of TOW', 'Army Of TOW', 'Army Of TOW for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Army Of TOW لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0023-014633157130-army-of-tow.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":12,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform verified","sourceUrl":"https://www.bobshop.co.za/army-of-two-xbox-360/p/661059965","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'army-of-tow-xbox-360-0023')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030943110103', '5030943110103', 'Army Of TOW Ps3', 'Army Of TOW Ps3', 'Army Of TOW Ps3 for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Army Of TOW Ps3 لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0024-5030943110103-army-of-tow-ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":12,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://retrohygge.dk/products/army-of-two-ps3","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'army-of-tow-ps3-playstation-3-0024')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('742725273931', '742725273931', 'ARTHUR DS GAME', 'ARTHUR DS GAME', 'ARTHUR DS GAME for DS. Pre-owned authentic item from Retro Qatar verified inventory.', 'ARTHUR DS GAME لمنصة DS. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'DS', 'DS', 'Nintendo', 'DS', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0025-742725273931-arthur-ds-game.jpg', '{"platform":"DS","platformGeneration":"DS","productKind":"Game","sourceInventoryPage":12,"originalInventoryCategory":"Nintendo/DS","imageMatchStatus":"Title/platform inferred; review edition","sourceUrl":"https://www.senscritique.com/jeuvideo/arthur_et_les_minimoys/90735633","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'arthur-ds-game-ds-0025')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3307216257691', '3307216257691', 'Assassin creed Mirage', 'Assassin creed Mirage', 'Assassin creed Mirage for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assassin creed Mirage لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0026-3307216257691-assassin-creed-mirage.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":12,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.intertoys.nl/ps4-en-ps5-assassin-s-creed-mirage","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assassin-creed-mirage-playstation-4-0026')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3307210263506', '3307210263506', 'Assassin creed ps3', 'Assassin creed ps3', 'Assassin creed ps3 for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assassin creed ps3 لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0027-3307210263506-assassin-creed-ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":13,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.bol.com/be/nl/p/assassins-creed/1004004005529074/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assassin-creed-ps3-playstation-3-0027')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('008888348115', '008888348115', 'Assassin`s Creed Black Flag', 'Assassin`s Creed Black Flag', 'Assassin`s Creed Black Flag for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assassin`s Creed Black Flag لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0028-008888348115-assassin-s-creed-black-flag.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":13,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.bodegaaurrera.com.mx/ip/playstation-3/assassin-s-creed-iv-black-flag-playstation-3-ubisoft-ps3/00077395709434","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assassins-creed-black-flag-playstation-3-0028')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3307217927036', '3307217927036', 'assassin`s Creed Brotherhood', 'assassin`s Creed Brotherhood', 'assassin`s Creed Brotherhood for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'assassin`s Creed Brotherhood لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0029-3307217927036-assassin-s-creed-brotherhood.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":13,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.xplacegames.com.br/assassins-creed-brotherhood-usado-ps3","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assassins-creed-brotherhood-playstation-3-0029')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3307216090953', '3307216090953', 'assassin`s Creed Odyssey', 'assassin`s Creed Odyssey', 'assassin`s Creed Odyssey for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'assassin`s Creed Odyssey لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 150, 150, 1, 1, '/media/products/inventory-200/rq-0030-3307216090953-assassin-s-creed-odyssey.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":13,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.oechsle.pe/juego-ps4-assassins-creed-odyssey-1000047896/p","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assassins-creed-odyssey-playstation-4-0030')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3307216044482', '3307216044482', 'Assassin`s Creed Rogue Remastred', 'Assassin`s Creed Rogue Remastred', 'Assassin`s Creed Rogue Remastred for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assassin`s Creed Rogue Remastred لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0031-3307216044482-assassin-s-creed-rogue-remastred.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":14,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.rafagamer.com.br/assassins-creed-rogue-remastered-ps4-e-ps5","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assassins-creed-rogue-remastred-playstation-4-0031')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('887256000615', '887256000615', 'Assassin`s Creed The Americas Collection', 'Assassin`s Creed The Americas Collection', 'Assassin`s Creed The Americas Collection for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assassin`s Creed The Americas Collection لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0032-887256000615-assassin-s-creed-the-americas-collection.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":14,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Exact barcode/title/platform","sourceUrl":"https://www.gamestop.com/video-games/retro-gaming/products/assassins-creed-the-americas-collection---playstation-3/10117532-10117537.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assassins-creed-the-americas-collection-playstation-3-0032')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3307215802700', '3307215802700', 'Assassin`s Creed The Americas SAGA', 'Assassin`s Creed The Americas SAGA', 'Assassin`s Creed The Americas SAGA for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assassin`s Creed The Americas SAGA لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 250, 250, 1, 1, '/media/products/inventory-200/rq-0033-3307215802700-assassin-s-creed-the-americas-saga.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":14,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.dakmorsclub.com/productos/assassins-creed-the-americas-collection-xbox-360/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assassins-creed-the-americas-saga-xbox-360-0033')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('887256300302', '887256300302', 'Assassin`s Creed Unity', 'Assassin`s Creed Unity', 'Assassin`s Creed Unity for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assassin`s Creed Unity لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0034-887256300302-assassin-s-creed-unity.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":14,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.meugameusado.com.br/jogo-assassins-creed-unity-ps4-7987231","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assassins-creed-unity-playstation-4-0034')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3307216169314', '3307216169314', 'Assassin`s Creed Valhalla', 'Assassin`s Creed Valhalla', 'Assassin`s Creed Valhalla for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assassin`s Creed Valhalla لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0035-3307216169314-assassin-s-creed-valhalla.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":14,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://toyorgame.com.sg/products/assassins-creed-valhalla","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assassins-creed-valhalla-playstation-4-0035')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3307216174172', '3307216174172', 'Assassin`s Creed Valhalla.', 'Assassin`s Creed Valhalla.', 'Assassin`s Creed Valhalla. for PlayStation 5. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assassin`s Creed Valhalla. لمنصة PlayStation 5. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 5', 'PS5', 'Sony', 'PS5', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0036-3307216174172-assassin-s-creed-valhalla.jpg', '{"platform":"PlayStation 5","platformGeneration":"PS5","productKind":"Game","sourceInventoryPage":15,"originalInventoryCategory":"PlayStation/PS5","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.ldlc.com/fiche/PB00472287.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assassins-creed-valhalla-playstation-5-0036')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('722674110402', '722674110402', 'assault Horizon', 'assault Horizon', 'assault Horizon for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'assault Horizon لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0037-722674110402-assault-horizon.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":15,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.meugameusado.com.br/jogo-ace-combat-assault-horizon-ps3-7988672","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assault-horizon-playstation-3-0037')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('008888513391', '008888513391', 'Assissin`s Creed', 'Assissin`s Creed', 'Assissin`s Creed for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assissin`s Creed لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0038-008888513391-assissin-s-creed.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":15,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform verified","sourceUrl":"https://www.lukiegames.com/Assassins-Creed-Xbox-360-Game.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assissins-creed-xbox-360-0038')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3307215657652', '3307215657652', 'Assissin`s Creed 3', 'Assissin`s Creed 3', 'Assissin`s Creed 3 for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assissin`s Creed 3 لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0039-3307215657652-assissin-s-creed-3.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":15,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.espiaogames.com.br/produto/assassins-creed-3-xbox-360-seminovo","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assissins-creed-3-xbox-360-0039')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3307215705858', '3307215705858', 'Assissin`s Creed Black Flag', 'Assissin`s Creed Black Flag', 'Assissin`s Creed Black Flag for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assissin`s Creed Black Flag لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0040-3307215705858-assissin-s-creed-black-flag.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":16,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.kabum.com.br/produto/955734/jogo-assassin-s-creed-lv-black-flag-xbox-360-americano","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assissins-creed-black-flag-xbox-360-0040')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('008888526841', '008888526841', 'Assissin`S Creed Revelation', 'Assissin`S Creed Revelation', 'Assissin`S Creed Revelation for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Assissin`S Creed Revelation لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0041-008888526841-assissin-s-creed-revelation.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":16,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.meugameusado.com.br/jogo-assassins-creed-revelations-xbox-360-7988715","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'assissins-creed-revelation-xbox-360-0041')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('4974365811150', '4974365811150', 'Athlete kings', 'Athlete kings', 'Athlete kings for Saturn. Pre-owned authentic item from Retro Qatar verified inventory.', 'Athlete kings لمنصة Saturn. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Saturn', 'Saturn', 'Sega', 'Saturn', 'PRE-OWNED', 250, 250, 1, 1, '/media/products/inventory-200/rq-0042-4974365811150-athlete-kings.jpg', '{"platform":"Saturn","platformGeneration":"Saturn","productKind":"Game","sourceInventoryPage":17,"originalInventoryCategory":"Sega/Saturn","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://superretro.com.au/products/athlete-kings-sega-saturn","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'athlete-kings-saturn-0042')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('711719275220', '711719275220', 'ATV Off road', 'ATV Off road', 'ATV Off road for PlayStation 2. Pre-owned authentic item from Retro Qatar verified inventory.', 'ATV Off road لمنصة PlayStation 2. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 2', 'PS2', 'Sony', 'PS2', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0043-711719275220-atv-off-road.jpg', '{"platform":"PlayStation 2","platformGeneration":"PS2","productKind":"Game","sourceInventoryPage":17,"originalInventoryCategory":"PlayStation/PS2","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://psgames.ca/ps2-atv-offroad-fury.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'atv-off-road-playstation-2-0043')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('008888335436', '008888335436', 'Avatar The Game', 'Avatar The Game', 'Avatar The Game for PlayStation P. Pre-owned authentic item from Retro Qatar verified inventory.', 'Avatar The Game لمنصة PlayStation P. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation P', 'PSP', 'Sony', 'PSP', 'PRE-OWNED', 120, 120, 1, 1, '/media/products/inventory-200/rq-0044-008888335436-avatar-the-game.jpg', '{"platform":"PlayStation P","platformGeneration":"PSP","productKind":"Game","sourceInventoryPage":17,"originalInventoryCategory":"PlayStation/PSP","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.powerupgaming.ca/products/psp-james-camerons-avatar-the-game-in-case","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'avatar-the-game-playstation-p-0044')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('008888175438', '008888175438', 'Avatar The Game.', 'Avatar The Game.', 'Avatar The Game. for Wii. Pre-owned authentic item from Retro Qatar verified inventory.', 'Avatar The Game. لمنصة Wii. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Wii', 'Wii', 'Nintendo', 'Wii', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0045-008888175438-avatar-the-game.jpg', '{"platform":"Wii","platformGeneration":"Wii","productKind":"Game","sourceInventoryPage":17,"originalInventoryCategory":"Nintendo/Wii","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.meugameusado.com.br/jogo-avatar-the-game-wii","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'avatar-the-game-wii-0045')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5017783013870', '5017783013870', 'Bad Boys 2', 'Bad Boys 2', 'Bad Boys 2 for GameCube. Pre-owned authentic item from Retro Qatar verified inventory.', 'Bad Boys 2 لمنصة GameCube. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'GameCube', 'GameCube', 'Nintendo', 'GameCube', 'PRE-OWNED', 600, 600, 1, 1, '/media/products/inventory-200/rq-0046-5017783013870-bad-boys-2.jpg', '{"platform":"GameCube","platformGeneration":"GameCube","productKind":"Game","sourceInventoryPage":18,"originalInventoryCategory":"Nintendo/GameCube","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.thevideogamecompany.com/products/bad-boys-miami-takedown-nintendo-gamecube","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bad-boys-2-gamecube-0046')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('785138303857', '785138303857', 'Barbie', 'Barbie', 'Barbie for Wii. Pre-owned authentic item from Retro Qatar verified inventory.', 'Barbie لمنصة Wii. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Wii', 'Wii', 'Nintendo', 'Wii', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0047-785138303857-barbie.jpg', '{"platform":"Wii","platformGeneration":"Wii","productKind":"Game","sourceInventoryPage":18,"originalInventoryCategory":"Nintendo/Wii","imageMatchStatus":"Exact barcode: Barbie Groom and Glam Pups","sourceUrl":"https://www.ebay.com/itm/155464749834","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'barbie-wii-0047')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5051892154673', '5051892154673', 'Batman 2', 'Batman 2', 'Batman 2 for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Batman 2 لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0048-5051892154673-batman-2.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":18,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform inferred: LEGO Batman 2; review edition","sourceUrl":"https://www.falabella.com.co/falabella-co/product/130391876/Lego-batman-2-dc-super-heroes-playstation-3/130391877","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'batman-2-playstation-3-0048')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5051892183062', '5051892183062', 'Batman 3', 'Batman 3', 'Batman 3 for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Batman 3 لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 50, 50, 1, 1, '/media/products/inventory-200/rq-0049-5051892183062-batman-3.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":19,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Exact barcode: LEGO Batman 3 Beyond Gotham","sourceUrl":"https://uae.microless.com/product/warner-bros-games-lego-batman-3-beyond-gotham-xbox-one/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'batman-3-xbox-one-0049')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5051892168649', '5051892168649', 'Batman 3 Beydon Gotham', 'Batman 3 Beydon Gotham', 'Batman 3 Beydon Gotham for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Batman 3 Beydon Gotham لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 50, 50, 1, 1, '/media/products/inventory-200/rq-0050-5051892168649-batman-3-beydon-gotham.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":19,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Exact barcode/title/platform","sourceUrl":"https://www.walmart.com/ip/707375749","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'batman-3-beydon-gotham-playstation-4-0050')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('788687200660', '788687200660', 'Batman Arkham Asylum', 'Batman Arkham Asylum', 'Batman Arkham Asylum for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Batman Arkham Asylum لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0051-788687200660-batman-arkham-asylum.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":19,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.walmart.com/ip/10891107","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'batman-arkham-asylum-xbox-360-0051')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5051892191197', '5051892191197', 'BatMan Arkham Knight', 'BatMan Arkham Knight', 'BatMan Arkham Knight for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'BatMan Arkham Knight لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0052-5051892191197-batman-arkham-knight.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":19,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Exact barcode/title/platform","sourceUrl":"https://www.skroutz.gr/s/4737233/Batman-Arkham-Knight-PS4-Game.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'batman-arkham-knight-playstation-4-0052')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5051892198745', '5051892198745', 'Batman Return To Arkham', 'Batman Return To Arkham', 'Batman Return To Arkham for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Batman Return To Arkham لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0053-5051892198745-batman-return-to-arkham.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":20,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.correquetabaratinho.com.br/ofertas/shopee/5917567","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'batman-return-to-arkham-playstation-4-0053')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5051892191210', '5051892191210', 'Batman Special Edition', 'Batman Special Edition', 'Batman Special Edition for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Batman Special Edition لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 150, 150, 1, 1, '/media/products/inventory-200/rq-0054-5051892191210-batman-special-edition.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":20,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Exact barcode: Arkham Knight Steelbook Edition","sourceUrl":"https://www.powerupgaming.ca/products/xbox-one-batman-arkham-knight-steelbook","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'batman-special-edition-xbox-one-0054')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030943113760', '5030943113760', 'Battel Fileld 1', 'Battel Fileld 1', 'Battel Fileld 1 for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battel Fileld 1 لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0055-5030943113760-battel-fileld-1.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":20,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://gamehoard.com/products/battlefield-1-xbox-one","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battel-fileld-1-xbox-one-0055')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633197372', '014633197372', 'Battel Fileld 3', 'Battel Fileld 3', 'Battel Fileld 3 for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battel Fileld 3 لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0056-014633197372-battel-fileld-3.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":20,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://gamehoard.com/products/battlefield-3-xbox-360","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battel-fileld-3-xbox-360-0056')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030930102906', '5030930102906', 'Battel Fileld 3 Ps3', 'Battel Fileld 3 Ps3', 'Battel Fileld 3 Ps3 for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battel Fileld 3 Ps3 لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0057-5030930102906-battel-fileld-3-ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":21,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.medimops.de/battlefield-3-videospiel-M0B005O7Y9NS.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battel-fileld-3-ps3-playstation-3-0057')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030933117723', '5030933117723', 'Battel Fileld 4 Premium edition', 'Battel Fileld 4 Premium edition', 'Battel Fileld 4 Premium edition for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battel Fileld 4 Premium edition لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0058-5030933117723-battel-fileld-4-premium-edition.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":21,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://jocuri-xbox-one.compari.ro/electronic-arts/battlefield-4-premium-edition-xbox-one-p247927319/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battel-fileld-4-premium-edition-xbox-one-0058')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030938112259', '5030938112259', 'Battel Fileld 4.', 'Battel Fileld 4.', 'Battel Fileld 4. for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battel Fileld 4. لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0059-5030938112259-battel-fileld-4.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":21,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://super.walmart.com.mx/ip/battlefield-4-xbox-360-fisico/00001463336705","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battel-fileld-4-xbox-360-0059')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633156713', '014633156713', 'Battel Fileld Bad Company 2', 'Battel Fileld Bad Company 2', 'Battel Fileld Bad Company 2 for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battel Fileld Bad Company 2 لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0060-014633156713-battel-fileld-bad-company-2.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":21,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform verified; region artwork review","sourceUrl":"https://www.vpd.fi/x3-battlefield-bad-company-2-kaytetty.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battel-fileld-bad-company-2-xbox-360-0060')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030948112423', '5030948112423', 'Battelefiled Hardline', 'Battelefiled Hardline', 'Battelefiled Hardline for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battelefiled Hardline لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0061-5030948112423-battelefiled-hardline.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":22,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.ebay.co.uk/itm/224035599573","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battelefiled-hardline-xbox-360-0061')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633371444', '014633371444', 'Battle Field 1', 'Battle Field 1', 'Battle Field 1 for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field 1 لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0062-014633371444-battle-field-1.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":22,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://es.webuy.com/product-detail/?id=5030941113762","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-1-playstation-4-0062')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5035225113742', '5035225113742', 'Battle Field 1 PC', 'Battle Field 1 PC', 'Battle Field 1 PC for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field 1 PC لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0063-5035225113742-battle-field-1-pc.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":22,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.gamestop.com/pc-gaming/pc-games/products/battlefield-1---pc-ea-app/125976.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-1-pc-pc-0063')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030930049966', '5030930049966', 'Battle Field 2', 'Battle Field 2', 'Battle Field 2 for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field 2 لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0064-5030930049966-battle-field-2.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":22,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Exact title/platform image match","sourceUrl":"https://www.fenixgz.com.br/battlefield-2-modern-combat-xbox-360-usado","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-2-xbox-360-0064')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633152906', '014633152906', 'Battle Field 2 Pc', 'Battle Field 2 Pc', 'Battle Field 2 Pc for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field 2 Pc لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0065-014633152906-battle-field-2-pc.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":22,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.mobygames.com/game/18194/battlefield-2/cover/group-426042/cover-1013464/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-2-pc-pc-0065')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633148411', '014633148411', 'Battle Field 2 Pc.', 'Battle Field 2 Pc.', 'Battle Field 2 Pc. for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field 2 Pc. لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0066-014633148411-battle-field-2-pc.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":23,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.ricardo.ch/de/a/battlefield-2-pc-game-1214436468/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-2-pc-pc-0066')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633374490', '014633374490', 'Battle Field 2042', 'Battle Field 2042', 'Battle Field 2042 for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field 2042 لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 150, 150, 1, 1, '/media/products/inventory-200/rq-0067-014633374490-battle-field-2042.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":23,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.mundojoygames.com.br/playstation/playstation-4/jogos/jogo-battlefield-2042-ps4-midia-fisica","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-2042-playstation-4-0067')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030930102753', '5030930102753', 'Battle Field 3', 'Battle Field 3', 'Battle Field 3 for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field 3 لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 2, 1, '/media/products/inventory-200/rq-0068-5030930102753-battle-field-3.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":23,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.jeuxvideo.com/jeux/pc/00031999-battlefield-3.htm","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-3-pc-0068')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030943102757', '5030943102757', 'Battle Field 3 Pc', 'Battle Field 3 Pc', 'Battle Field 3 Pc for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field 3 Pc لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0069-5030943102757-battle-field-3-pc.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":23,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.jeuxvideo.com/jeux/pc/00031999-battlefield-3.htm","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-3-pc-pc-0069')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030946112531', '5030946112531', 'Battle Field 4', 'Battle Field 4', 'Battle Field 4 for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field 4 لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0070-5030946112531-battle-field-4.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":23,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.xongeek.com.br/jogo-battlefield-4-seminovo-ps4","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-4-playstation-4-0070')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5035223111733', '5035223111733', 'Battle Field 4 PC.', 'Battle Field 4 PC.', 'Battle Field 4 PC. for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field 4 PC. لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0071-5035223111733-battle-field-4-pc.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":23,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.gamestop.com/pc-gaming/pc-games/products/battlefield-4---pc/10108876-10108876.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-4-pc-pc-0071')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633730616', '014633730616', 'Battle Field 4.', 'Battle Field 4.', 'Battle Field 4. for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field 4. لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0072-014633730616-battle-field-4.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":24,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://elevengamesar.com/187668-juegos-y-consolas-battlefield-4-ps4-digital?srsltid=AfmBOoqJ8W_txwa_pkWTIaabhzUh0XgWj0iPJmPIXpnN57bj3f5FtPzT","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-4-playstation-4-0072')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5035223123248', '5035223123248', 'Battle Field 5', 'Battle Field 5', 'Battle Field 5 for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field 5 لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 150, 150, 1, 1, '/media/products/inventory-200/rq-0073-5035223123248-battle-field-5.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":24,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.ubuy.ma/en/product/7TY190MDO-battlefield-v-ps4-brand-new","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-5-playstation-4-0073')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633195491', '014633195491', 'Battle Field Bad Company', 'Battle Field Bad Company', 'Battle Field Bad Company for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field Bad Company لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0074-014633195491-battle-field-bad-company.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":24,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Exact barcode/title/platform","sourceUrl":"https://sp.olx.com.br/grande-campinas/games/jogos-de-video-game/battlefield-bad-company-2-ultimate-edition-ps3-1434809061","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-bad-company-playstation-3-0074')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5035225113087', '5035225113087', 'Battle Field Hardline', 'Battle Field Hardline', 'Battle Field Hardline for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field Hardline لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0075-5035225113087-battle-field-hardline.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":24,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.zeusgames.com.br/jogo-bf-battlefield-hardline-ps4","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-hardline-playstation-4-0075')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030935037944', '5030935037944', 'Battle Field PC 1942', 'Battle Field PC 1942', 'Battle Field PC 1942 for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Field PC 1942 لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 250, 250, 1, 1, '/media/products/inventory-200/rq-0076-5030935037944-battle-field-pc-1942.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":24,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://vandal.elespanol.com/trucos/pc/battlefield-1942/3621","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-field-pc-1942-pc-0076')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917053276', '5030917053276', 'Battle For The Pacific', 'Battle For The Pacific', 'Battle For The Pacific for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle For The Pacific لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0077-5030917053276-battle-for-the-pacific.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":25,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.play-asia.com/en/history-channel-battle-for-the-pacific/13/7028vo","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-for-the-pacific-playstation-3-0077')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030936121611', '5030936121611', 'Battle Front 2', 'Battle Front 2', 'Battle Front 2 for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battle Front 2 لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0078-5030936121611-battle-front-2.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":25,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.meugameusado.com.br/jogo-star-wars-battlefront-ii-ps4-2018-02-19-15-17-10","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battle-front-2-playstation-4-0078')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('70937755battlefieldvitenam', '70937755battlefieldvitenam', 'Battlefield Vitenam', 'Battlefield Vitenam', 'Battlefield Vitenam for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battlefield Vitenam لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 50, 50, 1, 1, '/media/products/inventory-200/rq-0079-70937755battlefieldvitenam-battlefield-vitenam.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":25,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://shopee.co.id/Battlefield-Vietnam-PC-GAME-i.20370621.4524892111","barcodeIsNumeric":false,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battlefield-vitenam-pc-0079')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633368697', '014633368697', 'Battlefront', 'Battlefront', 'Battlefront for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Battlefront لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0080-014633368697-battlefront.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":25,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://super.walmart.com.mx/ip/star-wars-battlefront-xbox-one-fisico/00001463373573","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'battlefront-xbox-one-0080')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('045496478445', '045496478445', 'BAYONETTA', 'BAYONETTA', 'BAYONETTA for Switch. Pre-owned authentic item from Retro Qatar verified inventory.', 'BAYONETTA لمنصة Switch. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Switch', 'Switch', 'Nintendo', 'Switch', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0081-045496478445-bayonetta.jpg', '{"platform":"Switch","platformGeneration":"Switch","productKind":"Game","sourceInventoryPage":25,"originalInventoryCategory":"Nintendo/Switch","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://gcjuegos.cl/juegos/42-bayonetta-3-nintendo-switch.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bayonetta-switch-0081')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('045496421489', '045496421489', 'BAYONETTA 2', 'BAYONETTA 2', 'BAYONETTA 2 for Switch. Pre-owned authentic item from Retro Qatar verified inventory.', 'BAYONETTA 2 لمنصة Switch. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Switch', 'Switch', 'Nintendo', 'Switch', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0082-045496421489-bayonetta-2.jpg', '{"platform":"Switch","platformGeneration":"Switch","productKind":"Game","sourceInventoryPage":25,"originalInventoryCategory":"Nintendo/Switch","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.nintendolife.com/news/2017/12/deals_uk_switch_owners_can_now_pre-order_the_bayonetta_special_edition_with_a_free_poster","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bayonetta-2-switch-0082')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('6291200105846', '6291200105846', 'Ben 10 dvd', 'Ben 10 dvd', 'Ben 10 dvd for DVD. Pre-owned authentic item from Retro Qatar verified inventory.', 'Ben 10 dvd لمنصة DVD. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'DVD', 'DVD', 'Various', 'DVD', 'PRE-OWNED', 50, 50, 1, 1, '/media/products/inventory-200/rq-0083-6291200105846-ben-10-dvd.jpg', '{"platform":"DVD","platformGeneration":"DVD","productKind":"Media","sourceInventoryPage":26,"originalInventoryCategory":"Movies/DVD","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.themoviedb.org/tv/4686-ben-10/images/posters","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'ben-10-dvd-dvd-0083')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3391891956970', '3391891956970', 'BEN 10 galactic racing', 'BEN 10 galactic racing', 'BEN 10 galactic racing for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'BEN 10 galactic racing لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0084-3391891956970-ben-10-galactic-racing.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":26,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.powerupgaming.ca/products/ps3-gm-galarac","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'ben-10-galactic-racing-playstation-3-0084')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('711719992059', '711719992059', 'Best Of Playstation Network', 'Best Of Playstation Network', 'Best Of Playstation Network for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Best Of Playstation Network لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 150, 150, 1, 1, '/media/products/inventory-200/rq-0085-711719992059-best-of-playstation-network.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":26,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.meugameusado.com.br/jogo-best-of-playstation-network-volume-1-ps3-lacrado","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'best-of-playstation-network-playstation-3-0085')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5016488131704', '5016488131704', 'BIG BUCK HUNTER', 'BIG BUCK HUNTER', 'BIG BUCK HUNTER for Switch. Pre-owned authentic item from Retro Qatar verified inventory.', 'BIG BUCK HUNTER لمنصة Switch. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Switch', 'Switch', 'Nintendo', 'Switch', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0086-5016488131704-big-buck-hunter.jpg', '{"platform":"Switch","platformGeneration":"Switch","productKind":"Game","sourceInventoryPage":27,"originalInventoryCategory":"Nintendo/Switch","imageMatchStatus":"Exact barcode/title/platform","sourceUrl":"https://www.walmart.com/ip/15303819988","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'big-buck-hunter-switch-0086')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875759299', '047875759299', 'Big Game Hunter 2010', 'Big Game Hunter 2010', 'Big Game Hunter 2010 for Wii. Pre-owned authentic item from Retro Qatar verified inventory.', 'Big Game Hunter 2010 لمنصة Wii. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Wii', 'Wii', 'Nintendo', 'Wii', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0087-047875759299-big-game-hunter-2010.jpg', '{"platform":"Wii","platformGeneration":"Wii","productKind":"Game","sourceInventoryPage":27,"originalInventoryCategory":"Nintendo/Wii","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.imdb.com/title/tt1718745/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'big-game-hunter-2010-wii-0087')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('711719446811', '711719446811', 'Big Planet 3', 'Big Planet 3', 'Big Planet 3 for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Big Planet 3 لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0088-711719446811-big-planet-3.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":27,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Exact barcode/title/platform","sourceUrl":"https://www.samma3a.com/saudi-en/little-big-planet-3-ps4.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'big-planet-3-playstation-4-0088')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('0018', '0018', 'Binary Domain', 'Binary Domain', 'Binary Domain for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Binary Domain لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0089-0018-binary-domain.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":27,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.machadogames.com.br/jogo-binary-domain-xbox-360-midia-fisica-original-seminovo","barcodeIsNumeric":false,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'binary-domain-xbox-360-0089')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5055060961339', '5055060961339', 'Bionic Commando', 'Bionic Commando', 'Bionic Commando for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Bionic Commando لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0090-5055060961339-bionic-commando.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":28,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://gamefragger.com/multiplatform/action-adventure/bionic-commando/pictures/bionic-commando-xbox-360-box-art-i6303","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bionic-commando-xbox-360-0090')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('4988648586253', '4988648586253', 'BioShock .', 'BioShock .', 'BioShock . for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'BioShock . لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0091-4988648586253-bioshock.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":28,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://pnpgamesonline.com/product/bioshock-complete-xbox-360-game/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bioshock-xbox-360-0091')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5026555256506', '5026555256506', 'BioShock Infinite', 'BioShock Infinite', 'BioShock Infinite for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'BioShock Infinite لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0092-5026555256506-bioshock-infinite.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":28,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://retrospillkongen.no/products/bioshock-infinite-xbox-360-spill","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bioshock-infinite-xbox-360-0092')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('70310916Bioshock', '70310916Bioshock', 'BioShock the colection', 'BioShock the colection', 'BioShock the colection for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'BioShock the colection لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0093-70310916bioshock-bioshock-the-colection.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":28,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.rafagamer.com.br/bioshock-the-collection-ps4-e-ps5","barcodeIsNumeric":false,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bioshock-the-colection-playstation-4-0093')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('710425477706', '710425477706', 'BioShock.', 'BioShock.', 'BioShock. for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'BioShock. لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0094-710425477706-bioshock.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":29,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Exact barcode/title/platform","sourceUrl":"https://www.bodegaaurrera.com.mx/ip/playstation-4/bioshock-the-collection-juego-ps4/00071042547762","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bioshock-playstation-4-0094')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5016488112093', '5016488112093', 'Black Hawk Down', 'Black Hawk Down', 'Black Hawk Down for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Black Hawk Down لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0095-5016488112093-black-hawk-down.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":29,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match","sourceUrl":"https://www.jeuxvideo.com/jeux/pc/00009835-delta-force-black-hawk-down.htm","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'black-hawk-down-pc-0095')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('031719269433', '031719269433', 'Black Site', 'Black Site', 'Black Site for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Black Site لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0096-031719269433-black-site.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":29,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://in.webuy.com/product-detail/?id=5037930110061","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'black-site-playstation-3-0096')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5060327532467', '5060327532467', 'Blade Strom', 'Blade Strom', 'Blade Strom for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Blade Strom لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 200, 200, 1, 1, '/media/products/inventory-200/rq-0097-5060327532467-blade-strom.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":29,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Exact title/platform image match","sourceUrl":"https://www.mobygames.com/game/85475/bladestorm-nightmare/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'blade-strom-xbox-one-0097')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('008888522638', '008888522638', 'Blazing Angels', 'Blazing Angels', 'Blazing Angels for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Blazing Angels لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0098-008888522638-blazing-angels.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":29,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.walmart.com/ip/4569564","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'blazing-angels-xbox-360-0098')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('010086650068', '010086650068', 'Bleach ..', 'Bleach ..', 'Bleach .. for Wii. Pre-owned authentic item from Retro Qatar verified inventory.', 'Bleach .. لمنصة Wii. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Wii', 'Wii', 'Nintendo', 'Wii', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0099-010086650068-bleach.jpg', '{"platform":"Wii","platformGeneration":"Wii","productKind":"Game","sourceInventoryPage":30,"originalInventoryCategory":"Nintendo/Wii","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.mobygames.com/game/48799/bleach-shattered-blade/cover/group-76961/cover-208344/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bleach-wii-0099')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('6291200112400', '6291200112400', 'Bob The builder', 'Bob The builder', 'Bob The builder for DVD. Pre-owned authentic item from Retro Qatar verified inventory.', 'Bob The builder لمنصة DVD. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'DVD', 'DVD', 'Various', 'DVD', 'PRE-OWNED', 50, 50, 1, 1, '/media/products/inventory-200/rq-0100-6291200112400-bob-the-builder.jpg', '{"platform":"DVD","platformGeneration":"DVD","productKind":"Media","sourceInventoryPage":30,"originalInventoryCategory":"Movies/DVD","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.ebay.com/itm/305785243935","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bob-the-builder-dvd-0100')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5055964768171', '5055964768171', 'Boo Light', 'Boo Light', 'Boo Light for Multi-platform. Pre-owned authentic item from Retro Qatar verified inventory.', 'Boo Light لمنصة Multi-platform. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Accessories', 'Accessories', 'Multi-platform', 'Multi-platform', 'Various', 'Multi-platform', 'PRE-OWNED', 150, 150, 4, 1, '/media/products/inventory-200/rq-0101-5055964768171-boo-light.jpg', '{"platform":"Multi-platform","platformGeneration":"Multi-platform","productKind":"Accessory","sourceInventoryPage":30,"originalInventoryCategory":"Other","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.pccomponentes.fr/paladone-icone-super-mario-boo-lampe","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'boo-light-multi-platform-0101')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5026555057080', '5026555057080', 'Borderlands', 'Borderlands', 'Borderlands for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Borderlands لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0102-5026555057080-borderlands.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":31,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.mobygames.com/game/43378/borderlands/cover/group-81348/cover-221104/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'borderlands-pc-0102')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('710425491016', '710425491016', 'Borderlands 2', 'Borderlands 2', 'Borderlands 2 for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Borderlands 2 لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0103-710425491016-borderlands-2.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":31,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.thevideogamecompany.com/collections/microsoft-xbox-360-video-games","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'borderlands-2-xbox-360-0103')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5026555425889', '5026555425889', 'BorderLands 3', 'BorderLands 3', 'BorderLands 3 for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'BorderLands 3 لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0104-5026555425889-borderlands-3.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":31,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.3djuegos.com/juegos/borderlands-3/noticias/aqui-tienes-todas-las-ediciones-de-borderlands-3-cual-190403-91534","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'borderlands-3-playstation-4-0104')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('854952003028', '854952003028', 'Bound By Flame', 'Bound By Flame', 'Bound By Flame for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Bound By Flame لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0105-854952003028-bound-by-flame.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":31,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.gamestop.com/video-games/products/bound-by-flame/10114154.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bound-by-flame-playstation-4-0105')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('4005209037662', '4005209037662', 'Britney`s', 'Britney`s', 'Britney`s for PlayStation 2. Pre-owned authentic item from Retro Qatar verified inventory.', 'Britney`s لمنصة PlayStation 2. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 2', 'PS2', 'Sony', 'PS2', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0106-4005209037662-britney-s.jpg', '{"platform":"PlayStation 2","platformGeneration":"PS2","productKind":"Game","sourceInventoryPage":32,"originalInventoryCategory":"PlayStation/PS2","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.imdb.com/title/tt0312504/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'britneys-playstation-2-0106')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3307210268228', '3307210268228', 'Brothers In Arms', 'Brothers In Arms', 'Brothers In Arms for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Brothers In Arms لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0107-3307210268228-brothers-in-arms.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":32,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://gamesdb.launchbox-app.com/games/images/11924-brothers-in-arms-hells-highway","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'brothers-in-arms-xbox-360-0107')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('8809083647643', '8809083647643', 'Brunswick Pro Browling', 'Brunswick Pro Browling', 'Brunswick Pro Browling for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Brunswick Pro Browling لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0108-8809083647643-brunswick-pro-browling.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":32,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://pnpgamesonline.com/product/brunswick-pro-bowling-disc-only/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'brunswick-pro-browling-playstation-3-0108')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('805529108523', '805529108523', 'Brute Force', 'Brute Force', 'Brute Force for Xbox Original. Pre-owned authentic item from Retro Qatar verified inventory.', 'Brute Force لمنصة Xbox Original. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox Original', 'XboxOriginal', 'Microsoft', 'XboxOriginal', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0109-805529108523-brute-force.jpg', '{"platform":"Xbox Original","platformGeneration":"XboxOriginal","productKind":"Game","sourceInventoryPage":32,"originalInventoryCategory":"Xbox/XboxOriginal","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.ebay.com/itm/125304698247","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'brute-force-xbox-original-0109')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('805529136809', '805529136809', 'Brute Force Dangerous', 'Brute Force Dangerous', 'Brute Force Dangerous for Xbox Original. Pre-owned authentic item from Retro Qatar verified inventory.', 'Brute Force Dangerous لمنصة Xbox Original. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox Original', 'XboxOriginal', 'Microsoft', 'XboxOriginal', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0110-805529136809-brute-force-dangerous.jpg', '{"platform":"Xbox Original","platformGeneration":"XboxOriginal","productKind":"Game","sourceInventoryPage":32,"originalInventoryCategory":"Xbox/XboxOriginal","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.gamersgoretro.com/products/brute-force-xbox-xbox","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'brute-force-dangerous-xbox-original-0110')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3546430008775', '3546430008775', 'Bugs bunny Lost in time', 'Bugs bunny Lost in time', 'Bugs bunny Lost in time for PlayStation 1. Pre-owned authentic item from Retro Qatar verified inventory.', 'Bugs bunny Lost in time لمنصة PlayStation 1. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 1', 'PS1', 'Sony', 'PS1', 'PRE-OWNED', 150, 150, 1, 1, '/media/products/inventory-200/rq-0111-3546430008775-bugs-bunny-lost-in-time.jpg', '{"platform":"PlayStation 1","platformGeneration":"PS1","productKind":"Game","sourceInventoryPage":32,"originalInventoryCategory":"PlayStation/PS1","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.thevideogamecompany.com/products/bugs-bunny-lost-in-time-sony-playstation-1-ps1","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bugs-bunny-lost-in-time-playstation-1-0111')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633194586', '014633194586', 'Bulletstorm', 'Bulletstorm', 'Bulletstorm for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Bulletstorm لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0112-014633194586-bulletstorm.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":33,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://retrogaming.no/products/xbox-360-bulletstorm?srsltid=AfmBOoqbsCSGNBwNVgFRq3d9bbzd7wcvnM_Uy5mAhVUQAnJRXG0nUNrb","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'bulletstorm-xbox-360-0112')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3455196529014', '3455196529014', 'Burnout', 'Burnout', 'Burnout for GameCube. Pre-owned authentic item from Retro Qatar verified inventory.', 'Burnout لمنصة GameCube. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'GameCube', 'GameCube', 'Nintendo', 'GameCube', 'PRE-OWNED', 220, 220, 1, 1, '/media/products/inventory-200/rq-0113-3455196529014-burnout.jpg', '{"platform":"GameCube","platformGeneration":"GameCube","productKind":"Game","sourceInventoryPage":33,"originalInventoryCategory":"Nintendo/GameCube","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.thevideogamecompany.com/collections/nintendo-gamecube-video-games","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'burnout-gamecube-0113')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633156393', '014633156393', 'Burnout', 'Burnout', 'Burnout for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Burnout لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0114-014633156393-burnout.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":33,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Exact barcode/title/platform","sourceUrl":"https://www.gamersgoretro.com/products/burnout-paradise-xbox-360-x360","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'burnout-xbox-360-0114')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030930045470', '5030930045470', 'Burnout Revenge', 'Burnout Revenge', 'Burnout Revenge for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Burnout Revenge لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0115-5030930045470-burnout-revenge.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":34,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://gamehoard.com/products/burnout-revenge-xbox-360","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'burnout-revenge-xbox-one-0115')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875837492', '047875837492', 'Call Of Duty 2', 'Call Of Duty 2', 'Call Of Duty 2 for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty 2 لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0116-047875837492-call-of-duty-2.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":34,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://retrospillkongen.no/products/call-of-duty-2-xbox-360-spill","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-2-xbox-360-0116')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917071027', '5030917071027', 'Call Of Duty 2.', 'Call Of Duty 2.', 'Call Of Duty 2. for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty 2. لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0117-5030917071027-call-of-duty-2.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":35,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://retrospillkongen.no/products/call-of-duty-2-xbox-360-spill","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-2-xbox-360-0117')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875816312', '047875816312', 'Call Of Duty 3', 'Call Of Duty 3', 'Call Of Duty 3 for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty 3 لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0118-047875816312-call-of-duty-3.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":35,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://shopee.com.br/list/Call%20Of%20Duty/Xbox%20360","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-3-xbox-360-0118')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875816350', '047875816350', 'Call OF Duty 3 ps3', 'Call OF Duty 3 ps3', 'Call OF Duty 3 ps3 for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call OF Duty 3 ps3 لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0119-047875816350-call-of-duty-3-ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":35,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Exact barcode/title/platform","sourceUrl":"https://www.idealo.de/preisvergleich/OffersOfProduct/3076238_-call-of-duty-3.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-3-ps3-playstation-3-0119')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875842052', '047875842052', 'Call OF Duty 3PS3', 'Call OF Duty 3PS3', 'Call OF Duty 3PS3 for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call OF Duty 3PS3 لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0120-047875842052-call-of-duty-3ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":35,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.vgdb.com.br/playstation-3-/jogos/call-of-duty-3/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-3ps3-playstation-3-0120')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917096761', '5030917096761', 'Call OF Duty 3PS3.', 'Call OF Duty 3PS3.', 'Call OF Duty 3PS3. for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call OF Duty 3PS3. لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 2, 1, '/media/products/inventory-200/rq-0121-5030917096761-call-of-duty-3ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":36,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://retrogamefan.com/products/call-of-duty-3-playstation-3-like-new","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-3ps3-playstation-3-0121')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875833999', '047875833999', 'Call Of Duty 4 Modern Warefare', 'Call Of Duty 4 Modern Warefare', 'Call Of Duty 4 Modern Warefare for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty 4 Modern Warefare لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 7, 1, '/media/products/inventory-200/rq-0122-047875833999-call-of-duty-4-modern-warefare.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":36,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://gameplanet.com/producto/call-of-duty-4-modern-warfare-360-usado/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-4-modern-warefare-xbox-360-0122')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917071096', '5030917071096', 'Call Of Duty 4 Modern Warefare 2', 'Call Of Duty 4 Modern Warefare 2', 'Call Of Duty 4 Modern Warefare 2 for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty 4 Modern Warefare 2 لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0123-5030917071096-call-of-duty-4-modern-warefare-2.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":36,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.xzone.cz/call-of-duty-4-modern-warfare-game-of-the-year-edition-cz-bazar-pc","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-4-modern-warefare-2-pc-0123')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917285394', '5030917285394', 'Call Of Duty 4 Modern Warefare MW2', 'Call Of Duty 4 Modern Warefare MW2', 'Call Of Duty 4 Modern Warefare MW2 for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty 4 Modern Warefare MW2 لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0124-5030917285394-call-of-duty-4-modern-warefare-mw2.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":36,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://ecommerce.datablitz.com.ph/products/ps4-cod-modern-warfare-all","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-4-modern-warefare-mw2-playstation-4-0124')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875830790', '047875830790', 'Call Of Duty 4 Modern Warefare..', 'Call Of Duty 4 Modern Warefare..', 'Call Of Duty 4 Modern Warefare.. for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty 4 Modern Warefare.. لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0125-047875830790-call-of-duty-4-modern-warefare.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":36,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://thegamesdb.net/game.php?id=7159","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-4-modern-warefare-xbox-360-0125')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875834019', '047875834019', 'Call OF Duty 4 PS3', 'Call OF Duty 4 PS3', 'Call OF Duty 4 PS3 for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call OF Duty 4 PS3 لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 2, 1, '/media/products/inventory-200/rq-0126-047875834019-call-of-duty-4-ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":37,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.doublekoek.com/?d=cod-4-playstation-store-894145016","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-4-ps3-playstation-3-0126')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917148583', '5030917148583', 'Call Of Duty Advanced Warfare', 'Call Of Duty Advanced Warfare', 'Call Of Duty Advanced Warfare for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Advanced Warfare لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0127-5030917148583-call-of-duty-advanced-warfare.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":37,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.falabella.com.co/falabella-co/product/138326863/Call-of-duty-advanced-warfare-xbox-360/138326864","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-advanced-warfare-xbox-360-0127')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917148637', '5030917148637', 'Call Of Duty Advanced Warfare AR', 'Call Of Duty Advanced Warfare AR', 'Call Of Duty Advanced Warfare AR for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Advanced Warfare AR لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0128-5030917148637-call-of-duty-advanced-warfare-ar.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":37,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.jarir.com/video-games/non-branded-call-of-duty-game-titles-442687.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-advanced-warfare-ar-playstation-4-0128')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917148606', '5030917148606', 'Call Of Duty Advenced Warfare', 'Call Of Duty Advenced Warfare', 'Call Of Duty Advenced Warfare for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Advenced Warfare لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0129-5030917148606-call-of-duty-advenced-warfare.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":37,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.bodegaaurrera.com.mx/ip/xbox-one/call-of-duty-advanced-warfare-xbox-one-xbox-one-game/00004787587268","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-advenced-warfare-xbox-one-0129')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917146275', '5030917146275', 'Call Of Duty Advenced Warfare.', 'Call Of Duty Advenced Warfare.', 'Call Of Duty Advenced Warfare. for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Advenced Warfare. لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0130-5030917146275-call-of-duty-advenced-warfare.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":37,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://cashcrusaders.co.za/pre-owned/sony-call-of-duty-advanced-warfare-ps4/stockcode146270?stocknumber=10159087&storeguid=0666b021-e4c1-11e7-9f68-002590dc6c2a","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-advenced-warfare-playstation-4-0130')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917148620', '5030917148620', 'call of duty arabic', 'call of duty arabic', 'call of duty arabic for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'call of duty arabic لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0131-5030917148620-call-of-duty-arabic.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":38,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.walmart.com.mx/ip/call-of-duty-advanced-warfare-ps3-activision-ps3/00001230101985","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-arabic-playstation-3-0131')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917147500', '5030917147500', 'Call OF Duty Avenced Warfare', 'Call OF Duty Avenced Warfare', 'Call OF Duty Avenced Warfare for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call OF Duty Avenced Warfare لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0132-5030917147500-call-of-duty-avenced-warfare.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":38,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.xgamertechnologies.com/pcgame/Call%2BOf%2BDuty%2BCOD%2B11%2BAdvanced%2BWarfare","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-avenced-warfare-pc-0132')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917145810', '5030917145810', 'Call OF Duty Avenced Warfare PC', 'Call OF Duty Avenced Warfare PC', 'Call OF Duty Avenced Warfare PC for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call OF Duty Avenced Warfare PC لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0133-5030917145810-call-of-duty-avenced-warfare-pc.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":38,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.jeuxvideo.com/jeux/jeu-81788/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-avenced-warfare-pc-pc-0133')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875840034', '047875840034', 'Call Of Duty Black Ops', 'Call Of Duty Black Ops', 'Call Of Duty Black Ops for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Black Ops لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0134-047875840034-call-of-duty-black-ops.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":38,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.ubuy.com.lb/ar/product/1CZP1550-activision-call-of-duty-black-ops-xbox-360-pre-owned","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-black-ops-xbox-360-0134')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917181757', '5030917181757', 'Call Of Duty Black Ops 3', 'Call Of Duty Black Ops 3', 'Call Of Duty Black Ops 3 for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Black Ops 3 لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0135-5030917181757-call-of-duty-black-ops-3.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":39,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.cdiscount.com/jeux-pc-video-console/xbox-one/call-of-duty-black-ops-3-xbox-one/f-1030201-auc5030917162305.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-black-ops-3-xbox-one-0135')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917162497', '5030917162497', 'Call Of Duty Black Ops 3 PS3', 'Call Of Duty Black Ops 3 PS3', 'Call Of Duty Black Ops 3 PS3 for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Black Ops 3 PS3 لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0136-5030917162497-call-of-duty-black-ops-3-ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":39,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.jarir.com/non-branded-game-titles-451230.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-black-ops-3-ps3-playstation-3-0136')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917181658', '5030917181658', 'Call Of Duty Black Ops 3 PS4', 'Call Of Duty Black Ops 3 PS4', 'Call Of Duty Black Ops 3 PS4 for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Black Ops 3 PS4 لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0137-5030917181658-call-of-duty-black-ops-3-ps4.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":39,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.noon.com/saudi-en/call-of-duty-black-ops-3-intl-version-action-shooter-playstation-4-ps4/N11964085A/p/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-black-ops-3-ps4-playstation-4-0137')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917218576', '5030917218576', 'Call Of Duty', 'Call Of Duty', 'Call Of Duty for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0138-5030917218576-call-of-duty.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":39,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://lojaarenagames.com.br/call-of-duty-black-ops-4-ps4-ingles-seminovo/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-playstation-4-0138')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('1714', '1714', 'Call Of Duty Black Ops 4', 'Call Of Duty Black Ops 4', 'Call Of Duty Black Ops 4 for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Black Ops 4 لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 150, 150, 1, 1, '/media/products/inventory-200/rq-0139-1714-call-of-duty-black-ops-4.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":40,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://egygamer.com/en/call-of-duty-black-ops-4-ps4.html","barcodeIsNumeric":false,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-black-ops-4-playstation-4-0139')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('2262', '2262', 'Call Of Duty Black Ops 4.', 'Call Of Duty Black Ops 4.', 'Call Of Duty Black Ops 4. for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Black Ops 4. لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 150, 150, 1, 1, '/media/products/inventory-200/rq-0140-2262-call-of-duty-black-ops-4.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":40,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://egygamer.com/en/call-of-duty-black-ops-4-ps4.html","barcodeIsNumeric":false,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-black-ops-4-playstation-4-0140')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875884908', '047875884908', 'Call Of Duty Black OPS Cold War', 'Call Of Duty Black OPS Cold War', 'Call Of Duty Black OPS Cold War for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Black OPS Cold War لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0141-047875884908-call-of-duty-black-ops-cold-war.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":40,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://hry-pro-playstation-4.heureka.cz/call-of-duty-black-ops-cold-war/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-black-ops-cold-war-playstation-4-0141')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875840041', '047875840041', 'Call Of Duty Black Ops PS3', 'Call Of Duty Black Ops PS3', 'Call Of Duty Black Ops PS3 for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Black Ops PS3 لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0142-047875840041-call-of-duty-black-ops-ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":41,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.jnlgame.com/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-black-ops-ps3-playstation-3-0142')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875842397', '047875842397', 'Call Of Duty Black Ops PS3.', 'Call Of Duty Black Ops PS3.', 'Call Of Duty Black Ops PS3. for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Black Ops PS3. لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0143-047875842397-call-of-duty-black-ops-ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":41,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://martingames.com.uy/catalogo/juego-call-of-duty-black-ops-ps3-play-3_23016130_23016130","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-black-ops-ps3-playstation-3-0143')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875872646', '047875872646', 'Call Of Duty DAY ZERO', 'Call Of Duty DAY ZERO', 'Call Of Duty DAY ZERO for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty DAY ZERO لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0144-047875872646-call-of-duty-day-zero.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":41,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.jarir.com/video-games/sony-ps4/non-branded-call-of-duty-game-titles-434914.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-day-zero-playstation-4-0144')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917026362', '5030917026362', 'Call Of Duty Finest Hour', 'Call Of Duty Finest Hour', 'Call Of Duty Finest Hour for GameCube. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Finest Hour لمنصة GameCube. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'GameCube', 'GameCube', 'Nintendo', 'GameCube', 'PRE-OWNED', 220, 220, 1, 1, '/media/products/inventory-200/rq-0145-5030917026362-call-of-duty-finest-hour.jpg', '{"platform":"GameCube","platformGeneration":"GameCube","productKind":"Game","sourceInventoryPage":41,"originalInventoryCategory":"Nintendo/GameCube","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://gamesdb.launchbox-app.com/games/images/6658-call-of-duty-finest-hour","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-finest-hour-gamecube-0145')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917130731', '5030917130731', 'CALL OF DUTY GHOST', 'CALL OF DUTY GHOST', 'CALL OF DUTY GHOST for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'CALL OF DUTY GHOST لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 450, 450, 1, 1, '/media/products/inventory-200/rq-0146-5030917130731-call-of-duty-ghost.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":41,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Exact barcode: Ghosts Hardened Edition","sourceUrl":"https://www.retroplace.com/fr/jeux/133794--call-of-duty-ghosts","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-ghost-playstation-3-0146')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917125850', '5030917125850', 'Call Of Duty GHosts', 'Call Of Duty GHosts', 'Call Of Duty GHosts for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty GHosts لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0147-5030917125850-call-of-duty-ghosts.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":42,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.gamestop.com/video-games/xbox-360/products/call-of-duty-ghosts---xbox-360/953165.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-ghosts-xbox-360-0147')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917126079', '5030917126079', 'Call Of Duty GHosts PS3', 'Call Of Duty GHosts PS3', 'Call Of Duty GHosts PS3 for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty GHosts PS3 لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0148-5030917126079-call-of-duty-ghosts-ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":42,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.gamestop.com/video-games/products/call-of-duty-ghosts---playstation-3/930973.html?a=1","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-ghosts-ps3-playstation-3-0148')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917129179', '5030917129179', 'Call Of Duty GHosts PS3.', 'Call Of Duty GHosts PS3.', 'Call Of Duty GHosts PS3. for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty GHosts PS3. لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0149-5030917129179-call-of-duty-ghosts-ps3.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":42,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.gamestop.com/video-games/products/call-of-duty-ghosts---playstation-3/930973.html?a=1","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-ghosts-ps3-playstation-3-0149')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875846777', '047875846777', 'Call Of Duty GHosts.', 'Call Of Duty GHosts.', 'Call Of Duty GHosts. for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty GHosts. لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0150-047875846777-call-of-duty-ghosts.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":42,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.walmart.com/ip/233881940","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-ghosts-playstation-3-0150')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917125874', '5030917125874', 'Call Of Duty GHosts..', 'Call Of Duty GHosts..', 'Call Of Duty GHosts.. for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty GHosts.. لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0151-5030917125874-call-of-duty-ghosts.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":42,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.ebay.co.uk/itm/305137357257","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-ghosts-xbox-360-0151')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875846838', '047875846838', 'Call Of Duty GHosts...', 'Call Of Duty GHosts...', 'Call Of Duty GHosts... for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty GHosts... لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0152-047875846838-call-of-duty-ghosts.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":42,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.gamestop.com/video-games/products/call-of-duty-ghosts---xbox-one/954000.html?condition=Pre-Owned","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-ghosts-xbox-one-0152')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917125973', '5030917125973', 'Call Of Duty GHosts.0', 'Call Of Duty GHosts.0', 'Call Of Duty GHosts.0 for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty GHosts.0 لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0153-5030917125973-call-of-duty-ghosts-0.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":43,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.falabella.com.co/falabella-co/product/123238597/Call-of-duty-ghosts-xbox-one/123238598","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-ghosts0-xbox-one-0153')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917197109', '5030917197109', 'Call Of Duty Infinite Warfare', 'Call Of Duty Infinite Warfare', 'Call Of Duty Infinite Warfare for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Infinite Warfare لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0154-5030917197109-call-of-duty-infinite-warfare.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":43,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.thegamebusters.it/xbox-one/825-call-of-duty-infinite-warfare-xbox-one-5030917196959.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-infinite-warfare-xbox-one-0154')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917205538', '5030917205538', 'Call Of Duty Infinite Warfare PC', 'Call Of Duty Infinite Warfare PC', 'Call Of Duty Infinite Warfare PC for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Infinite Warfare PC لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0155-5030917205538-call-of-duty-infinite-warfare-pc.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":43,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://egynewtech.com/en/pc-physical-dvds/call-of-duty-infinite-warfare-pc-dvd-disc?srsltid=AfmBOoqWKS3Nh4ogWDnUVZrUa8EMSzGd1NrAq8J1V3fnPuOy2h4D_Kc7","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-infinite-warfare-pc-pc-0155')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917285271', '5030917285271', 'Call Of Duty Modern Warfare ..', 'Call Of Duty Modern Warfare ..', 'Call Of Duty Modern Warfare .. for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty Modern Warfare .. لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0156-5030917285271-call-of-duty-modern-warfare.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":43,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://empire.co.tz/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-modern-warfare-playstation-4-0156')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917096853', '5030917096853', 'Call Of Duty MW3', 'Call Of Duty MW3', 'Call Of Duty MW3 for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty MW3 لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 3, 1, '/media/products/inventory-200/rq-0157-5030917096853-call-of-duty-mw3.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":43,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.pricecharting.com/es/game/xbox-360/call-of-duty-modern-warfare-3","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-mw3-xbox-360-0157')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917096945', '5030917096945', 'Call OF Duty MW3 PC', 'Call OF Duty MW3 PC', 'Call OF Duty MW3 PC for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call OF Duty MW3 PC لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0158-5030917096945-call-of-duty-mw3-pc.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":44,"originalInventoryCategory":"PC","imageMatchStatus":"Exact title/platform image match","sourceUrl":"https://www.ebay.com/itm/155966668140","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-mw3-pc-pc-0158')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917063398', '5030917063398', 'Call Of Duty World At War', 'Call Of Duty World At War', 'Call Of Duty World At War for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty World At War لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0159-5030917063398-call-of-duty-world-at-war.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":44,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://retrospillkongen.no/products/renovert-call-of-duty-world-at-war-xbox-360-spill","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-world-at-war-xbox-360-0159')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917063404', '5030917063404', 'Call Of Duty World At War PC', 'Call Of Duty World At War PC', 'Call Of Duty World At War PC for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty World At War PC لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0160-5030917063404-call-of-duty-world-at-war-pc.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":44,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.croma.com/activision-pc-game-call-of-duty-world-at-war-/p/207135?srsltid=AfmBOoq1aUaKF1UlMApiVB88yeQj6nY0oevxSa5dsOhCHIv7g0ZSD3xv","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-world-at-war-pc-pc-0160')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875832817', '047875832817', 'Call Of Duty World At War..', 'Call Of Duty World At War..', 'Call Of Duty World At War.. for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty World At War.. لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0161-047875832817-call-of-duty-world-at-war.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":45,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.ebay.com/itm/325520121511","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-world-at-war-xbox-360-0161')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917219726', '5030917219726', 'Call Of Duty WW2', 'Call Of Duty WW2', 'Call Of Duty WW2 for Xbox One. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty WW2 لمنصة Xbox One. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'Xbox One', 'XboxOne', 'Microsoft', 'XboxOne', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0162-5030917219726-call-of-duty-ww2.jpg', '{"platform":"Xbox One","platformGeneration":"XboxOne","productKind":"Game","sourceInventoryPage":45,"originalInventoryCategory":"Xbox/XboxOne","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://er-games.shop/Xbox-One/521-call-of-duty-wwii-xbox-one-uk-pegi-englisch-uncut-inklusive-symbolik-er-games-er-gamesshop-5030917215087.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-ww2-xbox-one-0162')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875881105', '047875881105', 'Call Of Duty WW2 .', 'Call Of Duty WW2 .', 'Call Of Duty WW2 . for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty WW2 . لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0163-047875881105-call-of-duty-ww2.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":45,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.365games.co.uk/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-ww2-playstation-4-0163')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917219788', '5030917219788', 'Call Of Duty WW2 4', 'Call Of Duty WW2 4', 'Call Of Duty WW2 4 for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Duty WW2 4 لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0164-5030917219788-call-of-duty-ww2-4.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":45,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.falabella.com.co/falabella-co/product/123197774/call-of-duty-wwii-playstation-4/123197775","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-duty-ww2-4-playstation-4-0164')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('008888523635', '008888523635', 'Call Of Juarez', 'Call Of Juarez', 'Call Of Juarez for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Juarez لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 2, 1, '/media/products/inventory-200/rq-0165-008888523635-call-of-juarez.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":45,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.dialupgames.com/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-juarez-xbox-360-0165')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('008888525141', '008888525141', 'Call Of Juarez', 'Call Of Juarez', 'Call Of Juarez for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Call Of Juarez لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0166-008888525141-call-of-juarez.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":45,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.dialupgames.com/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'call-of-juarez-xbox-360-0166')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('013388350162', '013388350162', 'CapCom', 'CapCom', 'CapCom for Wii. Pre-owned authentic item from Retro Qatar verified inventory.', 'CapCom لمنصة Wii. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Wii', 'Wii', 'Nintendo', 'Wii', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0167-013388350162-capcom.jpg', '{"platform":"Wii","platformGeneration":"Wii","productKind":"Game","sourceInventoryPage":46,"originalInventoryCategory":"Nintendo/Wii","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.ricardo.ch/de/a/monster-hunter-tri-3-%28wii%29-1306530952/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'capcom-wii-0167')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3391892009873', '3391892009873', 'Captain Tsubasa', 'Captain Tsubasa', 'Captain Tsubasa for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Captain Tsubasa لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0168-3391892009873-captain-tsubasa.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":46,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.bacelltech.com.br/jogo-captain-tsubasa-rise-of-new-champions-ps4","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'captain-tsubasa-playstation-4-0168')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5026102276506', '5026102276506', 'casper', 'casper', 'casper for Saturn. Pre-owned authentic item from Retro Qatar verified inventory.', 'casper لمنصة Saturn. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Saturn', 'Saturn', 'Sega', 'Saturn', 'PRE-OWNED', 350, 350, 1, 1, '/media/products/inventory-200/rq-0169-5026102276506-casper.jpg', '{"platform":"Saturn","platformGeneration":"Saturn","productKind":"Game","sourceInventoryPage":46,"originalInventoryCategory":"Sega/Saturn","imageMatchStatus":"Exact title/platform image match","sourceUrl":"https://www.estarland.com/product-description/SegaSaturn/Casper/5651","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'casper-saturn-0169')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('70310916', '70310916', 'CD xxpsdvd', 'CD xxpsdvd', 'CD xxpsdvd for Media. Pre-owned authentic item from Retro Qatar verified inventory.', 'CD xxpsdvd لمنصة Media. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Accessories', 'Accessories', 'Media', 'Media', 'Various', 'Media', 'PRE-OWNED', 20, 20, 20, 1, '/media/products/inventory-200/rq-0170-70310916-cd-xxpsdvd.jpg', '{"platform":"Media","platformGeneration":"Media","productKind":"Accessory","sourceInventoryPage":47,"originalInventoryCategory":"Accessories/Media","imageMatchStatus":"Generic product image; item identification review","sourceUrl":"https://www.ebay.com/itm/405387958846","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'cd-xxpsdvd-media-0170')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('4020628674366', '4020628674366', 'Chorvs Day One Edition', 'Chorvs Day One Edition', 'Chorvs Day One Edition for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Chorvs Day One Edition لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0171-4020628674366-chorvs-day-one-edition.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":47,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://uk.webuy.com/product-detail/?id=4020628674410","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'chorvs-day-one-edition-playstation-4-0171')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5026555065368', '5026555065368', 'Civilization 5', 'Civilization 5', 'Civilization 5 for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Civilization 5 لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 150, 150, 1, 1, '/media/products/inventory-200/rq-0172-5026555065368-civilization-5.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":47,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.bol.com/nl/nl/p/civilization-5-goty/9200000018790838/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'civilization-5-pc-0172')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('767649401673', '767649401673', 'Clive Barker`s Jericho', 'Clive Barker`s Jericho', 'Clive Barker`s Jericho for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Clive Barker`s Jericho لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0173-767649401673-clive-barker-s-jericho.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":47,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.spankyslootstash.com/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'clive-barkers-jericho-xbox-360-0173')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('045496883270', '045496883270', 'Color Screen', 'Color Screen', 'Color Screen for 3DS. Pre-owned authentic item from Retro Qatar verified inventory.', 'Color Screen لمنصة 3DS. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', '3DS', '3DS', 'Nintendo', '3DS', 'PRE-OWNED', 450, 450, 1, 1, '/media/products/inventory-200/rq-0174-045496883270-color-screen.jpg', '{"platform":"3DS","platformGeneration":"3DS","productKind":"Game","sourceInventoryPage":48,"originalInventoryCategory":"Nintendo/3DS","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.mariowiki.com/File%3ACosmo_Black_3DS_Box_UK.png","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'color-screen-3ds-0174')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5028587080913', '5028587080913', 'Command Conquer', 'Command Conquer', 'Command Conquer for Saturn. Pre-owned authentic item from Retro Qatar verified inventory.', 'Command Conquer لمنصة Saturn. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Saturn', 'Saturn', 'Sega', 'Saturn', 'PRE-OWNED', 300, 300, 1, 1, '/media/products/inventory-200/rq-0175-5028587080913-command-conquer.jpg', '{"platform":"Saturn","platformGeneration":"Saturn","productKind":"Game","sourceInventoryPage":48,"originalInventoryCategory":"Sega/Saturn","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.retroplace.com/en/games/51286--command-conquer","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'command-conquer-saturn-0175')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('014633155723', '014633155723', 'Command Conquer Tiberium Wars', 'Command Conquer Tiberium Wars', 'Command Conquer Tiberium Wars for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Command Conquer Tiberium Wars لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0176-014633155723-command-conquer-tiberium-wars.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":48,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.seconddisc.fi/tuote/command-conquer-3-tiberium-wars-xbox-360/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'command-conquer-tiberium-wars-xbox-360-0176')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5032921013840', '5032921013840', 'Commandos 2', 'Commandos 2', 'Commandos 2 for PlayStation 2. Pre-owned authentic item from Retro Qatar verified inventory.', 'Commandos 2 لمنصة PlayStation 2. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 2', 'PS2', 'Sony', 'PS2', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0177-5032921013840-commandos-2.jpg', '{"platform":"PlayStation 2","platformGeneration":"PS2","productKind":"Game","sourceInventoryPage":48,"originalInventoryCategory":"PlayStation/PS2","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://pnpgamesonline.com/product/commandos-2/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'commandos-2-playstation-2-0177')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('CompanyOfHeroes3', 'CompanyOfHeroes3', 'Company Of Heroes 3', 'Company Of Heroes 3', 'Company Of Heroes 3 for PlayStation 5. Pre-owned authentic item from Retro Qatar verified inventory.', 'Company Of Heroes 3 لمنصة PlayStation 5. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 5', 'PS5', 'Sony', 'PS5', 'PRE-OWNED', 0, 0, 1, 1, '/media/products/inventory-200/rq-0178-companyofheroes3-company-of-heroes-3.jpg', '{"platform":"PlayStation 5","platformGeneration":"PS5","productKind":"Game","sourceInventoryPage":48,"originalInventoryCategory":"PlayStation/PS5","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.gamestop.com/video-games/products/company-of-heroes-3/20005030.html","barcodeIsNumeric":false,"needsPriceReview":true,"currency":"QAR"}'::jsonb, false, 'draft', 'company-of-heroes-3-playstation-5-0178')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('4020628772901', '4020628772901', 'Conan Exiles', 'Conan Exiles', 'Conan Exiles for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Conan Exiles لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0179-4020628772901-conan-exiles.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":49,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://vandal.elespanol.com/juegos/ps4/conan-exiles/35921","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'conan-exiles-playstation-4-0179')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('010086680010', '010086680010', 'Condemnedz criminal origins', 'Condemnedz criminal origins', 'Condemnedz criminal origins for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Condemnedz criminal origins لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0180-010086680010-condemnedz-criminal-origins.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":49,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.thevideogamecompany.com/products/condemned-criminal-origins-microsoft-xbox-360?srsltid=AfmBOorzE2Wt4o3U3cGcgBqRKaDvOC0Uk_JkuCs47oUGxInPWOLRzdjX","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'condemnedz-criminal-origins-xbox-360-0180')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3307210402080', '3307210402080', 'Conflict Zone Modern War Strategy', 'Conflict Zone Modern War Strategy', 'Conflict Zone Modern War Strategy for PlayStation 2. Pre-owned authentic item from Retro Qatar verified inventory.', 'Conflict Zone Modern War Strategy لمنصة PlayStation 2. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 2', 'PS2', 'Sony', 'PS2', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0181-3307210402080-conflict-zone-modern-war-strategy.jpg', '{"platform":"PlayStation 2","platformGeneration":"PS2","productKind":"Game","sourceInventoryPage":49,"originalInventoryCategory":"PlayStation/PS2","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://gamesdb.launchbox-app.com/games/images/31679-conflict-zone-modern-war-strategy","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'conflict-zone-modern-war-strategy-playstation-2-0181')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('ps1control', 'ps1control', 'control ps1', 'control ps1', 'control ps1 for PlayStation. Pre-owned authentic item from Retro Qatar verified inventory.', 'control ps1 لمنصة PlayStation. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Accessories', 'Controllers', 'PlayStation', 'PlayStation', 'Sony', 'PlayStation', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0182-ps1control-control-ps1.jpg', '{"platform":"PlayStation","platformGeneration":"PlayStation","productKind":"Accessory","sourceInventoryPage":50,"originalInventoryCategory":"Accessories/PlayStation","imageMatchStatus":"Product type/platform image match","sourceUrl":"https://www.konsolenkost.de/playstation-1-original-sony-controller-scph-1080-weiss-gebraucht_9030882_110130/","barcodeIsNumeric":false,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'control-ps1-playstation-0182')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('ps2 Control', 'ps2 Control', 'control ps2..', 'control ps2..', 'control ps2.. for PlayStation. Pre-owned authentic item from Retro Qatar verified inventory.', 'control ps2.. لمنصة PlayStation. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Accessories', 'Controllers', 'PlayStation', 'PlayStation', 'Sony', 'PlayStation', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0183-ps2-control-control-ps2.jpg', '{"platform":"PlayStation","platformGeneration":"PlayStation","productKind":"Accessory","sourceInventoryPage":50,"originalInventoryCategory":"Accessories/PlayStation","imageMatchStatus":"Product type/platform image match","sourceUrl":"https://www.dicksmith.com.au/da/buy/the-gamesmen-sony-playstation-2-dualshock-controller-black-refurbished-pos-214007/","barcodeIsNumeric":false,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'control-ps2-playstation-0183')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('70310916Ps3control', '70310916Ps3control', 'control Ps3', 'control Ps3', 'control Ps3 for PlayStation. Pre-owned authentic item from Retro Qatar verified inventory.', 'control Ps3 لمنصة PlayStation. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Accessories', 'Controllers', 'PlayStation', 'PlayStation', 'Sony', 'PlayStation', 'PRE-OWNED', 100, 100, 10, 1, '/media/products/inventory-200/rq-0184-70310916ps3control-control-ps3.jpg', '{"platform":"PlayStation","platformGeneration":"PlayStation","productKind":"Accessory","sourceInventoryPage":50,"originalInventoryCategory":"Accessories/PlayStation","imageMatchStatus":"Product type/platform image match","sourceUrl":"https://www.techtudo.com.br/dicas-e-tutoriais/2022/10/como-conectar-controle-de-ps3-no-pc.ghtml","barcodeIsNumeric":false,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'control-ps3-playstation-0184')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('4902370522846', '4902370522846', 'Control Wii U', 'Control Wii U', 'Control Wii U for GameCube. Pre-owned authentic item from Retro Qatar verified inventory.', 'Control Wii U لمنصة GameCube. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Accessories', 'Controllers', 'GameCube', 'GameCube', 'Nintendo', 'GameCube', 'PRE-OWNED', 300, 300, 1, 1, '/media/products/inventory-200/rq-0185-4902370522846-control-wii-u.jpg', '{"platform":"GameCube","platformGeneration":"GameCube","productKind":"Accessory","sourceInventoryPage":50,"originalInventoryCategory":"Accessories/GameCube","imageMatchStatus":"Exact barcode/product image","sourceUrl":"https://www.estarland.com/product-description/GameCube/Nintendo-GameCube-Super-Smash-Bros-4-Edition-White-Controller-Trade-In-Imported-GameCube/46670","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'control-wii-u-gamecube-0185')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('ps5 cont', 'ps5 cont', 'controler ps5', 'controler ps5', 'controler ps5 for PlayStation. Pre-owned authentic item from Retro Qatar verified inventory.', 'controler ps5 لمنصة PlayStation. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Accessories', 'Controllers', 'PlayStation', 'PlayStation', 'Sony', 'PlayStation', 'PRE-OWNED', 140, 140, 3, 1, '/media/products/inventory-200/rq-0186-ps5-cont-controler-ps5.jpg', '{"platform":"PlayStation","platformGeneration":"PlayStation","productKind":"Accessory","sourceInventoryPage":50,"originalInventoryCategory":"Accessories/PlayStation","imageMatchStatus":"Product type/platform image match","sourceUrl":"https://shashinki.com/shop/sony-playstation-dualsense-wireless-controller-p-51582.html","barcodeIsNumeric":false,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'controler-ps5-playstation-0186')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('70937755ControlerXbox1', '70937755ControlerXbox1', 'Controler Xbox 1', 'Controler Xbox 1', 'Controler Xbox 1 for Xbox. Pre-owned authentic item from Retro Qatar verified inventory.', 'Controler Xbox 1 لمنصة Xbox. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Accessories', 'Controllers', 'Xbox', 'Xbox', 'Microsoft', 'Xbox', 'PRE-OWNED', 200, 200, 1, 1, '/media/products/inventory-200/rq-0187-70937755controlerxbox1-controler-xbox-1.jpg', '{"platform":"Xbox","platformGeneration":"Xbox","productKind":"Accessory","sourceInventoryPage":51,"originalInventoryCategory":"Accessories/Xbox","imageMatchStatus":"Product type/platform image match","sourceUrl":"https://www.euro.com.pl/kontrolery-do-gier/microsoft-xbox-one-wireless-controller-3-5-mm-jack.bhtml","barcodeIsNumeric":false,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'controler-xbox-1-xbox-0187')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5016743011901', '5016743011901', 'Controler Zip Stik', 'Controler Zip Stik', 'Controler Zip Stik for Accessories. Pre-owned authentic item from Retro Qatar verified inventory.', 'Controler Zip Stik لمنصة Accessories. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Accessories', 'Controllers', 'Accessories', 'Accessories', 'Atari', 'Accessories', 'PRE-OWNED', 250, 250, 1, 1, '/media/products/inventory-200/rq-0188-5016743011901-controler-zip-stik.jpg', '{"platform":"Accessories","platformGeneration":"Accessories","productKind":"Accessory","sourceInventoryPage":51,"originalInventoryCategory":"Atari/Accessories","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.wtsretro.dk/shop/commodore-amiga/commodore/commodore-hardware/euromax-zip-stik-joystick/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'controler-zip-stik-accessories-0188')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('6973162050357', '6973162050357', 'Controller adapter pa1 ps2', 'Controller adapter pa1 ps2', 'Controller adapter pa1 ps2 for Adapter. Pre-owned authentic item from Retro Qatar verified inventory.', 'Controller adapter pa1 ps2 لمنصة Adapter. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Accessories', 'Controllers', 'Adapter', 'Adapter', 'Various', 'Adapter', 'PRE-OWNED', 200, 200, 25, 1, '/media/products/inventory-200/rq-0189-6973162050357-controller-adapter-pa1-ps2.jpg', '{"platform":"Adapter","platformGeneration":"Adapter","productKind":"Accessory","sourceInventoryPage":51,"originalInventoryCategory":"Accessories/Adapter","imageMatchStatus":"Exact product/platform image match","sourceUrl":"https://gamecops.com/products/new-interact-ps-one-4-controller-hub-multiplayer-adapter-playstation-1-ps1-psx","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'controller-adapter-pa1-ps2-adapter-0189')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('70937755meliter', '70937755meliter', 'Controller Ps5', 'Controller Ps5', 'Controller Ps5 for PlayStation. Pre-owned authentic item from Retro Qatar verified inventory.', 'Controller Ps5 لمنصة PlayStation. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Accessories', 'Controllers', 'PlayStation', 'PlayStation', 'Sony', 'PlayStation', 'PRE-OWNED', 250, 250, 1, 1, '/media/products/inventory-200/rq-0190-70937755meliter-controller-ps5.jpg', '{"platform":"PlayStation","platformGeneration":"PlayStation","productKind":"Accessory","sourceInventoryPage":51,"originalInventoryCategory":"Accessories/PlayStation","imageMatchStatus":"Product type/platform image match","sourceUrl":"https://gamelaunchermt.wixsite.com/gamelaunchermalta/product-page/ps5-dualsense-wireless-controller","barcodeIsNumeric":false,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'controller-ps5-playstation-0190')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('7890268125682', '7890268125682', 'converter AV to Hdmi', 'converter AV to Hdmi', 'converter AV to Hdmi for Video. Pre-owned authentic item from Retro Qatar verified inventory.', 'converter AV to Hdmi لمنصة Video. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Accessories', 'Controllers', 'Video', 'Video', 'Various', 'Video', 'PRE-OWNED', 70, 70, 3, 1, '/media/products/inventory-200/rq-0191-7890268125682-converter-av-to-hdmi.jpg', '{"platform":"Video","platformGeneration":"Video","productKind":"Accessory","sourceInventoryPage":52,"originalInventoryCategory":"Accessories/Video","imageMatchStatus":"Product type image match","sourceUrl":"https://www.thewarehouse.co.nz/p/1080p-av-to-hdmi-converter/M7782346.html","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'converter-av-to-hdmi-video-0191')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030930048327', '5030930048327', 'Counter Strike 1 PC', 'Counter Strike 1 PC', 'Counter Strike 1 PC for PC. Pre-owned authentic item from Retro Qatar verified inventory.', 'Counter Strike 1 PC لمنصة PC. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PC', 'PC', 'PC', 'PC', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0192-5030930048327-counter-strike-1-pc.jpg', '{"platform":"PC","platformGeneration":"PC","productKind":"Game","sourceInventoryPage":52,"originalInventoryCategory":"PC","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.eponuda.com/digitalni-kodovi-za-igrice-cene/steam-counter-strike-1-anthology-pc-key-global-cena-40235883","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'counter-strike-1-pc-pc-0192')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('882224260596', '882224260596', 'Crackdown', 'Crackdown', 'Crackdown for Xbox 360. Pre-owned authentic item from Retro Qatar verified inventory.', 'Crackdown لمنصة Xbox 360. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'Xbox 360', 'Xbox360', 'Microsoft', 'Xbox360', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0193-882224260596-crackdown.jpg', '{"platform":"Xbox 360","platformGeneration":"Xbox360","productKind":"Game","sourceInventoryPage":53,"originalInventoryCategory":"Xbox/Xbox360","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.meugameusado.com.br/jogo-crackdown-xbox-360","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'crackdown-xbox-360-0193')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('020626712552', '020626712552', 'Crash Bandi Coot', 'Crash Bandi Coot', 'Crash Bandi Coot for PlayStation 2. Pre-owned authentic item from Retro Qatar verified inventory.', 'Crash Bandi Coot لمنصة PlayStation 2. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 2', 'PS2', 'Sony', 'PS2', 'PRE-OWNED', 100, 100, 2, 1, '/media/products/inventory-200/rq-0194-020626712552-crash-bandi-coot.jpg', '{"platform":"PlayStation 2","platformGeneration":"PS2","productKind":"Game","sourceInventoryPage":53,"originalInventoryCategory":"PlayStation/PS2","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://retrogamefan.com/products/crash-twinsanity-for-playstation-2-ps2-very-good","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'crash-bandi-coot-playstation-2-0194')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('020626727563', '020626727563', 'Crash Mind Over Muntant', 'Crash Mind Over Muntant', 'Crash Mind Over Muntant for PlayStation 3. Pre-owned authentic item from Retro Qatar verified inventory.', 'Crash Mind Over Muntant لمنصة PlayStation 3. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 3', 'PS3', 'Sony', 'PS3', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0195-020626727563-crash-mind-over-muntant.jpg', '{"platform":"PlayStation 3","platformGeneration":"PS3","productKind":"Game","sourceInventoryPage":53,"originalInventoryCategory":"PlayStation/PS3","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://www.deviantart.com/sonicloud1213/art/Crash-Mind-over-Mutant-PlayStation-3-2008-909467610","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'crash-mind-over-muntant-playstation-3-0195')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917211034', '5030917211034', 'Crash N Sane Trilogy', 'Crash N Sane Trilogy', 'Crash N Sane Trilogy for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Crash N Sane Trilogy لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0196-5030917211034-crash-n-sane-trilogy.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":53,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://gamingcenter.ly/product/crash-bandicoot-n-sane-trilogy-for-playstation-4/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'crash-n-sane-trilogy-playstation-4-0196')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030917211041', '5030917211041', 'Crash N Sane Trilogy .', 'Crash N Sane Trilogy .', 'Crash N Sane Trilogy . for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Crash N Sane Trilogy . لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0197-5030917211041-crash-n-sane-trilogy.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":53,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://gamingcenter.ly/product/crash-bandicoot-n-sane-trilogy-for-playstation-4/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'crash-n-sane-trilogy-playstation-4-0197')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('047875880801', '047875880801', 'Crash N Sane Trilogy 3', 'Crash N Sane Trilogy 3', 'Crash N Sane Trilogy 3 for PlayStation 4. Pre-owned authentic item from Retro Qatar verified inventory.', 'Crash N Sane Trilogy 3 لمنصة PlayStation 4. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Gaming', 'Games', 'PlayStation 4', 'PS4', 'Sony', 'PS4', 'PRE-OWNED', 100, 100, 1, 1, '/media/products/inventory-200/rq-0198-047875880801-crash-n-sane-trilogy-3.jpg', '{"platform":"PlayStation 4","platformGeneration":"PS4","productKind":"Game","sourceInventoryPage":54,"originalInventoryCategory":"PlayStation/PS4","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://astorebreak.com/%D9%83%D8%B1%D8%A7%D8%B4-%D9%83%D8%B1%D8%A7%D8%B4-%D8%A8%D9%86%D8%AF%D9%8A%D9%83%D9%88%D8%AA-crash-bandicoot-n-sane-trilogy-ps4/p1715962742","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'crash-n-sane-trilogy-3-playstation-4-0198')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('3348542200289', '3348542200289', 'Crash TAG Team Racing', 'Crash TAG Team Racing', 'Crash TAG Team Racing for PlayStation 2. Pre-owned authentic item from Retro Qatar verified inventory.', 'Crash TAG Team Racing لمنصة PlayStation 2. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 2', 'PS2', 'Sony', 'PS2', 'PRE-OWNED', 100, 100, 2, 1, '/media/products/inventory-200/rq-0199-3348542200289-crash-tag-team-racing.jpg', '{"platform":"PlayStation 2","platformGeneration":"PS2","productKind":"Game","sourceInventoryPage":54,"originalInventoryCategory":"PlayStation/PS2","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://retromtl.com/","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'crash-tag-team-racing-playstation-2-0199')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
INSERT INTO products (sku, barcode, name_en, name_ar, description_en, description_ar, category, sub_category, platform, generation, brand, model, condition, cost_price, selling_price, stock_qty, low_stock_threshold, image_url, specs, is_featured, status, slug)
VALUES ('5030930034245', '5030930034245', 'Cricket 2004', 'Cricket 2004', 'Cricket 2004 for PlayStation 2. Pre-owned authentic item from Retro Qatar verified inventory.', 'Cricket 2004 لمنصة PlayStation 2. منتج أصلي ومفحوص من مخزون ريترو قطر.', 'Retro Gaming', 'Games', 'PlayStation 2', 'PS2', 'Sony', 'PS2', 'PRE-OWNED', 0, 100, 1, 1, '/media/products/inventory-200/rq-0200-5030930034245-cricket-2004.jpg', '{"platform":"PlayStation 2","platformGeneration":"PS2","productKind":"Game","sourceInventoryPage":54,"originalInventoryCategory":"PlayStation/PS2","imageMatchStatus":"Title/platform image match; edition review","sourceUrl":"https://retrosales.com.au/products/game-sony-playstation2-cricket-2004","barcodeIsNumeric":true,"needsPriceReview":false,"currency":"QAR"}'::jsonb, false, 'published', 'cricket-2004-playstation-2-0200')
ON CONFLICT (sku) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  selling_price = EXCLUDED.selling_price,
  cost_price = EXCLUDED.cost_price,
  stock_qty = EXCLUDED.stock_qty,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  platform = EXCLUDED.platform,
  specs = EXCLUDED.specs,
  status = EXCLUDED.status,
  updated_at = NOW();
