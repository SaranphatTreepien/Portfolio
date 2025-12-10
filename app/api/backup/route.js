import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// 👇 ต้องตรงกับไฟล์ projects/route.js เป๊ะๆ
const DB_NAME = 'my_portfolio';
const COLLECTION_NAME = 'projects_content'; 

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // ดึงข้อมูลทั้งหมดจาก Collection ที่คุณเก็บงานไว้
    const allData = await db.collection(COLLECTION_NAME).find({}).toArray();

    return NextResponse.json({
        timestamp: new Date().toISOString(),
        count: allData.length,
        items: allData // ข้อมูลทั้งหมดจะถูกส่งออกไป
    });
  } catch (error) {
    console.error("Backup Error:", error);
    return NextResponse.json({ error: "Backup failed" }, { status: 500 });
  }
}