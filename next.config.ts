import type { NextConfig } from "next";


const nextConfig: NextConfig = {
images:{
  remotePatterns:[
    {
      hostname:'lh3.googleusercontent.com',
      port:''
    }
  ]
}
};

export default nextConfig;
