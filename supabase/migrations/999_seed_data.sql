-- Seed Data for Development
-- Run this after creating all tables

-- ============================================
-- Insert Admin User
-- ============================================
-- Password: admin123 (hashed with bcrypt)
-- Note: Save the generated IDs for use in other inserts
DO $$
DECLARE
    admin_id TEXT;
    user_id TEXT;
BEGIN
    -- Insert admin user and get ID
    INSERT INTO "User" ("email", "name", "password", "role", "createdAt", "updatedAt")
    VALUES ('admin@example.com', 'Admin User', '$2a$10$rQZ5YJH3vZ9yJxYQXN5N3uO5yJH3vZ9yJxYQXN5N3uO5yJH3vZ9yJ', 'admin', NOW(), NOW())
    ON CONFLICT ("email") DO UPDATE SET "email" = EXCLUDED."email"
    RETURNING "id" INTO admin_id;
    
    -- Insert regular user
    INSERT INTO "User" ("email", "name", "password", "role", "createdAt", "updatedAt")
    VALUES ('user@example.com', 'Test User', '$2a$10$rQZ5YJH3vZ9yJxYQXN5N3uO5yJH3vZ9yJxYQXN5N3uO5yJH3vZ9yJ', 'user', NOW(), NOW())
    ON CONFLICT ("email") DO NOTHING
    RETURNING "id" INTO user_id;
    
    -- Store admin_id for later use
    CREATE TEMP TABLE IF NOT EXISTS temp_ids (admin_id TEXT, user_id TEXT);
    DELETE FROM temp_ids;
    INSERT INTO temp_ids VALUES (admin_id, user_id);
END $$;

-- ============================================
-- Insert Sample Posts
-- ============================================
DO $$
DECLARE
    admin_id TEXT;
BEGIN
    -- Get admin_id from temp table
    SELECT t.admin_id INTO admin_id FROM temp_ids t LIMIT 1;
    
    INSERT INTO "Post" ("title", "slug", "content", "excerpt", "coverImage", "published", "authorId", "createdAt", "updatedAt", "publishedAt")
    VALUES 
        (
            'Chào mừng đến với Blog',
            'chao-mung-den-voi-blog',
            '<h1>Chào mừng bạn đến với blog của chúng tôi!</h1><p>Đây là bài viết đầu tiên trên blog. Chúng tôi sẽ chia sẻ nhiều nội dung hữu ích về công nghệ, lập trình và AI.</p><h2>Nội dung chính</h2><ul><li>Lập trình web hiện đại</li><li>Machine Learning và AI</li><li>Best practices và tips</li></ul>',
            'Bài viết giới thiệu về blog và các nội dung sẽ được chia sẻ',
            'https://udgtptskavwqxmrjvktz.supabase.co/storage/v1/object/public/images/posts/welcome-blog.jpg',
            true,
            admin_id,
            NOW(),
            NOW(),
            NOW()
        ),
        (
            'Hướng dẫn Next.js 15',
            'huong-dan-nextjs-15',
            '<h1>Next.js 15 - Những tính năng mới</h1><p>Next.js 15 đã ra mắt với nhiều tính năng mới hấp dẫn. Bài viết này sẽ giới thiệu chi tiết về các tính năng nổi bật.</p><h2>Tính năng chính</h2><ul><li>React Server Components</li><li>App Router cải tiến</li><li>Turbopack nhanh hơn</li><li>Streaming và Suspense</li></ul><h2>Cách sử dụng</h2><p>Để bắt đầu với Next.js 15, bạn có thể chạy lệnh: <code>npx create-next-app@latest</code></p>',
            'Tìm hiểu về các tính năng mới trong Next.js 15 và cách áp dụng vào dự án',
            'https://udgtptskavwqxmrjvktz.supabase.co/storage/v1/object/public/images/posts/nextjs-15.jpg',
            true,
            admin_id,
            NOW() - INTERVAL '1 day',
            NOW() - INTERVAL '1 day',
            NOW() - INTERVAL '1 day'
        ),
        (
            'TypeScript Best Practices',
            'typescript-best-practices',
            '<h1>TypeScript Best Practices cho Developers</h1><p>TypeScript đã trở thành lựa chọn hàng đầu cho các dự án JavaScript quy mô lớn. Dưới đây là một số best practices quan trọng.</p><h2>1. Sử dụng Strict Mode</h2><p>Luôn bật strict mode trong tsconfig.json để catch bugs sớm hơn.</p><h2>2. Định nghĩa Types rõ ràng</h2><p>Tránh dùng any, thay vào đó hãy định nghĩa types cụ thể.</p><h2>3. Utility Types</h2><p>Tận dụng các utility types như Partial, Pick, Omit để code gọn gàng hơn.</p>',
            'Các best practices khi làm việc với TypeScript để code hiệu quả hơn',
            'https://udgtptskavwqxmrjvktz.supabase.co/storage/v1/object/public/images/posts/typescript-best-practices.jpg',
            true,
            admin_id,
            NOW() - INTERVAL '2 days',
            NOW() - INTERVAL '2 days',
            NOW() - INTERVAL '2 days'
        ),
        (
            'React Server Components Deep Dive',
            'react-server-components-deep-dive',
            '<h1>Tìm hiểu sâu về React Server Components</h1><p>React Server Components là một tính năng mới mang tính cách mạng trong React ecosystem.</p><h2>Server Components là gì?</h2><p>Server Components cho phép render components trên server, giảm JavaScript bundle size và cải thiện performance.</p><h2>Lợi ích</h2><ul><li>Giảm bundle size</li><li>Cải thiện performance</li><li>SEO tốt hơn</li><li>Truy cập backend resources trực tiếp</li></ul>',
            'Deep dive vào React Server Components và cách sử dụng hiệu quả',
            'https://udgtptskavwqxmrjvktz.supabase.co/storage/v1/object/public/images/posts/react-server-components.jpg',
            false,
            admin_id,
            NOW() - INTERVAL '3 days',
            NOW() - INTERVAL '3 days',
            NULL
        ),
        (
            'Supabase - Firebase Alternative',
            'supabase-firebase-alternative',
            '<h1>Supabase: The Open Source Firebase Alternative</h1><p>Supabase là một open-source alternative cho Firebase với đầy đủ tính năng và dễ dàng sử dụng.</p><h2>Tính năng nổi bật</h2><ul><li>PostgreSQL Database</li><li>Authentication</li><li>Storage</li><li>Realtime subscriptions</li><li>Edge Functions</li></ul><h2>So sánh với Firebase</h2><p>Supabase sử dụng PostgreSQL thay vì NoSQL, mang lại nhiều lợi thế về query và data modeling.</p>',
            'Giới thiệu Supabase và so sánh với Firebase',
            'https://udgtptskavwqxmrjvktz.supabase.co/storage/v1/object/public/images/posts/supabase-alternative.jpg',
            true,
            admin_id,
            NOW() - INTERVAL '4 days',
            NOW() - INTERVAL '4 days',
            NOW() - INTERVAL '4 days'
        )
    ON CONFLICT ("slug") DO NOTHING;
