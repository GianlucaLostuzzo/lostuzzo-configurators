/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.eu-central-1.amazonaws.com",
        pathname: "/static.configuratori.cdrtorino.com/**",
      },
    ],
  },
};

export default nextConfig;
