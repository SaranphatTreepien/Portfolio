import { useState, useRef } from "react";
import emailjs from "emailjs-com";
import AnimatedText from "./AnimatedText";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

const Contact = () => {
  const formRef = useRef(); // 👈 อ้างอิงฟอร์ม
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
    file: null, // เพิ่มไฟล์
  });
  const [showNotification, setShowNotification] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    // ส่งอีเมลไปหาคุณ (เจ้าของเว็บไซต์)
    emailjs
      .send(
        "service_dgj4ayv", // Service ID ของคุณ
        "template_ili86ci", // Template สำหรับคุณ
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          time: new Date().toLocaleString("th-TH"), // วันที่เวลาไทย
          attachment: formData.file, // 👈 ส่งไฟล์ base64 ไปด้วย
        },
        "jUeofg9Z-GDt6SElF" // Public Key
      )
      .then(
        (result) => {
          console.log("✅ Email sent successfully!", result.text);
          // แสดง Notification
          setShowNotification(true);
          // ซ่อน Notification หลัง 3 วินาที
          setTimeout(() => setShowNotification(false), 3000);
          setShowIcon(true);
          setFormData({
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            message: "",
            file: null,
          });
          // ส่ง Auto-Reply ไปยังผู้ส่ง
          emailjs
            .send(
              "service_dgj4ayv", // Service ID เดิม
              "template_b97wpbe", // Template Auto-Reply
              {
                name: formData.firstname, // ชื่อลูกค้า
                title: formData.message, // ข้อความที่ลูกค้าส่ง
                email: formData.email, // อีเมลผู้ส่ง
              },
              "jUeofg9Z-GDt6SElF" // Public Key เดิม
            )
            .then((res) => console.log("✅ Auto-reply sent!", res.text))
            .catch((err) => console.error("❌ Auto-reply failed:", err.text));

          setTimeout(() => setShowIcon(false), 3000);
        },
        (error) => {
          console.error("❌ Failed to send email:", error.text);
        }
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <section className="pt-8 xl:pt-12 pb-32" id="Contact">
      <div className="container mx-auto">
        <div className="flex flex-col items-center xl:flex-row gap-16">
          <div className="flex-1 mx-auto xl:mx-0 flex flex-col">
            <AnimatedText
              text="Let's Work Together"
              textStyles="h2 mb-12 text-center xl:text-left"
            />
            <form
              ref={formRef} // 👈 เพิ่ม ref
              onSubmit={handleFormSubmit}
              className="flex flex-col gap-6 w-full max-w-[480px]"
            >
              <div className="flex gap-8">
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-primary">
                    First Name <span className="text-accent">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    className="input"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-primary">
                    Last Name <span className="text-accent">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    className="input"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-primary">
                  Email <span className="text-accent">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  value={formData.email}
                  className="input"
                  placeholder="youremail@email.com"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-primary">
                  Phone Number <span className="text-accent">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="phone"
                  value={formData.phone}
                  className="input"
                  placeholder="+66 1234 5678"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-primary">
                  Message <span className="text-accent">*</span>
                </label>
                <textarea
                  onChange={handleChange}
                  name="message"
                  value={formData.message}
                  className="textarea"
                  placeholder="Leave me a message..."
                  rows="5"
                  required
                />
              </div>
              {/* ...input fields เดิม */}
              {/* <div>
                <label className="block mb-2 text-sm font-medium text-primary">
                  File Attachment
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className="input"
                />
              </div> */}

              <button
                type="submit"
                disabled={isSending}
                className="btn btn-accent flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <FaCheckCircle
                      className={`absolute text-white text-lg transition-opacity
                      duration-500 ease-in-out ${
                        showIcon ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span
                      className={`transition-opacity duration-500
                    ease-in-out ${showIcon ? "opacity-0" : "opacity-100"}`}
                    >
                      Send message
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="hidden xl:flex relative w-[577px] h-[664px] rounded-lg overflow-hidden">
            <Image
              src="/assets/contact/img.png"
              className="object-cover"
              fill
              quality={100}
              alt=""
            />
          </div>
        </div>
      </div>
      {/* ← ใส่ Notification ตรงนี้ */}
      {showNotification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2">
          <FaCheckCircle /> Your message has been sent successfully!
        </div>
      )}
    </section>
  );
};

export default Contact;
