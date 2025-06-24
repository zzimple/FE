import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_DOMAIN}/:path*`,  // 실제 api url 경로 (최종적으로 요청 보낼 url)
      },
    ];
  },
  trailingSlash: false,
};

export default nextConfig;
