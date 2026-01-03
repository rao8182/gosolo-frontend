import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: [
      'gosolo-order-api.preview.emergentagent.com',
      '.preview.emergentagent.com',
    ],
  },
};

export default nextConfig;
