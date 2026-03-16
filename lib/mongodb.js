import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

// ✅ เพิ่ม options สำหรับ connection pooling
const options = {
  maxPoolSize: 10,        // connection พร้อมใช้สูงสุด 10 ตัว
  minPoolSize: 1,         // รักษา connection ขั้นต่ำ 1 ตัวไว้เสมอ
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let clientPromise;

// ✅ ใช้ global cache ทั้ง dev และ production
// ป้องกัน connection ใหม่ทุกครั้งที่ Vercel serverless function รัน
if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;