import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // ในโหมด Dev ใช้ global variable เพื่อเก็บ connection ไว้ไม่ให้ต่อใหม่ทุกครั้งที่แก้โค้ด
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // ในโหมด Production (Vercel) สร้าง connection ปกติ
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;