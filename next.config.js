/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // รูปแบบไฟล์ที่รองรับ
    formats: ['image/avif', 'image/webp'],
    // กำหนด quality ที่จะใช้ได้ เช่น 75 และ 100
    qualities: [75, 100],
  },
}

module.exports = nextConfig
