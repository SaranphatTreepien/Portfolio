import Logo from "./Logo";
// สมมติว่ามี component Socials และ Array สำหรับ Links
import Socials from "./Socials"; 
import Link from "next/link"; 

// ตัวอย่างข้อมูลลิงก์สำหรับ Footer
const footerLinks = [
  { 
    title: "Quick Links", 
    items: [
      { name: "Home", href: "#home" },
      { name: "About Me", href: "#about" },
      { name: "My Work", href: "#work" },
    ]
  }
];

const Footer = () => {
  return (
    <footer className="py-16 xl:py-24 bg-[#1a1a2e] border-t border-white/5"> {/* ใช้สีเข้มโทนน้ำเงิน/ม่วงเข้มแทน primary เพื่อความหรูหรา */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- ส่วนหลัก: แบ่ง 3 คอลัมน์บน Desktop --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 xl:gap-20 pb-12 xl:pb-16">
          
          {/* คอลัมน์ 1: Logo และคำอธิบายย่อ */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-start gap-4">
            <Logo light={true} /> {/* แสดงโลโก้สีสว่าง */}
            <p className="text-white/60 text-sm mt-2 leading-relaxed">
              Crafting engaging digital experiences with modern web technologies.
            </p>
            {/* Socials (อยู่ด้านล่าง Logo) */}
            <Socials 
              containerStyles="flex items-center gap-4 mt-4" 
              iconStyles="text-lg w-10 h-10 border border-white/20 text-white/70 flex items-center justify-center rounded-full hover:bg-accent hover:text-white transition-all duration-300"
            />
          </div>

          {/* คอลัมน์ 2 & 3: Navigation Links */}
          {footerLinks.map((section, sectionIndex) => (
            <div key={sectionIndex} className="col-span-1">
              <h4 className="text-white text-lg font-bold mb-4 border-b border-accent w-fit pb-1">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link 
                      href={item.href}
                      className="text-white/60 hover:text-accent transition-colors text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
        </div>
        
        {/* --- ส่วนเส้นแบ่ง --- */}
        <div className="border-t border-white/10 pt-8 mt-4">
           {/* --- ส่วนล่างสุด: Copyright --- */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-white/50 text-sm font-light order-2 md:order-1 mt-4 md:mt-0">
              Copyright &copy; 2025 | Designed & Developed by [Your Name].
            </p>
            <p className="text-white/50 text-sm font-light order-1 md:order-2">
              <Link href="#" className="hover:text-accent transition-colors">Back to Top</Link>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;