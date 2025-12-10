// src/app/api/reset-data/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// 👇 ตรวจสอบชื่อ Collection ให้ดีนะครับ (projects หรือ projects_content)
const DB_NAME = 'my_portfolio';
const COLLECTION_NAME = 'projects'; // หรือ 'projects_content' ตามที่คุณใช้จริง

export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // ลบข้อมูลทั้งหมด!
    const result = await db.collection(COLLECTION_NAME).deleteMany({}); 

    return NextResponse.json({ 
        success: true, 
        message: `ล้างข้อมูลเรียบร้อย! ลบไปทั้งหมด ${result.deletedCount} รายการ` 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}