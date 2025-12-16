import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'my_portfolio';
const COLLECTION_NAME = 'projects';

// ✅ GET: เรียงตาม createdAt (จากใหม่ไปเก่า)
// ✅ GET: เรียงดาว (Best) ขึ้นก่อน -> ตามด้วยวันที่ใหม่สุด
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
      const projects = await db.collection(COLLECTION_NAME)
        .find({})
        // 🔥 แก้ตรงนี้: ให้ความสำคัญกับ isBest (-1 คือมากไปน้อย/True มาก่อน) แล้วค่อยดูวันที่
        .sort({ isBest: -1, createdAt: -1 })
        .toArray();
      return NextResponse.json(projects);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();

    if (!body.slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // แยก _id และ originalSlug ออกจากข้อมูลที่จะอัปเดต
    const { _id, originalSlug, ...updateData } = body;
    const newSlug = body.slug;

    // 🔥 1. ตรวจสอบ Slug ซ้ำ
    const existingProject = await db.collection(COLLECTION_NAME).findOne({ slug: newSlug });

    if (existingProject) {
      // กรณี 1: สร้างงานใหม่ แต่ชื่อซ้ำ
      if (!originalSlug) {
        return NextResponse.json({ error: "Slug (URL) นี้ถูกใช้งานแล้ว โปรดตั้งชื่ออื่น" }, { status: 409 });
      }
      // กรณี 2: แก้ไขงานเดิม แต่เปลี่ยนชื่อไปซ้ำกับคนอื่น
      if (originalSlug && newSlug !== originalSlug) {
        return NextResponse.json({ error: "Slug (URL) นี้ถูกใช้งานแล้ว โปรดตั้งชื่ออื่น" }, { status: 409 });
      }
    }

    // 🔥 2. จัดการเรื่องวันที่ (Date Logic)
    if (body.createdAt) {
      updateData.createdAt = new Date(body.createdAt);
    } else {
      if (!originalSlug) {
        updateData.createdAt = new Date();
      }
    }

    // 🔥 3. เพิ่มเติม: บังคับให้ Checkbox เป็น Boolean (กันไว้ดีกว่าแก้)
    updateData.isCertificate = Boolean(body.isCertificate);
    updateData.isBest = Boolean(body.isBest);

    // 🔥 4. บันทึกลง Database
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