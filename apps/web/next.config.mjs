/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["oslo"],
  async redirects() {
    return [
      {
        source: "/settings",
        destination: "/settings/profile",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
