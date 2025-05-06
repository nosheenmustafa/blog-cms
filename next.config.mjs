/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com",  //for google profile picture
      "avatars.githubusercontent.com",   //for github profile picture 
      "platform-lookaside.fbsbx.com", //for facebook profile picture 
    ],
  },
};

export default nextConfig;
