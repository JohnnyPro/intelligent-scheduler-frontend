import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/teacher/dashboard",
        destination: "/teacher/schedule",
        permanent: true,
      },
      {
        source: "/student/dashboard",
        destination: "/student/schedule",
        permanent: true,
      },
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
