-- Create Contact table for managing contact form submissions
-- This table stores contact form submissions from users

CREATE TABLE IF NOT EXISTS "Contact" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_email ON "Contact"("email");
CREATE INDEX IF NOT EXISTS idx_contact_read ON "Contact"("read");
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON "Contact"("createdAt");

-- Enable Row Level Security
ALTER TABLE "Contact" ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert (submit contact form)
CREATE POLICY "Allow public insert on Contact" ON "Contact"
    FOR INSERT WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to read
CREATE POLICY "Allow authenticated users to read Contact" ON "Contact"
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users (admins) to update
CREATE POLICY "Allow authenticated users to update Contact" ON "Contact"
    FOR UPDATE USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow authenticated users (admins) to delete
CREATE POLICY "Allow authenticated users to delete Contact" ON "Contact"
    FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger for updatedAt
DROP TRIGGER IF EXISTS update_contact_updated_at ON "Contact";
CREATE TRIGGER update_contact_updated_at BEFORE UPDATE ON "Contact"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

