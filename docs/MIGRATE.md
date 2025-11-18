# Hướng dẫn Migrate Database

## Cách 1: Chạy Migration SQL trong Supabase Dashboard (Khuyến nghị)

### Bước 1: Mở Supabase Dashboard
1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **SQL Editor** (menu bên trái)

### Bước 2: Copy và chạy SQL
1. Mở file `supabase/migrations/001_initial_schema.sql`
2. Copy toàn bộ nội dung
3. Paste vào SQL Editor trong Supabase Dashboard
4. Click **Run** hoặc nhấn `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### Bước 3: Verify
1. Vào **Table Editor** trong Supabase Dashboard
2. Kiểm tra các tables đã được tạo:
   - ✅ `User`
   - ✅ `Post`
   - ✅ `SiteInfo`

## Cách 2: Sử dụng Supabase CLI (Nếu đã cài)

```bash
# Cài đặt Supabase CLI (nếu chưa có)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Push migration
supabase db push
```

## Cách 3: Sử dụng Script (Hiển thị SQL)

Script sẽ hiển thị SQL để bạn copy và chạy trong Supabase Dashboard.

### Windows PowerShell:
```powershell
# Set environment variables (tạm thời cho session hiện tại)
$env:NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Hoặc tạo file .env.local trong thư mục client/
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Chạy script
npm run migrate
```

### Linux/Mac:
```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Hoặc tạo file .env.local
# Chạy script
npm run migrate
```

**Lưu ý:** Script sẽ hiển thị SQL để bạn copy và chạy trong Supabase Dashboard (vì Supabase JS client không hỗ trợ raw SQL execution). Cách tốt nhất vẫn là **Cách 1**.

## Sau khi Migration

1. **Seed Database (Tạo dữ liệu mẫu):**
   ```bash
   npm run seed
   ```
   
   Hoặc chỉ tạo admin user:
   ```bash
   npm run init-admin
   ```

2. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

### Seed Data bao gồm:
- ✅ 2 users: admin@example.com (admin) và user@example.com (user)
- ✅ 5 sample posts (4 published, 1 draft)
- ✅ Site info configuration
- ✅ Users trong Supabase Auth (nếu có SERVICE_ROLE_KEY)

**Login credentials sau khi seed:**
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

3. **Verify trong Supabase Dashboard:**
   - Table Editor: Kiểm tra tables và data
   - SQL Editor: Có thể query để test
   - Logs: Kiểm tra nếu có lỗi

## Troubleshooting

### Lỗi: "relation already exists"
- Tables đã tồn tại, có thể bỏ qua hoặc drop tables cũ trước:
  ```sql
  DROP TABLE IF EXISTS "SiteInfo" CASCADE;
  DROP TABLE IF EXISTS "Post" CASCADE;
  DROP TABLE IF EXISTS "User" CASCADE;
  ```

### Lỗi: "permission denied"
- Đảm bảo đang dùng Service Role Key (không phải Anon Key)
- Kiểm tra RLS policies

### Lỗi: "function does not exist"
- Kiểm tra extension `uuid-ossp` đã được enable chưa
- Chạy: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

## Schema Overview

### Tables được tạo:

1. **User** - Quản lý người dùng
   - id, email, name, password, role, image
   - createdAt, updatedAt

2. **Post** - Bài viết
   - id, title, slug, content, excerpt, coverImage
   - published, authorId, publishedAt
   - createdAt, updatedAt

3. **SiteInfo** - Cài đặt trang web
   - id, key, value, description
   - updatedAt, updatedBy

### Indexes:
- `Post_slug_idx` - Index cho slug
- `Post_published_idx` - Index cho published status
- `User_email_idx` - Index cho email

### Triggers:
- Auto-update `updatedAt` khi record được update

### RLS Policies:
- Tạm thời cho phép tất cả (có thể restrict sau)

