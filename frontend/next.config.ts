import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler:true,
  typedRoutes: true,
  images: {
    remotePatterns: [
        
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/my-tiger-vai-bucket/**",
      },
    
    ],
    unoptimized: true,
  },
  
  experimental:{
     serverActions: {
      bodySizeLimit: '10mb',
    },
    cssChunking:true
    
    
  }
};

export default nextConfig;
