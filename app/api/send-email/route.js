import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            fullName,
            position,
            company,
            receiverEmail, 
            emailSender,   
            phone,
            bodyText,      
            attachments    
        } = body;

        console.log(`📩 Preparing email to: ${receiverEmail}`);

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

        const info = await transporter.sendMail({
            from: `"${fullName} - Portfolio" <${process.env.SMTP_USER}>`, 
            to: receiverEmail,                                            
            replyTo: emailSender,                                         
            subject: `สมัครงานตำแหน่ง ${position} – ${fullName}`,         
            text: bodyText,                                              
            attachments: mailAttachments                                  
        });

        console.log("✅ Message sent:", info.messageId);

        return NextResponse.json({ success: true, messageId: info.messageId }, { status: 200 });

    } catch (error) {
        console.error("❌ Email API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}