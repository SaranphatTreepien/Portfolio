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
            receiverName,
            receiverEmail,
            skills,
            portfolio,
            phone
        } = body;

        // โหลดไฟล์ PDF
        const filePath = path.join(process.cwd(), "public", "resume.pdf");
        const fileContent = fs.readFileSync(filePath);

        // สร้าง transporter SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 465,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS.replace(/\s/g, ""),
            },
        });


        // ส่งอีเมล
        const info = await transporter.sendMail({
            from: `"Portfolio" <${process.env.SMTP_USER}>`,
            to: receiverEmail,
            subject: `สมัครงานตำแหน่ง ${position} – ${fullName}`,
            text: `ชื่อ: ${fullName}\nบริษัท: ${company}\nตำแหน่งที่สมัคร: ${position}\nผู้รับ HR: ${receiverName}\nทักษะเด่น: ${skills}\nPortfolio: ${portfolio}\nเบอร์โทร: ${phone}`,
            attachments: [
                {
                    filename: "resume.pdf",
                    content: fileContent,
                    contentType: "application/pdf",
                },
            ],
        });

        return new Response(JSON.stringify({ success: true, info }), { status: 200 });

    } catch (error) {
        console.error("Email error:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}
