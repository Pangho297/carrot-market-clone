/** @type {import('next').NextConfig} */
const nextConfig = {
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
