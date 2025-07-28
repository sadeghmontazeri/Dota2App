// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ این بخش را اضافه کنید
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.opendota.com",
        port: "",
        pathname: "/apps/dota2/images/heroes/**",
      },
    ],
  },
};

export default nextConfig;
