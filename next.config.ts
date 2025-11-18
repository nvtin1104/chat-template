import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/**",
      },
    ],
    // Cho phép proxy URL từ cùng domain với query string
    localPatterns: [
      {
        pathname: "/api/admin/images/proxy**",
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
