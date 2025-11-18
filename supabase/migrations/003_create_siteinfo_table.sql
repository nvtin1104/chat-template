-- Create SiteInfo table
-- Run this in Supabase SQL Editor after creating User table

-- SiteInfo table
CREATE TABLE IF NOT EXISTS "SiteInfo" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "siteUrl" TEXT NOT NULL DEFAULT 'http://localhost:3000',
    "title" TEXT NOT NULL DEFAULT 'AI Platform',
    "name" TEXT,
    "logo" TEXT,
    "description" TEXT,
    "keywords" TEXT,
    "bannerTitle" TEXT,
    "bannerDescription" TEXT,
    "author" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "youtube" TEXT,
    "tiktok" TEXT,
    "address" TEXT,
    "contact" TEXT,
    "ogImage" TEXT,
    "ogType" TEXT,
    "twitterCard" TEXT,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedBy" TEXT REFERENCES "User"("id")
);

-- Trigger for updatedAt
DROP TRIGGER IF EXISTS update_siteinfo_updated_at ON "SiteInfo";
CREATE TRIGGER update_siteinfo_updated_at BEFORE UPDATE ON "SiteInfo"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "SiteInfo" ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy (allow all for now, can be restricted later)
CREATE POLICY "Allow all on SiteInfo" ON "SiteInfo" FOR ALL USING (true);
