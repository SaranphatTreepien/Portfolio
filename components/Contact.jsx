import { useState, useRef } from "react";
import emailjs from "emailjs-com";
import AnimatedText from "./AnimatedText";
import Image from "next/image";
import { FaCheckCircle, FaPaperPlane, FaGlobeAsia } from "react-icons/fa";

const Contact = () => {
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
  const [showIcon, setShowIcon] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    // รวมเบอร์โทรกับรหัสประเทศก่อนส่ง
    const fullPhone = `${formData.countryCode} ${formData.phone}`;

    emailjs
      .send(
        "service_dgj4ayv",
        "template_ili86ci",
        {
          ...formData,
          phone: fullPhone,
          time: new Date().toLocaleString("en-US"),
        },
        "jUeofg9Z-GDt6SElF"
      )
      .then(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
        setShowIcon(true);
        setFormData({ firstname: "", lastname: "", email: "", countryCode: "+66", phone: "", message: "" });
        setTimeout(() => setShowIcon(false), 3000);
      })
      .finally(() => setIsSending(false));
  };

  return (
    <section className="relative pt-12 pb-32 overflow-hidden" id="Contact">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col xl:flex-row gap-12 items-center justify-center">
          
          {/* --- Left Side: Content & Form --- */}
          <div className="w-full max-w-[650px] space-y-8">
            <div className="text-center xl:text-left">
              <AnimatedText
                text="Let's Work Together"
                textStyles="text-5xl font-bold mb-4 text-primary"
              />
              <p className="text-gray-500 text-lg">
                Got a project in mind? <span className="text-primary font-medium">Please leave your contact details below</span>, and I will get back to you as soon as possible.
              </p>
            </div>

            <form
              ref={formRef}
              onSubmit={handleFormSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/90 backdrop-blur-md p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white"
            >
              {/* Name Fields */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                <input
                  name="firstname"
                  onChange={handleChange}
                  value={formData.firstname}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                <input
                  name="lastname"
                  onChange={handleChange}
                  value={formData.lastname}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                  placeholder="Doe"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
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
                <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
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
                <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                <textarea
                  name="message"
                  onChange={handleChange}
                  value={formData.message}
                  rows="4"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-accent/20 transition-all outline-none resize-none"
                  placeholder="Tell me about your project details..."
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
                    {isSending ? "Sending..." : "Send Message"}
                    <FaPaperPlane className="text-base group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  
                  <div className={`absolute inset-0 flex items-center justify-center gap-2 text-[#7edad2] text-lg transition-all duration-500 ${showIcon ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
                    <FaCheckCircle /> Message Sent Successfully!
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
              alt="Contact image"
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
            <p className="font-bold">Success!</p>
            <p className="text-sm text-gray-300">I'll get back to you shortly.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;