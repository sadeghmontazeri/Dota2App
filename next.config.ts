// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ این بخش را اضافه کنید
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // ✅ دامنه جدید را اینجا وارد کنید
        hostname: "cdn.cloudflare.steamstatic.com",
        port: "",
        pathname: "/apps/dota2/images/dota_react/heroes/**",
      },
    ],
  },
};

export default nextConfig;
