import { useState, useRef } from "react";
import AnimatedText from "./AnimatedText";
import { useLang } from "./LanguageProvider";
import Image from "next/image";
import { FaCheckCircle, FaPaperPlane, FaGlobeAsia } from "react-icons/fa";

const Contact = () => {
  const { t } = useLang();
  const formRef = useRef();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    countryCode: "+66", // Default เป็นไทย
    phone: "",
    message: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showIcon, setShowIcon] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setErrorMessage("");

    // รวมเบอร์โทรกับรหัสประเทศก่อนส่ง
    const fullPhone = `${formData.countryCode} ${formData.phone}`;

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          fullName: `${formData.firstname} ${formData.lastname}`,
          emailSender: formData.email,
          phone: fullPhone,
          bodyText: formData.message,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to send message");
      }

        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
        setShowIcon(true);
        setFormData({ firstname: "", lastname: "", email: "", countryCode: "+66", phone: "", message: "" });
        setTimeout(() => setShowIcon(false), 3000);
    } catch (error) {
      console.error("Contact form error:", error);
      setErrorMessage(error.message || "Unable to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="relative pt-12 pb-32 overflow-hidden" id="Contact">
      <div className="container mx-auto px-4">
        <div className="flex flex-col xl:flex-row gap-12 items-center justify-center">
          
          {/* --- Left Side: Content & Form --- */}
          <div className="w-full max-w-[650px] space-y-8">
            <div className="text-center xl:text-left">
              <AnimatedText
                text={t("contact.title")}
                textStyles="text-5xl font-bold mb-4 text-primary"
              />
              <p className="text-gray-500 text-lg">
                {t("contact.lead1")}<span className="text-primary font-medium">{t("contact.lead2")}</span>{t("contact.lead3")}
              </p>
            </div>

            <form
              ref={formRef}
              onSubmit={handleFormSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/90 backdrop-blur-md p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white"
            >
              {/* Name Fields */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("contact.first")}</label>
                <input
                  name="firstname"
                  onChange={handleChange}
                  value={formData.firstname}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                  placeholder={t("contact.phFirst")}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("contact.last")}</label>
                <input
                  name="lastname"
                  onChange={handleChange}
                  value={formData.lastname}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                  placeholder={t("contact.phLast")}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("contact.email")}</label>
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                  placeholder="hello@example.com"
                  required
                />
              </div>

              {/* Phone Field with Country Code Selection */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("contact.phone")}</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="appearance-none bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 pr-10 font-medium focus:ring-2 focus:ring-accent/20 outline-none cursor-pointer"
                    >
                      <option value="+66">🇹🇭 +66</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                      ▼
                    </div>
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    onChange={handleChange}
                    value={formData.phone}
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                    placeholder="81-234-5678"
                    required
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("contact.message")}</label>
                <textarea
                  name="message"
                  onChange={handleChange}
                  value={formData.message}
                  rows="4"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-accent/20 transition-all outline-none resize-none"
                  placeholder={t("contact.phMessage")}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="relative w-full h-[64px] bg-primary text-white rounded-2xl font-bold overflow-hidden transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 group"
                >
                  <div className={`flex items-center justify-center gap-3 text-lg transition-all duration-300 ${showIcon ? "-translate-y-12 opacity-0" : ""}`}>
                    {isSending ? t("contact.sending") : t("contact.send")}
                    <FaPaperPlane className="text-base group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  
                  <div className={`absolute inset-0 flex items-center justify-center gap-2 text-[#7edad2] text-lg transition-all duration-500 ${showIcon ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
                    <FaCheckCircle /> {t("contact.sent")}
                  </div>
                </button>
              </div>
            </form>
          </div>

          {/* --- Right Side: Image Only --- */}
          <div className="hidden xl:flex relative w-[480px] h-[580px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-white">
            <Image
              src="/assets/contact/img.png"
              className="object-cover transition-transform duration-1000 hover:scale-105"
              fill
              quality={100}
              alt={t("contact.imageAlt")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
          </div>

        </div>
      </div>

      {/* --- Notification --- */}
      <div className={`fixed bottom-10 right-10 z-[100] transition-all duration-500 transform ${showNotification ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
        <div className="bg-primary text-white px-8 py-5 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex items-center gap-4 border-b-4 border-accent">
          <FaCheckCircle className="text-accent text-xl" />
          <div>
            <p className="font-bold">{t("contact.success")}</p>
            <p className="text-sm text-gray-300">{t("contact.successText")}</p>
          </div>
        </div>
      </div>
      {errorMessage && (
        <div className="fixed bottom-10 right-10 z-[100] max-w-sm rounded-2xl bg-red-600 px-6 py-4 text-white shadow-xl">
          <p className="font-bold">{t("contact.failed")}</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}
    </section>
  );
};

export default Contact;