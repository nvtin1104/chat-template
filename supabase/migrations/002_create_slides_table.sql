-- Create Slides table
-- Run this in Supabase SQL Editor after creating initial tables

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

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_slides_order ON "Slides"("order");
CREATE INDEX IF NOT EXISTS idx_slides_active ON "Slides"(active);

-- Trigger for updated_at (reuse function if exists)
CREATE TRIGGER update_slides_updated_at BEFORE UPDATE ON "Slides"
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "Slides" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access" ON "Slides";
DROP POLICY IF EXISTS "Allow authenticated users full access" ON "Slides";

-- Policy: Allow anyone to read slides
CREATE POLICY "Allow public read access" ON "Slides"
    FOR SELECT
    USING (true);

-- Policy: Allow authenticated users (admins) to do everything
CREATE POLICY "Allow authenticated users full access" ON "Slides"
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
