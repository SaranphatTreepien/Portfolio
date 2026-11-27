/** @type {import('next').NextConfig} */
const nextConfig = {
  // The CV page used to live at /resume
  async redirects() {
    return [
      { source: '/resume', destination: '/cv', permanent: false },
      // Work and Projects were merged into one Experience page
      { source: '/projects', destination: '/experience', permanent: true },
    ]
  },
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
      {
        protocol: 'https',
        hostname: 'images.credly.com',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig