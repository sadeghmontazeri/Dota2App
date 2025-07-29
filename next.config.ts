// next.config.mjs

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // (اختیاری) یک گزینه خوب برای توسعه
  images: {
    // فقط از remotePatterns (روش جدید) استفاده می‌کنیم
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.cloudflare.steamstatic.com",
      },
      {
        protocol: "https", // بهتر است آدرس cdn.dota2.com را با api.opendota.com جایگزین کنید
        hostname: "api.opendota.com",
      },
      {
        protocol: "http", // دامنه cdn.dota2.com از http استفاده می‌کند
        hostname: "cdn.dota2.com", // اضافه کردن این دامنه
      },
    ],
  },
};

export default withPWA(nextConfig);
