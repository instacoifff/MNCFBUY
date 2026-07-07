-- World-Class E-Commerce Database Schema for a Diversified Store
-- Run this script in your Supabase SQL Editor

-- 1. Create Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb, -- Array of additional image URLs
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for guest checkouts
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
  shipping_address JSONB NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Set up Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
-- Categories: Anyone can read, only authenticated admins can write (for now, allow all authenticated users)
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Categories are insertable by authenticated users" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Categories are updatable by authenticated users" ON categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Categories are deletable by authenticated users" ON categories FOR DELETE TO authenticated USING (true);

-- Products: Anyone can read, only authenticated users can write
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by authenticated users" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Products are updatable by authenticated users" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Products are deletable by authenticated users" ON products FOR DELETE TO authenticated USING (true);

-- Orders: Users can read their own orders. Anyone can insert (guest checkout). Admins can update.
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can create an order" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update orders" ON orders FOR UPDATE TO authenticated USING (true);

-- Order Items: Viewable if you own the order. Anyone can insert during checkout.
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);

-- 7. Insert Initial Seed Data (Diversified Categories)
INSERT INTO categories (name, slug, description) VALUES
  ('Electronics & Gadgets', 'electronics', 'Latest tech and smart devices'),
  ('Fashion & Apparel', 'fashion', 'Trendy clothing and accessories for all'),
  ('Home & Garden', 'home-garden', 'Furniture, decor, and outdoor essentials'),
  ('Health & Beauty', 'health-beauty', 'Skincare, cosmetics, and wellness products'),
  ('Sports & Outdoors', 'sports-outdoors', 'Gear and equipment for active lifestyles');
