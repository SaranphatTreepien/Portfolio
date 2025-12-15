// /app/api/restoreDBMongo/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; 

const DB_NAME = 'my_portfolio';
const COLLECTION_NAME = 'projects';

export async function POST(request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // อ่านข้อมูล JSON ดิบที่ส่งมาจาก Frontend
    const rawData = await request.json(); 
    let projectsData;

    // 🔥 1. ปรับปรุง: ตรวจสอบและดึง Array ออกจาก Key 'items' (ตามรูปแบบไฟล์ Backup ของคุณ)
    if (Array.isArray(rawData)) {
        projectsData = rawData; // ข้อมูลเป็น Array โดยตรง
    } else if (rawData && Array.isArray(rawData.items)) {
        projectsData = rawData.items; // ข้อมูลถูกครอบด้วย Key "items" (ตามไฟล์ Backup ที่คุณส่งมา)
    } else {
        // ถ้ายังหา Array ไม่เจอ ให้ส่ง Error ออกไป
        return NextResponse.json({ 
            error: 'Invalid data format. Expected an array of projects or an object containing an "items" array.' 
        }, { status: 400 });
    }

    // 2. ล้างข้อมูลเก่าทั้งหมดใน Collection (สำคัญมาก)
    const deleteResult = await db.collection(COLLECTION_NAME).deleteMany({});
    console.log(`[RESTORE DB] Deleted ${deleteResult.deletedCount} old documents.`);

    // 3. ปรับปรุงข้อมูลก่อนใส่: ลบ _id เดิมออก เพื่อให้ MongoDB สร้าง _id ใหม่
    const sanitizedData = projectsData.map(item => {
      // ใช้ Spread operator เพื่อสร้าง Object ใหม่ที่ไม่มีฟิลด์ _id
      const { _id, ...rest } = item;
      return rest;
    });

    // 4. ใส่ข้อมูลใหม่จากไฟล์ JSON
    let insertResult = { insertedCount: 0 };
    if (sanitizedData.length > 0) {
      insertResult = await db.collection(COLLECTION_NAME).insertMany(sanitizedData);
    }
    
    console.log(`[RESTORE DB] Successfully inserted ${insertResult.insertedCount} new documents.`);

    return NextResponse.json({ 
      message: 'Database restored successfully.',
      deletedCount: deleteResult.deletedCount,
      insertedCount: insertResult.insertedCount 
    }, { status: 200 });

  } catch (error) {
    console.error('Database Restore Error:', error);
    return NextResponse.json({ 
      error: 'Failed to restore database.', 
      details: error.message 
    }, { status: 500 });
  }
}