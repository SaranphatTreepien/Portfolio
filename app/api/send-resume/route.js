import { Resend } from "resend";
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
        const fileContent = fs.readFileSync(filePath).toString("base64");

        const resend = new Resend(process.env.RESEND_API_KEY);

        const result = await resend.emails.send({
            from: "Portfolio <no-reply@yourdomain.com>",
            to: receiverEmail,
            subject: `สมัครงานตำแหน่ง ${position} – ${fullName}`,
            text: `
ชื่อ: ${fullName}
บริษัท: ${company}
ตำแหน่งที่สมัคร: ${position}
ผู้รับ HR: ${receiverName}
ทักษะเด่น: ${skills}
Portfolio: ${portfolio}
เบอร์โทร: ${phone}
      `,
            attachments: [
                {
                    filename: "resume.pdf",
                    content: fileContent,
                    contentType: "application/pdf",
                }
            ]
        });

        return Response.json({ success: true, result });

    } catch (error) {
        console.error("Email error:", error);
        return Response.json({ success: false, error });
    }
}
