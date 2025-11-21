-- Create ColorConfig table for managing color configurations
-- This table stores color values in OKLCH format with keys and descriptions
-- rgbValue stores RGB/Hex format for display purposes to avoid OKLCH rendering issues

CREATE TABLE IF NOT EXISTS "ColorConfig" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL,
    "rgbValue" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_color_config_key ON "ColorConfig"("key");

-- Enable Row Level Security
ALTER TABLE "ColorConfig" ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all reads (public)
CREATE POLICY "Allow public read on ColorConfig" ON "ColorConfig"
    FOR SELECT USING (true);

-- Policy: Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage ColorConfig" ON "ColorConfig"
    FOR ALL USING (auth.role() = 'authenticated');

-- Trigger for updatedAt
DROP TRIGGER IF EXISTS update_color_config_updated_at ON "ColorConfig";
CREATE TRIGGER update_color_config_updated_at BEFORE UPDATE ON "ColorConfig"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default color configurations (in OKLCH format with RGB values)
-- rgbValue stores RGB/Hex format for display purposes to avoid OKLCH rendering issues
INSERT INTO "ColorConfig" ("key", "value", "rgbValue", "description") VALUES
    ('primary', 'oklch(0.21 0.034 264.665)', '#447e94', 'Màu chính của website'),
    ('button', 'oklch(0.21 0.034 264.665)', '#447e94', 'Màu nền của các nút bấm'),
    ('buttonText', 'oklch(0.985 0.002 247.839)', '#a6fdff', 'Màu chữ trên các nút bấm'),
    ('headerBg', 'oklch(1 0 0)', '#ffffff', 'Màu nền của phần header'),
    ('headerText', 'oklch(0.13 0.028 261.692)', '#30657b', 'Màu chữ trong phần header'),
    ('homeGradientFrom', 'oklch(1 0 0)', '#ffffff', 'Màu bắt đầu của gradient background trang chủ'),
    ('homeGradientTo', 'oklch(0.967 0.003 264.542)', '#a4fbff', 'Màu kết thúc của gradient background trang chủ'),
    ('homeText', 'oklch(0.13 0.028 261.692)', '#30657b', 'Màu chữ chính trên trang chủ'),
    ('chatInputBg', 'oklch(1 0 0)', '#ffffff', 'Màu nền của ô nhập tin nhắn'),
    ('chatInputBorder', 'oklch(0.928 0.006 264.531)', '#a1f7ff', 'Màu viền của ô nhập tin nhắn'),
    ('chatInputText', 'oklch(0.13 0.028 261.692)', '#30657b', 'Màu chữ trong ô nhập tin nhắn'),
    ('chatInputPlaceholder', 'oklch(0.551 0.027 264.364)', '#7ac4d3', 'Màu chữ placeholder trong ô nhập tin nhắn'),
    ('chatUserMessageBg', 'oklch(0.967 0.003 264.542)', '#a4fbff', 'Màu nền của tin nhắn do người dùng gửi'),
    ('chatUserMessageText', 'oklch(0.13 0.028 261.692)', '#30657b', 'Màu chữ của tin nhắn do người dùng gửi')
ON CONFLICT ("key") DO NOTHING;

