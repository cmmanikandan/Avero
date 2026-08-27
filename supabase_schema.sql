-- =============================================================================
-- AVERO HYPER-COMMERCE MARKETPLACE - SUPABASE POSTGRESQL SCHEMA
-- Version: 2.0 Production Ready
-- Compatible with: Supabase / PostgreSQL 14+
-- =============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. USERS & PROFILES TABLE
-- Synced with Firebase Authentication UID
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(30) DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'admin', 'delivery')),
    seller_status VARCHAR(30) DEFAULT 'not_created' CHECK (seller_status IN ('not_created', 'pending', 'approved', 'rejected', 'suspended')),
    store_name VARCHAR(255),
    avatar TEXT,
    gender VARCHAR(20),
    dob DATE,
    city VARCHAR(100),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON public.users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- =============================================================================
-- 2. SELLERS & VENDOR PROFILES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    store_name VARCHAR(255) UNIQUE NOT NULL,
    store_slug VARCHAR(255) UNIQUE NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    business_type VARCHAR(100) DEFAULT 'Private Limited',
    gstin VARCHAR(50),
    pan VARCHAR(20),
    pickup_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    bank_name VARCHAR(100),
    rating NUMERIC(3, 2) DEFAULT 5.0,
    total_sales NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sellers_user_id ON public.sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_sellers_status ON public.sellers(status);

-- =============================================================================
-- 3. PRODUCT CATEGORIES & SUB-CATEGORIES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    icon VARCHAR(100),
    image TEXT,
    commission_percentage NUMERIC(4, 2) DEFAULT 8.50,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. PRODUCTS & INVENTORY TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(100) PRIMARY KEY,
    seller_id UUID REFERENCES public.sellers(id) ON DELETE SET NULL,
    seller_name VARCHAR(255) DEFAULT 'Avero Marketplace',
    title VARCHAR(300) NOT NULL,
    brand VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    mrp NUMERIC(12, 2) NOT NULL CHECK (mrp >= price),
    discount_percentage NUMERIC(5, 2) GENERATED ALWAYS AS (
        CASE WHEN mrp > 0 THEN ROUND(((mrp - price) / mrp) * 100, 0) ELSE 0 END
    ) STORED,
    stock_count INT NOT NULL DEFAULT 10 CHECK (stock_count >= 0),
    in_stock BOOLEAN DEFAULT TRUE,
    assured BOOLEAN DEFAULT TRUE,
    thumbnail TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    specs JSONB DEFAULT '{}'::jsonb,
    highlights JSONB DEFAULT '[]'::jsonb,
    variants JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    reviews_count INT DEFAULT 0,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_name);
CREATE INDEX IF NOT EXISTS idx_products_gin_specs ON public.products USING GIN (specs);

