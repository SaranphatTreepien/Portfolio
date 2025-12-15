// /lib/mongo/models/projectModel.js

import mongoose from 'mongoose';

// กำหนดโครงสร้าง (Schema) ของ Project
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['2569', '2568', '2567', 'all'], // ปรับ Enum ให้ตรงกับ Category ที่คุณใช้จริง
    default: '2569',
  },
  slug: {
    type: String,
    required: true,
    unique: true, // Slug ต้องไม่ซ้ำกัน
    trim: true,
  },
  img: {
    type: String,
    default: '/images/default.jpg',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  link: {
    type: String,
    required: false, // ลิงก์อาจจะเป็น Optional
  },
  // หากมีฟิลด์อื่น ๆ เช่น description ก็เพิ่มที่นี่
  // description: {
  //   type: String,
  //   required: false,
  // }
}, {
  timestamps: true // เพิ่ม fields createdAt และ updatedAt อัตโนมัติ
});

// หาก Project Model ถูกสร้างไปแล้ว ให้ใช้ตัวเดิม
// หากยังไม่ถูกสร้าง ให้สร้าง Model ใหม่
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;