import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "cdn.cloudflare.steamstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http" as const, // دامنه cdn.dota2.com از http استفاده می‌کند
        hostname: "cdn.dota2.com", // اضافه کردن این دامنه
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https" as const,
        hostname: "api.opendota.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
} satisfies NextConfig;

export default withPWA(nextConfig);