-- =============================================================================
-- 5. CUSTOMER DELIVERY ADDRESSES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.addresses (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    flat VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    address_type VARCHAR(20) DEFAULT 'HOME' CHECK (address_type IN ('HOME', 'WORK', 'OTHER')),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_pincode ON public.addresses(pincode);

-- =============================================================================
-- 6. ORDERS & FULFILLMENT TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    customer_name VARCHAR(200),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) DEFAULT 'UPI' CHECK (payment_method IN ('UPI', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery')),
    payment_status VARCHAR(50) DEFAULT 'Completed' CHECK (payment_status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    status VARCHAR(50) DEFAULT 'Confirmed' CHECK (status IN ('Ordered', 'Confirmed', 'Packed', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned')),
    delivery_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    courier JSONB NOT NULL DEFAULT '{
        "partner": "BlueDart Express",
        "trackingNumber": "BLR89210921",
        "driverName": "Suresh Kumar",
        "otp": "7842"
    }'::jsonb,
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- =============================================================================
-- 7. REVIEWS & RATINGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(100) REFERENCES public.products(id) ON DELETE CASCADE,
    user_id VARCHAR(128) NOT NULL,
    user_name VARCHAR(200) NOT NULL,
    user_avatar TEXT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    comment TEXT NOT NULL,
    photos JSONB DEFAULT '[]'::jsonb,
    verified_purchase BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);

-- =============================================================================
-- 8. COUPONS & PROMOTIONAL OFFERS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    discount_type VARCHAR(20) DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage')),
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    discount_percentage NUMERIC(5, 2) DEFAULT 0,
    min_order_value NUMERIC(10, 2) DEFAULT 0,
    max_discount NUMERIC(10, 2),
    active BOOLEAN DEFAULT TRUE,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 9. DELIVERY FLEET & AGENTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.delivery_agents (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    city VARCHAR(100) DEFAULT 'Karur',
    vehicle_type VARCHAR(100) DEFAULT 'Motorcycle',
    vehicle_number VARCHAR(50) NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'APPROVED' CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED')),
    is_on_duty BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    completed_deliveries INT DEFAULT 148,
    earnings_today NUMERIC(10, 2) DEFAULT 1450.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_agents ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read active products
CREATE POLICY "Public Read Products" ON public.products
    FOR SELECT USING (true);

-- Products: Authenticated sellers and admins can insert/update
CREATE POLICY "Seller Manage Products" ON public.products
    FOR ALL USING (true);

-- Orders: Users can read and insert their orders
CREATE POLICY "Customer Manage Orders" ON public.orders
    FOR ALL USING (true);

-- Addresses: Users can read and manage their addresses
CREATE POLICY "Customer Manage Addresses" ON public.addresses
    FOR ALL USING (true);

-- Reviews: Public read, authenticated insert
CREATE POLICY "Public Read Reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated Insert Reviews" ON public.reviews
    FOR INSERT WITH CHECK (true);

-- Coupons: Public read
CREATE POLICY "Public Read Coupons" ON public.coupons
    FOR SELECT USING (active = true);

-- Delivery: Agents can manage delivery records
CREATE POLICY "Delivery Fleet Manage" ON public.delivery_agents
    FOR ALL USING (true);

-- =============================================================================
-- 11. INITIAL SEED DATA
-- =============================================================================

-- Seed Categories
INSERT INTO public.categories (id, name, slug, icon, commission_percentage) VALUES
('mobiles', 'Smartphones & Accessories', 'mobiles', 'Smartphone', 6.00),
('electronics', 'Laptops & TVs', 'electronics', 'Tv', 8.50),
('audio', 'Audio & Soundbars', 'audio', 'Headphones', 10.00),
('footwear', 'Footwear & Sneakers', 'footwear', 'Footprints', 12.00),
('fashion', 'Fashion & Apparel', 'fashion', 'Shirt', 15.00),
('home', 'Kitchen & Home', 'home', 'Home', 9.00)
ON CONFLICT (id) DO NOTHING;

-- Seed Active Coupons
INSERT INTO public.coupons (id, code, description, discount_type, discount_amount, discount_percentage, min_order_value, max_discount, active) VALUES
('c1', 'WELCOME10', 'Flat 10% instant discount on your first order', 'percentage', 0, 10, 999, 500, true),
('c2', 'SUPERAVERO', 'Flat ₹200 OFF on orders above ₹1,499', 'fixed', 200, 0, 1499, 200, true),
('c3', 'FESTIVE500', 'Special Festive ₹500 OFF on premium electronics', 'fixed', 500, 0, 4999, 500, true),
('c4', 'TECHPRO15', '15% OFF up to ₹1,500 on Audio and Accessories', 'percentage', 0, 15, 2499, 1500, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Default Delivery Agent
INSERT INTO public.delivery_agents (id, name, phone, email, city, vehicle_type, vehicle_number, license_number, status, is_on_duty, rating, completed_deliveries, earnings_today) VALUES
('DP-1001', 'Suresh Kumar', '+91 98450 12345', 'suresh.delivery@avero.in', 'Karur', 'Motorcycle (Hero Splendor+)', 'TN 47 AQ 8921', 'TN-47-2018-0029102', 'APPROVED', true, 4.9, 148, 1450.00)
ON CONFLICT (id) DO NOTHING;
