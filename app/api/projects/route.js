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
        // เรียงตาม order ก่อน แล้วค่อย fallback ไปที่ Best/createdAt สำหรับข้อมูลเก่า
        .sort({ order: 1, isBest: -1, createdAt: -1 })
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

    const { _id, originalSlug, ...updateData } = body;
    const newSlug = body.slug;

    // 🔥 1. ตรวจสอบ Slug ซ้ำ (เหมือนเดิม)
    const existingProject = await db.collection(COLLECTION_NAME).findOne({ slug: newSlug });
    if (existingProject) {
      if (!originalSlug) {
        return NextResponse.json({ error: "Slug (URL) นี้ถูกใช้งานแล้ว โปรดตั้งชื่ออื่น" }, { status: 409 });
      }
      if (originalSlug && newSlug !== originalSlug) {
        return NextResponse.json({ error: "Slug (URL) นี้ถูกใช้งานแล้ว โปรดตั้งชื่ออื่น" }, { status: 409 });
      }
    }

    // 🔥 2. จัดการเรื่องวันที่ (เหมือนเดิม)
    if (body.createdAt) {
      updateData.createdAt = new Date(body.createdAt);
    } else if (!originalSlug) {
      updateData.createdAt = new Date();
    }

    // 🔥 3. ปรับปรุงใหม่: ตรวจสอบการมีอยู่ของฟิลด์ก่อนเซฟ
    // เราจะไม่ใช้ Boolean(body.isBest) ตรงๆ เพราะถ้าค่าไม่มีมันจะกลายเป็น false
    // เราจะเซฟเฉพาะตอนที่หน้า Dashboard ส่งค่านั้นมาจริงๆ เท่านั้น

    if (Object.prototype.hasOwnProperty.call(body, 'isCertificate')) {
      updateData.isCertificate = Boolean(body.isCertificate);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'isBest')) {
      updateData.isBest = Boolean(body.isBest);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'order')) {
      const orderValue = Number(body.order);
      if (!Number.isNaN(orderValue)) {
        updateData.order = orderValue;
      }
    } else if (!originalSlug) {
      const maxOrderDoc = await db.collection(COLLECTION_NAME)
        .find({ order: { $type: 'number' } })
        .sort({ order: -1 })
        .limit(1)
        .toArray();

      const currentMaxOrder = maxOrderDoc[0]?.order || 0;
      updateData.order = currentMaxOrder + 1;
    }

    // 🔥 4. บันทึกลง Database
    const filter = { slug: originalSlug || newSlug };

    // ใช้ $set: updateData หมายถึง "อัปเดตเฉพาะฟิลด์ที่ส่งมา" 
    // ค่าอื่นๆ ที่อยู่ใน DB อยู่แล้ว (เช่น isBest ที่ไม่ได้ส่งมาในรอบนี้) จะไม่หายไป
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