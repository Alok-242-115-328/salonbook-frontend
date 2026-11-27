/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... আপনার অন্যান্য কনফিগ
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://salonbook-backend-nuic.onrender.com/api/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
