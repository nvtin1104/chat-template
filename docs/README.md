# AI Platform - Next.js + Supabase

> Nền tảng web hiện đại với quản lý nội dung đầy đủ, tích hợp AI chatbot, và hệ thống quản trị mạnh mẽ.

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Tech Stack](#-tech-stack)
- [Cài đặt Local](#-cài-đặt-local)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Deploy lên Vercel](#-deploy-lên-vercel)
- [Quản lý Database](#-quản-lý-database)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

## ✨ Tính năng

### 🌐 Frontend Public
- **Trang chủ động**: Slideshow với Swiper.js, hiển thị bài viết mới nhất
- **Blog system**: Trang bài viết với slug SEO-friendly, hỗ trợ rich content
- **AI Chatbot**: Giao diện chat tương tác với AI, lưu lịch sử hội thoại
- **Responsive design**: Tối ưu cho mọi thiết bị từ mobile đến desktop

### 🔐 Admin Panel
- **Dashboard**: Tổng quan hệ thống với cards điều hướng nhanh
- **Quản lý bài viết**: CRUD đầy đủ với CKEditor, upload ảnh, quản lý trạng thái
- **Quản lý slides**: Drag & drop reorder, upload ảnh, toggle hiển thị
- **Thư viện ảnh**: Quản lý media trên Supabase Storage, tìm kiếm, xóa
- **Quản lý người dùng**: Phân quyền admin/user, tạo/xóa tài khoản
- **Cài đặt website**: Cấu hình logo, title, description, contact info

### 🔒 Authentication & Security
- **Supabase Auth**: Đăng nhập/đăng ký với email + password
- **Row Level Security (RLS)**: Bảo mật cấp database row
- **Protected Routes**: Middleware kiểm tra quyền truy cập
- **Session Management**: Tự động refresh token

### 📦 Storage & Media
- **Supabase Storage**: Lưu trữ ảnh với buckets tổ chức
- **Image optimization**: Next.js Image với lazy loading
- **Multi-upload**: Upload nhiều ảnh cùng lúc
- **Image library**: Browser + select ảnh từ thư viện

## 🛠 Tech Stack

### Core
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

### Libraries
- **UI Components**: Radix UI, shadcn/ui
- **Forms**: React Hook Form
- **Editor**: CKEditor 5
- **Slider**: Swiper.js
- **Icons**: Lucide React, Tabler Icons
- **Date**: date-fns
- **HTTP**: Native Fetch API

### Development
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier (optional)
- **Deployment**: Vercel

## 🚀 Cài đặt Local

### Prerequisites
- Node.js 18+ và npm
- Tài khoản Supabase (miễn phí)
- Git

### Bước 1: Clone Repository

```bash
git clone https://github.com/nvtin1104/chat-template.git
cd chat-template
```

### Bước 2: Cài đặt Dependencies

```bash
npm install
```

### Bước 3: Setup Supabase

1. **Tạo project mới** tại [supabase.com](https://supabase.com)

2. **Lấy credentials**:
   - Vào `Settings` → `API`
   - Copy `Project URL` và `anon public key`
   - Copy `service_role key` (giữ bí mật)

3. **Tạo Storage Bucket**:
   - Vào `Storage` → Create bucket `images`
   - Set public: `true`
   - Allowed MIME types: `image/*`

4. **Tạo file `.env`**:

Copy từ `.example.env` và điền các giá trị:

```bash
cp .example.env .env
```

Hoặc tạo file `.env` với nội dung:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin display name (dùng cho init-admin script)
ADMIN_NAME=Administrator
ADMIN_PASSWORD=root123
ADMIN_EMAIL=root@gmail.com

# Bizino AI Configuration (optional)
NEXT_PUBLIC_BIZINO_API=https://chat.bizino.ai/api
NEXT_PUBLIC_BIZINO_BOT_UUID=your-bot-uuid-here
```

**Giải thích các biến**:
- `NEXT_PUBLIC_SUPABASE_URL`: URL của Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anon key từ Supabase
- `ADMIN_EMAIL`: Email của tài khoản admin (bắt buộc cho init-admin script)
- `ADMIN_PASSWORD`: Mật khẩu của tài khoản admin (bắt buộc cho init-admin script)
- `ADMIN_NAME`: Tên hiển thị mặc định cho admin khi chạy script khởi tạo (tùy chọn, mặc định: "Admin")
- `NEXT_PUBLIC_BIZINO_API`: Endpoint Bizino AI (nếu dùng chatbot Bizino)
- `NEXT_PUBLIC_BIZINO_BOT_UUID`: Bot UUID từ Bizino (tuỳ chọn)

**Lưu ý bảo mật**:
- ⚠️ Không commit file `.env` vào Git (đã được ignore trong `.gitignore`)

### Bước 4: Setup Database

Xem hướng dẫn chi tiết trong [docs/MIGRATE.md](./MIGRATE.md)

1. **Vào Supabase SQL Editor**

2. **Chạy migrations theo thứ tự**:
   ```sql
   -- File: supabase/migrations/001_create_user_table.sql
   -- Copy và paste vào SQL Editor, Execute
   
   -- File: supabase/migrations/002_create_post_table.sql
   -- Execute
   
   -- File: supabase/migrations/003_create_siteinfo_table.sql
   -- Execute
   
   -- File: supabase/migrations/004_create_slides_table.sql
   -- Execute
   ```

3. **Hoặc sử dụng Supabase CLI** (nếu đã cài):
   ```bash
   supabase db push
   ```

### Bước 5: Tạo Admin User

```bash
npm run init-admin
```

Script này sẽ:
- Tạo user với email/password từ `.env`
- Set role = `superadmin`
- Insert vào bảng `User`

### Bước 6: Khởi chạy Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

**Login admin**:
- Email: Giá trị của `ADMIN_EMAIL` trong file `.env` (mặc định: `root@gmail.com`)
- Password: Giá trị của `ADMIN_PASSWORD` trong file `.env` (mặc định: `root123`)

## 📁 Cấu trúc dự án

```
client/
├── app/
│   ├── api/                    # API Routes (Next.js Route Handlers)
│   │   ├── admin/
│   │   │   ├── images/         # Media library API
│   │   │   ├── posts/          # Posts CRUD API
│   │   │   ├── slides/         # Slides CRUD API
│   │   │   ├── site-info/      # Site settings API
│   │   │   ├── upload/         # Upload handler
│   │   │   └── users/          # Users management API
│   │   ├── auth/
│   │   │   └── [...nextauth]/  # Auth callback
│   │   └── public/
│   │       ├── chat/           # Chat API
│   │       ├── posts/          # Public posts API
│   │       ├── slides/         # Public slides API
│   │       └── site-info/      # Public site info API
│   ├── admin/                  # Admin Pages (Protected)
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── media/              # Media library page
│   │   ├── posts/              # Posts management pages
│   │   ├── slides/             # Slides management page
│   │   ├── settings/           # Site settings page
│   │   └── users/              # Users management page
│   ├── bai-viet/               # Public blog pages
│   │   ├── page.tsx            # Posts list
│   │   └── [slug]/             # Post detail
│   ├── tro-chuyen/             # Chat page
│   ├── login/                  # Login page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   └── not-found.tsx           # 404 page
├── components/
│   ├── admin/                  # Admin components
│   │   ├── app-sidebar.tsx     # Sidebar navigation
│   │   ├── data-table.tsx      # Reusable data table
│   │   └── ...
│   ├── editor/                 # Editor components
│   │   ├── ckeditor.tsx        # CKEditor wrapper
│   │   └── image-upload.tsx    # Image uploader
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── Banner.tsx
│   ├── ChatBar.tsx
│   ├── PostCard.tsx
│   ├── SlideShow.tsx          # Swiper slideshow
│   └── Providers.tsx
├── lib/
│   ├── supabase.ts            # Supabase clients (browser, server, admin)
│   ├── auth-supabase.ts       # Auth helpers
│   ├── db.ts                  # Database functions (CRUD)
│   ├── image-utils.ts         # Image URL helpers
│   ├── storage-utils.ts       # Storage helpers
│   ├── posts.ts               # Post-related helpers
│   ├── site-info.ts           # Site info helpers
│   └── utils.ts               # General utilities
├── hooks/
│   ├── useSupabaseSession.ts  # Session hook
│   └── use-mobile.ts          # Mobile detection
├── types/
│   └── index.ts               # TypeScript types
├── supabase/
│   └── migrations/            # SQL migration files
│       ├── 001_create_user_table.sql
│       ├── 002_create_post_table.sql
│       ├── 003_create_siteinfo_table.sql
│       └── 004_create_slides_table.sql
├── scripts/
│   ├── init-admin.ts          # Create admin user
│   └── migrate-db.ts          # Show migration SQL
├── public/                    # Static files
├── docs/                      # Documentation
│   ├── README.md              # This file
│   └── MIGRATE.md             # Migration guide
├── next.config.ts             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
├── components.json            # shadcn/ui config
├── package.json
└── .env                       # Environment variables (git-ignored)
```

## 🚀 Automatic Admin Initialization

### Tổng quan

Dự án được cấu hình để **tự động tạo/cập nhật tài khoản admin** sau mỗi lần build trên Vercel thông qua npm `postbuild` hook.

### Cách hoạt động

1. **Khi Vercel build xong**, npm tự động chạy script `postbuild`:
   ```json
   {
     "scripts": {
       "build": "next build",
       "postbuild": "npm run init-admin"  // Tự động chạy sau build
     }
   }
   ```

2. **Script `init-admin.ts` sẽ**:
   - ✅ Đọc environment variables: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
   - ✅ Kiểm tra user đã tồn tại trong database chưa
   - ✅ **Nếu chưa tồn tại**: Tạo user mới với role `superadmin`
   - ✅ **Nếu đã tồn tại**: Cập nhật password và role thành `superadmin`
   - ✅ Hash password bằng bcrypt (10 rounds) trước khi lưu
   - ✅ Tạo user trong Supabase Auth (nếu có `SUPABASE_SERVICE_ROLE_KEY`)

3. **Kết quả**:
   - 🎉 Admin user được tạo/cập nhật tự động sau mỗi deploy
   - 🔐 Password được hash an toàn
   - 🚀 Có thể đăng nhập ngay sau khi deploy xong
   - 📝 Không cần thao tác thủ công

### Environment Variables cần thiết

Để tính năng hoạt động, bạn cần set các biến sau trong Vercel:

| Biến | Bắt buộc | Mô tả | Ví dụ |
|------|----------|-------|-------|
| `ADMIN_EMAIL` | ✅ Yes | Email của tài khoản admin | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | ✅ Yes | Mật khẩu admin (sẽ được hash) | `SecurePassword123!` |
| `ADMIN_NAME` | ❌ No | Tên hiển thị (mặc định: "Admin") | `Administrator` |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Recommended | Service role key để tạo user trong Supabase Auth | `eyJhbGci...` |

**Lưu ý**:
- Nếu không có `SUPABASE_SERVICE_ROLE_KEY`, user vẫn được tạo trong database nhưng sẽ được tạo trong Supabase Auth khi đăng nhập lần đầu
- Password phải đủ mạnh (khuyến nghị: ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt)

### Kiểm tra Admin đã được tạo

#### 1. Xem Build Logs trên Vercel

Vào deployment → `Build Logs`, tìm các dòng sau:

**Thành công**:
```
Superadmin user updated in database: {
  id: 'xxx-xxx-xxx',
  email: 'admin@yourdomain.com',
  name: 'Administrator',
  role: 'superadmin'
}
Password updated in Supabase Auth
```

**Hoặc nếu user mới**:
```
User created in Supabase Auth: admin@yourdomain.com
```

**Warning (không fail build)**:
```
Warning: Could not create user in Supabase Auth: ...
User will be created automatically on first login
```

#### 2. Kiểm tra trong Database

Chạy SQL trong Supabase SQL Editor:
```sql
SELECT id, email, name, role, created_at 
FROM "User" 
WHERE email = 'admin@yourdomain.com';
```

#### 3. Đăng nhập thử

1. Vào `/login` trên site đã deploy
2. Nhập:
   - **Email**: Giá trị của `ADMIN_EMAIL` trong Vercel
   - **Password**: Giá trị của `ADMIN_PASSWORD` trong Vercel
3. Nếu đăng nhập thành công → Admin đã được tạo đúng ✅

### Troubleshooting

#### Admin không được tạo sau deploy

**Nguyên nhân có thể**:
1. ❌ Thiếu environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)
2. ❌ Build failed trước khi chạy `postbuild`
3. ❌ Database chưa được migrate (thiếu bảng `User`)
4. ❌ `SUPABASE_SERVICE_ROLE_KEY` sai hoặc không có quyền

**Giải pháp**:
1. Kiểm tra Vercel Environment Variables đã set đầy đủ
2. Xem Build Logs để tìm lỗi cụ thể
3. Verify database đã được migrate đúng
4. Redeploy để trigger lại `postbuild` script

#### Không thể đăng nhập với admin

**Nguyên nhân có thể**:
1. ❌ Email/password không đúng với env vars
2. ❌ User chưa được tạo trong Supabase Auth
3. ❌ RLS policies chặn truy cập

**Giải pháp**:
1. Verify `ADMIN_EMAIL` và `ADMIN_PASSWORD` trong Vercel
2. Kiểm tra user đã tồn tại trong Supabase Auth Dashboard
3. Nếu chưa, đợi user được tạo tự động khi đăng nhập lần đầu
4. Hoặc tạo manual trong Supabase Auth Dashboard

### Chạy Manual (Local Development)

Để chạy script init-admin local:

```bash
# Set environment variables
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PASSWORD="SecurePassword123!"
export ADMIN_NAME="Administrator"
export SUPABASE_SERVICE_ROLE_KEY="your-service-key"

# Chạy script
npm run init-admin
```

Hoặc tạo file `.env` với các biến trên và chạy:
```bash
npm run init-admin
```

## 🌍 Deploy lên Vercel

### Bước 1: Chuẩn bị Repository

1. **Push code lên GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Đảm bảo các file cần thiết**:
   - ✅ `next.config.ts`
   - ✅ `package.json`
   - ✅ `.gitignore` (đã ignore `.env`)
   - ✅ `vercel.json` (nếu có custom config)

### Bước 2: Setup Vercel Project

1. **Đăng nhập Vercel**: [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click `Add New` → `Project`
   - Chọn GitHub repository
   - Select `web-ai` repository

3. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `client` (quan trọng!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Bước 3: Setup Environment Variables

Trong Vercel Dashboard, vào `Settings` → `Environment Variables`, thêm:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Required for init-admin

# Admin User Configuration (Required for auto-init)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
ADMIN_NAME=Administrator

# Bizino AI Configuration (optional)
NEXT_PUBLIC_BIZINO_API=https://chat.bizino.ai/api
NEXT_PUBLIC_BIZINO_BOT_UUID=your-production-bot-uuid
```

**Hướng dẫn setup từng biến**:

1. **Supabase Variables**:
   - Copy từ Supabase Dashboard → Settings → API
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project API keys → anon public
   - `SUPABASE_SERVICE_ROLE_KEY`: **Bắt buộc** - Service role key (có quyền bypass RLS) để script `init-admin` có thể tạo user trong Supabase Auth

2. **Admin User Variables** (Bắt buộc cho auto-init):
   - `ADMIN_EMAIL`: Email của tài khoản admin sẽ được tạo tự động
   - `ADMIN_PASSWORD`: Mật khẩu cho tài khoản admin (nên dùng mật khẩu mạnh)
   - `ADMIN_NAME`: Tên hiển thị mặc định cho tài khoản admin

3. **Bizino AI** (Optional):
   - Chỉ cần nếu sử dụng Bizino AI chatbot
   - Lấy `BOT_UUID` từ Bizino Dashboard

**Environments trong Vercel**:
- ✅ **Production**: Dùng cho deployment chính (main branch)
- ✅ **Preview**: Dùng cho pull requests và branch preview
- ✅ **Development**: Dùng cho `vercel dev` local

Set tất cả biến cho cả 3 environments, có thể dùng giá trị khác nhau.

**Lưu ý bảo mật**:
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` bypass RLS, chỉ dùng server-side - **KHÔNG BAO GIỜ** expose ra client
- ⚠️ `ADMIN_PASSWORD` phải là mật khẩu mạnh và bảo mật
- ⚠️ Các biến `NEXT_PUBLIC_*` sẽ được expose ra client (public)
- ⚠️ Không hardcode secrets trong code

### Bước 4: Deploy

1. **Click Deploy** → Vercel sẽ tự động:
   - Clone repository
   - Install dependencies (`npm install`)
   - Build Next.js app (`npm run build`)
   - **Tự động chạy `postbuild` script** → `npm run init-admin` (tạo admin user)
   - Deploy lên CDN global

2. **Đợi deploy hoàn tất** (~2-5 phút)

3. **Kiểm tra deployment**:
   - Vào `Deployments` tab
   - Click vào deployment mới nhất
   - Xem build logs để kiểm tra:
     - ✅ Build thành công
     - ✅ `postbuild` script chạy thành công
     - ✅ Admin user được tạo (nếu chưa tồn tại)
   - Click `Visit` để mở site

### Bước 5: Automatic Admin Initialization

**🎉 Tính năng tự động khởi tạo Admin**

Dự án đã được cấu hình để **tự động tạo tài khoản admin** sau mỗi lần build trên Vercel thông qua script `postbuild`.

#### Cách hoạt động:

1. **Khi Vercel build xong**, script `postbuild` sẽ tự động chạy:
   ```json
   {
     "scripts": {
       "build": "next build",
       "postbuild": "npm run init-admin"
     }
   }
   ```

2. **Script `init-admin` sẽ**:
   - Đọc các biến môi trường: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
   - Kiểm tra xem user với email đó đã tồn tại chưa
   - Nếu **chưa tồn tại**: Tạo user mới trong database và Supabase Auth
   - Nếu **đã tồn tại**: Cập nhật password và role thành `superadmin`
   - Hash password bằng bcrypt trước khi lưu

3. **Kết quả**:
   - Tài khoản admin được tạo/cập nhật tự động
   - Có thể đăng nhập ngay sau khi deploy xong
   - Không cần thao tác thủ công

#### Yêu cầu Environment Variables:

Đảm bảo đã set các biến sau trong Vercel (xem Bước 3):
- ✅ `ADMIN_EMAIL` - Email của admin
- ✅ `ADMIN_PASSWORD` - Mật khẩu admin
- ✅ `ADMIN_NAME` - Tên hiển thị (optional, mặc định: "Admin")
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - **Bắt buộc** để tạo user trong Supabase Auth

#### Kiểm tra Admin đã được tạo:

1. **Xem Build Logs trên Vercel**:
   - Vào deployment → `Build Logs`
   - Tìm dòng: `Superadmin user updated in database` hoặc `User created in Supabase Auth`
   - Nếu có lỗi, sẽ hiển thị warning nhưng không fail build

2. **Đăng nhập thử**:
   - Vào `/login`
   - Dùng `ADMIN_EMAIL` và `ADMIN_PASSWORD` đã set trong Vercel
   - Nếu đăng nhập thành công → Admin đã được tạo đúng

#### Lưu ý quan trọng:

- ⚠️ **Script chỉ chạy khi build thành công** - Nếu build fail, script không chạy
- ⚠️ **Script chạy mỗi lần deploy** - Nếu user đã tồn tại, sẽ cập nhật password và role
- ⚠️ **Nếu thiếu `SUPABASE_SERVICE_ROLE_KEY`**: Script sẽ tạo user trong database nhưng không tạo trong Supabase Auth (user sẽ được tạo tự động khi đăng nhập lần đầu)
- ⚠️ **Password được hash** - Không lưu plain text trong database

### Bước 6: Setup Database trên Production

1. **Chạy migrations** (nếu chưa):
   - Vào Supabase Dashboard
   - SQL Editor → Execute các file migration theo thứ tự:
     - `000_init_all_tables.sql` (hoặc các file migration riêng lẻ)
     - `001_create_user_table.sql`
     - `002_create_post_table.sql`
     - `003_create_siteinfo_table.sql`
     - ... (các migration khác)

2. **Admin User đã được tạo tự động** (qua postbuild script):
   - ✅ Không cần tạo thủ công nữa
   - ✅ Script sẽ tự động chạy sau mỗi lần build
   - ✅ Nếu muốn tạo lại, chỉ cần redeploy hoặc chạy `npm run init-admin` local

3. **Seed dữ liệu mẫu** (optional):
   - Tạo SiteInfo entry qua Admin Panel
   - Upload ảnh vào Storage bucket `images`
   - Tạo vài bài viết và slides mẫu

### Bước 7: Cấu hình Domain (Optional)

1. **Thêm Custom Domain**:
   - Vercel Dashboard → `Settings` → `Domains`
   - Add domain: `yourdomain.com`

2. **Setup DNS**:
   - Thêm CNAME record trỏ tới Vercel
   - `CNAME yourdomain.com cname.vercel-dns.com`

3. **Update Environment Variable**:
   - `NEXT_PUBLIC_BASE_URL=https://yourdomain.com`
   - Redeploy để apply

### Deploy Checklist

- ✅ Repository pushed to GitHub
- ✅ Vercel project created với root directory = `client`
- ✅ Environment variables configured (bao gồm `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SUPABASE_SERVICE_ROLE_KEY`)
- ✅ Supabase database migrated
- ✅ Storage bucket `images` created và public
- ✅ RLS policies enabled
- ✅ First deployment successful
- ✅ Build logs show `postbuild` script chạy thành công
- ✅ Admin user được tạo tự động (kiểm tra trong build logs)
- ✅ Site accessible at Vercel URL
- ✅ Admin login working (dùng `ADMIN_EMAIL` và `ADMIN_PASSWORD` từ env vars)
- ✅ Image upload working

## 🗄 Quản lý Database

### Tables Schema

**User Table**
```sql
CREATE TABLE "User" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Post Table**
```sql
CREATE TABLE "Post" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES "User"(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**SiteInfo Table**
```sql
CREATE TABLE "SiteInfo" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Slides Table**
```sql
CREATE TABLE "Slides" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Backup & Restore

**Backup**:
```bash
# Sử dụng Supabase CLI
supabase db dump -f backup.sql

# Hoặc pg_dump
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
```

**Restore**:
```bash
psql -h db.xxxxx.supabase.co -U postgres -d postgres < backup.sql
```

## 📚 API Documentation

### Public APIs

**GET /public/posts**
- Lấy danh sách bài viết published
- Query: `?limit=10&offset=0`

**GET /public/posts/[slug]**
- Lấy chi tiết bài viết theo slug

**GET /public/slides**
- Lấy slides active

**GET /public/site-info**
- Lấy thông tin website

**POST /public/chat**
- Chat với AI
- Body: `{ message: string, conversationId?: string }`

### Admin APIs (Protected)

**GET /admin/posts**
- Lấy tất cả bài viết (kể cả draft)

**POST /admin/posts**
- Tạo bài viết mới
- Body: `{ title, slug, content, coverImage, status }`

**PUT /admin/posts/[id]**
- Update bài viết

**DELETE /admin/posts/[id]**
- Xóa bài viết

**GET /admin/images**
- Lấy danh sách ảnh từ Storage
- Query: `?bucket=images&prefix=posts&limit=100`

**DELETE /admin/images/delete**
- Xóa ảnh từ Storage
- Query: `?bucket=images&path=posts/image.jpg`

**POST /admin/upload**
- Upload ảnh lên Storage
- FormData: `file`, `bucket`, `folder`

## 🔧 Troubleshooting

### Build Failed trên Vercel

**Lỗi**: `Module not found: Can't resolve '@/components/...'`

**Giải pháp**:
- Kiểm tra `tsconfig.json` có paths mapping
- Đảm bảo imports sử dụng `@/` prefix
- Clear cache: `rm -rf .next node_modules && npm install`

### Database Connection Error

**Lỗi**: `Failed to fetch from Supabase`

**Giải pháp**:
- Check `NEXT_PUBLIC_SUPABASE_URL` đúng format
- Verify `SUPABASE_SERVICE_ROLE_KEY` chính xác
- Kiểm tra RLS policies đã enable
- Check network/firewall không block Supabase

### Image Upload Failed

**Lỗi**: `Upload failed: 403 Forbidden`

**Giải pháp**:
- Kiểm tra Storage bucket `images` đã tạo
- Set bucket public = `true`
- Check RLS policies cho Storage
- Verify `SUPABASE_SERVICE_ROLE_KEY` có quyền

### Admin Can't Login

**Lỗi**: `Invalid credentials`

**Giải pháp**:
- Verify admin user exists trong `User` table
- Check email/password đúng với giá trị trong Vercel Environment Variables
- Kiểm tra role = `superadmin` hoặc `admin`
- Kiểm tra build logs trên Vercel xem `postbuild` script có chạy thành công không
- Nếu user chưa được tạo, redeploy để trigger lại `postbuild` script
- Try reset password qua Supabase Auth Dashboard
- Verify `SUPABASE_SERVICE_ROLE_KEY` đúng và có quyền

**Kiểm tra Admin User đã được tạo**:
```sql
-- Chạy trong Supabase SQL Editor
SELECT id, email, name, role FROM "User" WHERE email = 'admin@yourdomain.com';
```

**Nếu user chưa tồn tại sau deploy**:
1. Kiểm tra Vercel build logs có lỗi gì không
2. Verify tất cả environment variables đã được set đúng
3. Redeploy để trigger lại `postbuild` script
4. Hoặc chạy manual: `npm run init-admin` local với production env vars

### Slides không hiển thị

**Giải pháp**:
- Check có slides với `active = true`
- Verify images đã upload
- Check console logs for errors
- Kiểm tra RLS policies cho `Slides` table

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server (port 3000)
npm run build        # Build production
npm run postbuild    # Auto-run after build (chạy init-admin)
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run init-admin   # Create/update admin user
npm run migrate      # Show migration SQL

# Utilities
npm run type-check   # TypeScript type checking
```

### Script Details

#### `npm run init-admin`

Script tự động tạo/cập nhật tài khoản admin:

**Chức năng**:
- Tạo user mới trong database với role `superadmin` (nếu chưa tồn tại)
- Cập nhật password và role cho user đã tồn tại
- Tạo user trong Supabase Auth (nếu có `SUPABASE_SERVICE_ROLE_KEY`)
- Hash password bằng bcrypt trước khi lưu

**Environment Variables cần thiết**:
- `ADMIN_EMAIL` - Email của admin (required)
- `ADMIN_PASSWORD` - Mật khẩu admin (required)
- `ADMIN_NAME` - Tên hiển thị (optional, default: "Admin")
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (optional, để tạo user trong Supabase Auth)

**Sử dụng**:
```bash
# Local development
npm run init-admin

# Trên Vercel (tự động chạy sau build)
# Script được gọi tự động qua postbuild hook
```

**Output**:
```
Superadmin user updated in database: {
  id: 'xxx',
  email: 'admin@example.com',
  name: 'Administrator',
  role: 'superadmin'
}
Password updated in Supabase Auth
```

#### `npm run postbuild`

Script tự động chạy sau khi `npm run build` hoàn thành. Trên Vercel, script này sẽ:
1. Chạy sau khi build Next.js app thành công
2. Tự động gọi `npm run init-admin`
3. Tạo/cập nhật admin user với thông tin từ environment variables
4. Không fail build nếu có warning (chỉ log)

**Lưu ý**: Script này chỉ chạy khi build thành công. Nếu build fail, script không chạy.

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙋 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/nvtin1104/web-ai/issues)
- **Email**: admin@yourdomain.com

---

Made with ❤️ using Next.js and Supabase

