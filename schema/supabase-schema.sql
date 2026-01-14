-- Supabase (PostgreSQL) Schema for B2B Product Exhibition Website
-- Run this in Supabase SQL Editor

-- Enable UUID extension for better IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    detailed_description TEXT,
    specifications TEXT,
    image_url TEXT,
    gallery_images JSONB,
    category VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    country VARCHAR(100),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website settings table (replaces KV storage)
CREATE TABLE IF NOT EXISTS website_settings (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin users (passwords are already hashed)
-- Super admin: admin123 -> SHA-256 hash
INSERT INTO admins (username, password_hash, role) VALUES
    ('admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'super_admin')
ON CONFLICT (username) DO NOTHING;

INSERT INTO admins (username, password_hash, role) VALUES
    ('staff', '5427e4a2fa24099cce5b8ad21d68e2f25d9ddb0d1e0c4c7a0f6b0e8c4d7a9f2', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert default settings
INSERT INTO website_settings (key, value) VALUES
    ('website_settings', '{"site_name": "B2B Product Exhibition", "site_description": "Your trusted partner for high-quality industrial products", "company_intro": "We are a leading manufacturer..."}')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_product_id ON inquiries(product_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS set_products_timestamp ON products;
CREATE TRIGGER set_products_timestamp
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_inquiries_timestamp ON inquiries;
CREATE TRIGGER set_inquiries_timestamp
    BEFORE UPDATE ON inquiries
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_website_settings_timestamp ON website_settings;
CREATE TRIGGER set_website_settings_timestamp
    BEFORE UPDATE ON website_settings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Products: Public can read active products, admins can do all
CREATE POLICY "Public can read active products" ON products
    FOR SELECT USING (is_active = true);

-- Inquiries: Admins can CRUD, public can create
CREATE POLICY "Public can create inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage inquiries" ON inquiries
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admins WHERE role = 'super_admin' OR role = 'admin')
    );

-- Admins: Only super_admin can manage
CREATE POLICY "Super admin can manage admins" ON admins
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admins WHERE role = 'super_admin')
    );

-- Settings: Only admins can read/write
CREATE POLICY "Admins can manage settings" ON website_settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admins WHERE role = 'super_admin' OR role = 'admin')
    );
