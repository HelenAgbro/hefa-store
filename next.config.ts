import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allows the generated SVG placeholder photography to be served through
    // next/image. Real photos (JPG/PNG) work without this flag.
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;

