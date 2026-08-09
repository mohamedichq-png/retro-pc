-- RETRO Enterprise Platform - PostgreSQL / Supabase Database Schema
-- Includes tables for E-Commerce, POS, CRM, ERP, and Repair Management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------
-- 1. EMPLOYEES TABLE (ERP & Security Roles)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'cashier', 'technician', 'warehouse')),
    phone VARCHAR(50),
    commission_rate DECIMAL(5, 2) DEFAULT 0.00, -- e.g. 5.00 for 5% commission on repairs/sales
    branch VARCHAR(100) DEFAULT 'Msheireb HQ',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------
-- 2. CUSTOMERS TABLE (CRM & Loyalty Points)
-- ----------------------------------------------------
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

-- ----------------------------------------------------
-- 3. PRODUCTS TABLE (Unified E-Commerce + POS + ERP)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    condition VARCHAR(50) DEFAULT 'New' CHECK (condition IN ('New', 'Used', 'Refurbished')),
    
    -- Pricing
    cost_price DECIMAL(10, 2) NOT NULL, -- For Profit/Loss calculations
    selling_price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2), -- Promotional/discount price
    vat_rate DECIMAL(5, 2) DEFAULT 0.00, -- Qatar standard VAT is currently 0%, pre-setup for future
    
    -- Stock & Inventory
    stock_qty INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    serial_numbers TEXT[], -- Array of serial numbers for high-value items
    
    -- Media & Specs
    image_url TEXT,
    gallery_urls TEXT[],
    specs JSONB, -- Dynamic specifications (CPU, GPU, RAM, etc.)
    
    -- Metadata
    is_digital BOOLEAN DEFAULT FALSE,
    digital_link TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    variations JSONB, -- Array of ProductVariation objects for nested options
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------
-- 4. REPAIR TICKETS TABLE (Service Management)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS repairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., RT-2026-0001
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    
    device_type VARCHAR(100) NOT NULL, -- Gaming PC, Laptop, PS5, Xbox Series X, Switch, Controller
    device_brand VARCHAR(100),
    device_model VARCHAR(100),
    serial_number VARCHAR(100),
    problem_description TEXT NOT NULL,
    technician_notes TEXT,
    
    status VARCHAR(50) DEFAULT 'Received' CHECK (status IN ('Received', 'Diagnosing', 'Waiting for Parts', 'In Progress', 'Testing', 'Ready', 'Collected', 'Cancelled')),
    priority VARCHAR(50) DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High', 'Urgent')),
    
    -- Financials & Warranty
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

-- ----------------------------------------------------
-- 5. TRANSACTIONS TABLE (POS and Online Orders)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_no VARCHAR(100) UNIQUE NOT NULL, -- e.g., INV-RETRO-00001
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL, -- Cashier
    employee_name VARCHAR(255),
    
    source VARCHAR(50) DEFAULT 'POS' CHECK (source IN ('POS', 'E-Commerce')),
    branch VARCHAR(100) DEFAULT 'Msheireb HQ',
    
    -- Totals
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    vat_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    profit_amount DECIMAL(10, 2) NOT NULL, -- total - costs
    
    -- Payments
    payment_method VARCHAR(100) NOT NULL, -- Cash, Card, Apple Pay, Split
    split_payment_details JSONB, -- For logging multiple payment types in a single bill
    payment_status VARCHAR(50) DEFAULT 'Paid' CHECK (payment_status IN ('Paid', 'Unpaid', 'Partially Paid', 'Refunded')),
    
    -- Items Log
    items JSONB NOT NULL, -- Array of objects: { product_id, sku, name, qty, price, cost }
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------
-- 6. AUDIT LOGS (Employee Activity Tracker)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for high-performance lookups
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_repairs_ticket ON repairs(ticket_id);
CREATE INDEX IF NOT EXISTS idx_transactions_invoice ON transactions(invoice_no);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
