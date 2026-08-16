/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mozapay.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
