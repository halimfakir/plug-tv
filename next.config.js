/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  images: {
    domains: ["upload.wikimedia.org", "via.placeholder.com"],
  }
};

module.exports = nextConfig;
