/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    taint: true,
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com"
      },
      {
        hostname: "imagedelivery.net"
      },
      {
        hostname: "lh3.googleusercontent.com"
      }
    ]
  }
};

export default nextConfig;
