/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // รูปแบบไฟล์ที่รองรับ (ของเดิม)
    formats: ['image/avif', 'image/webp'],

    // ✅ เพิ่ม quality 100 สำหรับรูปที่ต้องการคมชัด
    qualities: [100, 75, 70],

    // อนุญาตโดเมน Cloudinary
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig