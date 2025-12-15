/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // รูปแบบไฟล์ที่รองรับ (ของเดิม)
    formats: ['image/avif', 'image/webp'],
    
    // ✅ เพิ่มส่วนนี้ครับ: อนุญาตโดเมน Cloudinary
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**', // อนุญาตทุกโฟลเดอร์/ทุกรูป
      },
    ],
  },
}

module.exports = nextConfig