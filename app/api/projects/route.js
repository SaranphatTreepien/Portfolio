import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'my_portfolio';
const COLLECTION_NAME = 'projects';

// ✅ GET: เหมือนเดิม
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const project = await db.collection(COLLECTION_NAME).findOne({ slug: slug });
      return NextResponse.json(project || {});
    } else {
      const projects = await db.collection(COLLECTION_NAME).find({}).sort({ _id: -1 }).toArray();
      return NextResponse.json(projects);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST: ปรับปรุงให้รองรับการเปลี่ยน Slug (Rename)
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();

    if (!body.slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const { _id, originalSlug, ...updateData } = body;
    const newSlug = body.slug;

    // 🔥 1. ตรวจสอบว่า Slug ใหม่ซ้ำกับใครในระบบไหม?
    const existingProject = await db.collection(COLLECTION_NAME).findOne({ slug: newSlug });

    if (existingProject) {
      // กรณีที่ 1: สร้างงานใหม่ (ไม่มี originalSlug) แต่ดันไปเจอ Slug ที่มีอยู่แล้ว
      if (!originalSlug) {
        return NextResponse.json({ error: "Slug (URL) นี้ถูกใช้งานแล้ว โปรดตั้งชื่ออื่น" }, { status: 409 });
      }

      // กรณีที่ 2: แก้ไขงานเดิม (มี originalSlug) แต่เปลี่ยนชื่อไปซ้ำกับคนอื่น
      // (เช็คว่าชื่อใหม่ ไม่ใช่ชื่อเดิมของตัวเอง)
      if (originalSlug && newSlug !== originalSlug) {
        return NextResponse.json({ error: "Slug (URL) นี้ถูกใช้งานแล้ว โปรดตั้งชื่ออื่น" }, { status: 409 });
      }
    }

    // 🔥 2. ถ้าไม่ซ้ำ ก็บันทึกตามปกติ
    const filter = { slug: originalSlug || newSlug };

    await db.collection(COLLECTION_NAME).updateOne(
      filter,
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE: เหมือนเดิม
export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const result = await db.collection(COLLECTION_NAME).deleteOne({ slug: slug });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}