-- ==============================================================================
-- STEP 1: TABLES, CONSTRAINTS, INDEXES & RLS POLICIES (Lightweight ~15 KB)
-- Run this in Supabase SQL Editor first
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. EMPLOYEES TABLE
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'cashier', 'technician', 'warehouse')),
    phone VARCHAR(50),
    commission_rate DECIMAL(5, 2) DEFAULT 0.00,
    branch VARCHAR(100) DEFAULT 'Msheireb HQ',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255),
    loyalty_points INT DEFAULT 0,
    store_credit DECIMAL(10, 2) DEFAULT 0.00,
    membership_level VARCHAR(50) DEFAULT 'Bronze' CHECK (membership_level IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    outstanding_balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUCTS TABLE
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
    condition VARCHAR(50) DEFAULT 'New',
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
    variations JSONB,
    product_type VARCHAR(100) DEFAULT 'PHYSICAL PRODUCT',
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
    weight VARCHAR(100),
    dimensions VARCHAR(100),
    related_products TEXT[],
    compatible_products TEXT[],
    accessories TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. REPAIRS TABLE
CREATE TABLE IF NOT EXISTS repairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    device_type VARCHAR(100) NOT NULL,
    device_brand VARCHAR(100),
    device_model VARCHAR(100),
    serial_number VARCHAR(100),
    problem_description TEXT NOT NULL,
    technician_notes TEXT,
    status VARCHAR(50) DEFAULT 'Received' CHECK (status IN ('Received', 'Diagnosing', 'Waiting for Parts', 'In Progress', 'Testing', 'Ready', 'Collected', 'Cancelled')),
    priority VARCHAR(50) DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High', 'Urgent')),
    estimated_cost DECIMAL(10, 2) DEFAULT 0.00,
    final_cost DECIMAL(10, 2) DEFAULT 0.00,
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    warranty_months INT DEFAULT 3,
    warranty_expiry DATE,
    technician_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    images_urls TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_no VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    employee_name VARCHAR(255),
    source VARCHAR(50) DEFAULT 'POS' CHECK (source IN ('POS', 'E-Commerce')),
    branch VARCHAR(100) DEFAULT 'Msheireb HQ',
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    vat_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    profit_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    split_payment_details JSONB,
    payment_status VARCHAR(50) DEFAULT 'Paid' CHECK (payment_status IN ('Paid', 'Unpaid', 'Partially Paid', 'Refunded')),
    items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS store_settings (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY & POLICIES
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON products;
CREATE POLICY "Public Read Access" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Full Access" ON products;
CREATE POLICY "Public Full Access" ON products FOR ALL USING (true);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON store_settings;
CREATE POLICY "Public Read Access" ON store_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Full Access" ON store_settings;
CREATE POLICY "Public Full Access" ON store_settings FOR ALL USING (true);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON customers FOR SELECT USING (true);
CREATE POLICY "Public Full Access" ON customers FOR ALL USING (true);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON employees FOR SELECT USING (true);

ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Full Access" ON repairs FOR ALL USING (true);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Full Access" ON transactions FOR ALL USING (true);

-- 8. INDEXES
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_repairs_ticket ON repairs(ticket_id);
CREATE INDEX IF NOT EXISTS idx_transactions_invoice ON transactions(invoice_no);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

