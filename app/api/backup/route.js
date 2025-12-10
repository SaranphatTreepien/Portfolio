import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// 👇 แก้ไขให้ชื่อตรงกับไฟล์ projects/route.js
const DB_NAME = 'my_portfolio';
const COLLECTION_NAME = 'projects'; // ✅ เปลี่ยนจาก 'projects_content' เป็น 'projects'

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // ดึงข้อมูลทั้งหมด
    const allData = await db.collection(COLLECTION_NAME).find({}).toArray();

    return NextResponse.json({
        timestamp: new Date().toISOString(),
        source_collection: COLLECTION_NAME, // ส่งชื่อกลับมาเช็กความชัวร์
        count: allData.length,
        items: allData
    });
  } catch (error) {
    console.error("Backup Error:", error);
    return NextResponse.json({ error: "Backup failed" }, { status: 500 });
  }
}