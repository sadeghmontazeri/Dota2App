/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "cdn.dota2.com",
        port: "",
        pathname: "/apps/dota2/images/heroes/**",
      },
    ],
  },
};

export default nextConfig;
