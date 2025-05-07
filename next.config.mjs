/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",         // Google profile pictures
      "avatars.githubusercontent.com",     // GitHub profile pictures
      "platform-lookaside.fbsbx.com",      // Facebook profile pictures
      "res.cloudinary.com",                // ✅ Cloudinary domain
    ],
  },
};

export default nextConfig;
