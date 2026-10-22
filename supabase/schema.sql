-- ==============================================================
-- AI BY FARAZ — SUPABASE DATABASE SCHEMA
-- Project Ref: mhcyholumqneneauotbe
-- Paste this script into your Supabase Dashboard:
-- https://supabase.com/dashboard/project/mhcyholumqneneauotbe/sql/new
-- ==============================================================

-- 1. Create Quotes Table
CREATE TABLE IF NOT EXISTS public.quotes (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    services JSONB DEFAULT '[]'::jsonb,
    timeline TEXT DEFAULT 'standard',
    budget_range TEXT DEFAULT 'medium',
    addons JSONB DEFAULT '[]'::jsonb,
    project_details TEXT,
    estimated_price_cad NUMERIC(10, 2) NOT NULL,
    estimated_turnaround TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'archived'))
);

-- Index for searching and filtering quotes
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON public.quotes (email);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes (status);

-- 2. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT DEFAULT 'General Consultation',
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived'))
);

-- Index for messages
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_email ON public.messages (email);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages (status);

-- ==============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow insert by anon/public and authenticated backend
CREATE POLICY "Allow public insert to quotes" 
ON public.quotes FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow service role full access to quotes" 
ON public.quotes FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public insert to messages" 
ON public.messages FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow service role full access to messages" 
ON public.messages FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
