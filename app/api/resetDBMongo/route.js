import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("my_portfolio");
    
    // ⚠️ คำสั่งนี้จะลบข้อมูลทั้งหมดใน Collection "projects_content" ทิ้งทันที
    await db.collection("projects_content").deleteMany({}); 

    return NextResponse.json({ message: "ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}