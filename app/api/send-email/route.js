import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

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

        // 1. เตรียม Attachments สำหรับ Nodemailer
        const mailAttachments = [];

        if (attachments && Array.isArray(attachments)) {
            for (const file of attachments) {
                if (file.type === "PDF") {
                    // อ่านไฟล์ PDF จาก public folder
                    // file.path คือ "/assets/document/resume.pdf"
                    // เราต้องเอา "/" หน้าสุดออกเพื่อให้ path.join ทำงานถูกกับ process.cwd()
                    const relativePath = file.path.startsWith("/") ? file.path.slice(1) : file.path;
                    const fullPath = path.join(process.cwd(), "public", relativePath);

                    if (fs.existsSync(fullPath)) {
                        mailAttachments.push({
                            filename: file.fileName, // ชื่อไฟล์ที่ User แก้ไขแล้ว
                            path: fullPath,          // อ่านจากไฟล์จริงบน Server
                            contentType: 'application/pdf'
                        });
                    } else {
                        console.warn(`File not found: ${fullPath}`);
                    }
                } 
                else if (file.type === "Image" && file.content) {
                    // รูปภาพมาเป็น Base64
                    const base64Data = file.content.split(";base64,").pop();
                    
                    mailAttachments.push({
                        filename: file.fileName,
                        content: Buffer.from(base64Data, "base64"),
                    });
                }
            }
        }

        // 2. ตั้งค่า Nodemailer (ใช้ค่าจาก env ที่คุณเตรียมไว้)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, 
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true", // แปลง string "true" เป็น boolean
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS, // ควรเก็บใน .env
            },
        });

        // 3. ส่งอีเมล
        const info = await transporter.sendMail({
            from: `"${fullName} - Portfolio" <${process.env.SMTP_USER}>`, 
            to: receiverEmail,                                            
            replyTo: emailSender,                                         
            subject: `สมัครงานตำแหน่ง ${position} – ${fullName}`,         
            text: bodyText,                                              
            attachments: mailAttachments                                  
        });

        console.log("Message sent: %s", info.messageId);

        return new Response(JSON.stringify({ success: true, messageId: info.messageId }), { status: 200 });

    } catch (error) {
        console.error("Email API Error:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}