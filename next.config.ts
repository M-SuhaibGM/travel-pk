import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* In Next.js 16, this is now a top-level key. 
     It tells Next.js to treat 'pdf-parse' as a standard Node.js 
     package instead of trying to bundle it for the browser.
  */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;