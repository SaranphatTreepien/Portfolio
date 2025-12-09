import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'my_portfolio';
const COLLECTION_NAME = 'projects_content'; // แนะนำให้แยกชื่อ Collection ไม่ให้ปนกับข้อมูลอื่น

// 🟢 GET: ดึงข้อมูลเฉพาะของ Slug ที่ส่งมา
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // 1. รับค่า slug จาก URL (เช่น /api/projects?slug=luminex-ui-kit)
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // 2. ค้นหาเอกสารที่มี slug ตรงกัน
    const projectData = await db.collection(COLLECTION_NAME).findOne({ slug: slug });

    // 3. ส่งกลับเฉพาะ items (ถ้าไม่เจอให้ส่ง array ว่าง)
    return NextResponse.json(projectData ? projectData.items : []);
    
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// 🟠 POST: บันทึกข้อมูลลงใน Slug นั้นๆ (ไม่ลบของคนอื่น)
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // 1. รับค่าที่ส่งมาจาก Frontend ({ slug, items })
    const body = await request.json();
    const { slug, items } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // 2. ใช้ updateOne แบบ Upsert (ถ้ามีให้อัปเดต ถ้าไม่มีให้สร้างใหม่)
    // ค้นหาด้วย slug -> แล้ว set ค่า items เป็นค่าใหม่
    await db.collection(COLLECTION_NAME).updateOne(
      { slug: slug }, 
      { $set: { slug: slug, items: items } }, 
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: `Saved data for ${slug}` });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}