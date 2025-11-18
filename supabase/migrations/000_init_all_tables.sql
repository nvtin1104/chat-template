-- Complete Database Migration
-- This file contains all table definitions with fixed triggers
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- User Table
-- ============================================
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "password" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "emailVerified" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");

-- ============================================
-- Post Table
-- ============================================
CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "publishedAt" TIMESTAMP,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Post_slug_idx" ON "Post"("slug");
CREATE INDEX IF NOT EXISTS "Post_published_idx" ON "Post"("published");

-- ============================================
-- SiteInfo Table
-- ============================================
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

-- ============================================
-- Slides Table
-- ============================================
CREATE TABLE IF NOT EXISTS "Slides" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,
    link TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_slides_order ON "Slides"("order");
CREATE INDEX IF NOT EXISTS idx_slides_active ON "Slides"(active);

-- ============================================
-- Trigger Function (Fixed for both camelCase and snake_case)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle camelCase for Post, User, SiteInfo
    IF TG_TABLE_NAME = 'Post' OR TG_TABLE_NAME = 'User' OR TG_TABLE_NAME = 'SiteInfo' THEN
        NEW."updatedAt" = NOW();
    -- Handle snake_case for Slides
    ELSIF TG_TABLE_NAME = 'Slides' THEN
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- Triggers for all tables
-- ============================================
DROP TRIGGER IF EXISTS update_user_updated_at ON "User";
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_post_updated_at ON "Post";
CREATE TRIGGER update_post_updated_at BEFORE UPDATE ON "Post"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_siteinfo_updated_at ON "SiteInfo";
CREATE TRIGGER update_siteinfo_updated_at BEFORE UPDATE ON "SiteInfo"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_slides_updated_at ON "Slides";
CREATE TRIGGER update_slides_updated_at BEFORE UPDATE ON "Slides"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security
-- ============================================

-- User Table RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on User" ON "User" FOR ALL USING (true);

-- Post Table RLS
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on Post" ON "Post" FOR ALL USING (true);

-- SiteInfo Table RLS
ALTER TABLE "SiteInfo" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on SiteInfo" ON "SiteInfo" FOR ALL USING (true);

-- Slides Table RLS
ALTER TABLE "Slides" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON "Slides";
DROP POLICY IF EXISTS "Allow authenticated users full access" ON "Slides";

CREATE POLICY "Allow public read access" ON "Slides"
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users full access" ON "Slides"
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
