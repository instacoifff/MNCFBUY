-- Run this script in your Supabase SQL Editor to add Visitor Tracking

-- 1. Create site_visits Table
CREATE TABLE site_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  user_agent TEXT,
  path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Ensure a visitor is only logged once per day (optional uniqueness constraint)
-- For this, we'll just insert visits and aggregate them later.

-- 2. Set up RLS
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a visit (anonymous or authenticated)
CREATE POLICY "Anyone can insert a visit" ON site_visits FOR INSERT WITH CHECK (true);

-- Only authenticated users (admins) can view visits
CREATE POLICY "Authenticated users can view visits" ON site_visits FOR SELECT TO authenticated USING (true);