END $$;

-- ============================================
-- Insert Site Information
-- ============================================
DO $$
DECLARE
    admin_id TEXT;
BEGIN
    -- Get admin_id from temp table
    SELECT t.admin_id INTO admin_id FROM temp_ids t LIMIT 1;
    
    INSERT INTO "SiteInfo" (
        "siteUrl",
        "title",
        "name",
        "description",
        "keywords",
        "bannerTitle",
        "bannerDescription",
        "author",
        "email",
        "phone",
        "facebook",
        "instagram",
        "twitter",
        "linkedin",
        "youtube",
        "address",
        "ogType",
        "twitterCard",
        "updatedAt",
        "updatedBy"
    )
    VALUES (
        'http://localhost:3000',
        'AI Platform - Blog & Chat',
        'AI Platform',
        'Nền tảng chia sẻ kiến thức về AI, lập trình web và công nghệ hiện đại',
        'AI, Blog, Chat, Next.js, TypeScript, React, Supabase, Machine Learning',
        'Chào mừng đến với AI Platform',
        'Khám phá kiến thức về AI, lập trình web và công nghệ. Trao đổi, học hỏi cùng cộng đồng.',
        'Admin Team',
        'contact@aiplatform.com',
        '+84 123 456 789',
        'https://facebook.com/aiplatform',
        'https://instagram.com/aiplatform',
        'https://twitter.com/aiplatform',
        'https://linkedin.com/company/aiplatform',
        'https://youtube.com/@aiplatform',
        'Hà Nội, Việt Nam',
        'website',
        'summary_large_image',
        NOW(),
        admin_id
    );
END $$;

-- ============================================
-- Insert Sample Slides
-- ============================================
INSERT INTO "Slides" (id, title, image, link, "order", active, created_at, updated_at)
VALUES 
    (
        gen_random_uuid(),
        'Khám phá AI và Machine Learning',
        'https://udgtptskavwqxmrjvktz.supabase.co/storage/v1/object/public/images/slides/ai-machine-learning.jpg',
        '/bai-viet',
        1,
        true,
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid(),
        'Next.js 15 - Tương lai của Web Development',
        'https://udgtptskavwqxmrjvktz.supabase.co/storage/v1/object/public/images/slides/nextjs-future.jpg',
        '/bai-viet/huong-dan-nextjs-15',
        2,
        true,
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid(),
        'TypeScript Best Practices',
        'https://udgtptskavwqxmrjvktz.supabase.co/storage/v1/object/public/images/slides/typescript-practices.jpg',
        '/bai-viet/typescript-best-practices',
        3,
        true,
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid(),
        'Chat với AI - Trải nghiệm công nghệ mới',
        'https://udgtptskavwqxmrjvktz.supabase.co/storage/v1/object/public/images/slides/chat-ai.jpg',
        '/tro-chuyen',
        4,
        true,
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Verification
-- ============================================
SELECT 'Seed data inserted successfully!' as message;
SELECT COUNT(*) as user_count FROM "User";
SELECT COUNT(*) as post_count FROM "Post";
SELECT COUNT(*) as site_info_count FROM "SiteInfo";
SELECT COUNT(*) as slides_count FROM "Slides";
