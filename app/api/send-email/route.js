import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            type,
            fullName,
            position,
            company,
            receiverEmail, 
            emailSender,   
            phone,
            bodyText,      
            attachments    
        } = body;
        const isContactMessage = type === "contact";
        const recipient = receiverEmail || process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;

        if (!recipient || !emailSender || !bodyText) {
            return NextResponse.json(
                { success: false, error: "Missing email recipient, sender, or message" },
                { status: 400 }
            );
        }

        console.log(`📩 Preparing email to: ${recipient}`);

        const mailAttachments = [];

        if (attachments && Array.isArray(attachments)) {
            for (const file of attachments) {
                // กรณี 1: ไฟล์ที่มีอยู่แล้วบน Server (Resume/CV หลัก)
                if (file.type === "SERVER_FILE") {
                    const relativePath = file.path.startsWith("/") ? file.path.slice(1) : file.path;
                    const fullPath = path.join(process.cwd(), "public", relativePath);

                    if (fs.existsSync(fullPath)) {
                        mailAttachments.push({
                            filename: file.fileName,
                            path: fullPath,
                            contentType: 'application/pdf'
                        });
                    } else {
                        console.warn(`⚠️ File not found on server: ${fullPath}`);
                    }
                } 
                // กรณี 2: ไฟล์ที่อัปโหลดเข้ามา (รูปภาพ หรือ PDF เพิ่มเติม)
                else if (file.type === "UPLOAD_FILE" && file.content) {
                    // file.content เป็น Base64 string
                    // ตัด Header ออก (เช่น "data:application/pdf;base64,...")
                    const base64Data = file.content.split(";base64,").pop();
                    
                    mailAttachments.push({
                        filename: file.fileName,
                        content: Buffer.from(base64Data, "base64"),
                    });
                }
            }
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, 
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const receivedAt = new Intl.DateTimeFormat("th-TH", {
            dateStyle: "long",
            timeStyle: "short",
            timeZone: "Asia/Bangkok",
        }).format(new Date());
        const contactText = [
            "📩 แจ้งเตือนจาก Portfolio",
            "มีผู้ติดต่อส่งข้อความเข้ามาผ่านหน้า Contact",
            "",
            "👤 ข้อมูลผู้ติดต่อ",
            "--------------------",
            `🧑 ชื่อ-นามสกุล: ${fullName}`,
            `📧 อีเมล: ${emailSender}`,
            `📞 เบอร์โทร: ${phone || "ไม่ได้ระบุ"}`,
            `🕒 วันที่ส่ง: ${receivedAt}`,
            "",
            "💬 ข้อความจากผู้ติดต่อ",
            "--------------------",
            bodyText,
            "",
            "↩️ กด Reply เพื่อส่งอีเมลตอบกลับไปยังผู้ติดต่อได้ทันที",
        ].join("\n");

        const info = await transporter.sendMail({
            from: `"${fullName} via Portfolio" <${process.env.SMTP_USER}>`, 
            to: recipient,                                            
            replyTo: emailSender,                                         
            subject: isContactMessage
                ? `📩 [Portfolio Contact] ${fullName} - ${emailSender}`
                : `สมัครงานตำแหน่ง ${position} – ${fullName}`,         
            text: isContactMessage
                ? contactText
                : bodyText,                                              
            attachments: mailAttachments                                  
        });

        console.log("✅ Message sent:", info.messageId);

        return NextResponse.json({ success: true, messageId: info.messageId }, { status: 200 });

    } catch (error) {
        console.error("❌ Email API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}