import { animate, AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CgMenuGridR } from "react-icons/cg";
import { useMediaQuery } from "react-responsive";
import { FiMapPin, FiPhoneCall, FiMail, FiX } from "react-icons/fi";

// components
import Nav from "./Nav";
import Socials from "./Socials";

const FixedMenu = () => {
  const [showMenuButton, setShowMenuButton] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isMobile = useMediaQuery({
    query: "(max-width:640px)",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const handleScroll = () => {
        setShowMenuButton(window.scrollY > 150 || isMobile);
      };
      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile, isMounted]);

  if (!isMounted) return null;

  return (
    // Wrapper หลัก: ยึดติดขอบล่าง จัดกึ่งกลาง และกำหนด z-index สูงสุด
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-6 sm:pb-8 pointer-events-none">
      
      {/* --- MENU SECTION --- */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            // Styles ปรับปรุงใหม่:
            // 1. mb-4: เว้นระยะห่างจากปุ่มกดเล็กน้อย
            // 2. w-[calc(100%-2rem)]: ความกว้างเต็มจอแต่ลบขอบออกข้างละ 1rem (ไม่ให้ชิดขอบจอ)
            // 3. max-w-md: ในมือถือไม่ให้กว้างเกิน 1 คอลัมน์สวยๆ (Desktop ขยายได้)
            // 4. max-h-[70vh]: สำคัญมาก! กันเมนูทะลุจอด้านบน ถ้าจอมือถือเตี้ย
            // 5. overflow-y-auto: ถ้า Content เยอะเกินจอ ให้เลื่อนดูในกล่องได้
            className="pointer-events-auto mb-4 w-[calc(100%-2rem)] md:w-auto md:max-w-[1170px] max-w-md max-h-[70vh] overflow-y-auto scrollbar-hide rounded-2xl shadow-2xl"
          >
            <div className="bg-white p-8 md:p-12 w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
              
              {/* Navigation */}
              <Nav
                containerStyles="w-full md:w-auto text-center md:text-left md:border-r border-gray-200 md:pr-12"
                listStyles="flex flex-col justify-center gap-4"
                linkStyles="font-primary text-3xl text-primary cursor-pointer hover:text-accent transition-colors"
                spy={true}
                onLinkClick={() => setShowMenu(false)}
              />

              {/* Info (Desktop Only) */}
              <div className="hidden md:flex flex-col gap-6">
                <div className="flex gap-8">
                  <div className="flex flex-col">
                    <div className="text-[24px] text-accent mb-1"><FiMapPin /></div>
                    <p className="font-semibold text-primary text-base">Location</p>
                    <p className="text-sm text-gray-600">Bangkok, Thailand</p>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[24px] text-accent mb-1"><FiPhoneCall /></div>
                    <p className="font-semibold text-primary text-base">Phone</p>
                    <p className="text-sm text-gray-600">+66614461930</p>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[24px] text-accent mb-1"><FiMail /></div>
                    <p className="font-semibold text-primary text-base">Email</p>
                    <p className="text-sm text-gray-600">saranphat.tre289@gmail.com</p>
                  </div>
                </div>
                
                <Socials
                  containerStyles="flex gap-3 mt-2"
                  iconStyles="text-[20px] w-[36px] h-[36px] flex items-center justify-center rounded-full bg-gray-100 text-primary hover:bg-accent hover:text-white transition-all duration-300"
                />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BUTTON SECTION --- */}
      <AnimatePresence>
        {showMenuButton && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => setShowMenu(!showMenu)}
            className={`
              pointer-events-auto
              w-[56px] h-[56px] rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 z-50
              ${showMenu ? "bg-red-500 hover:bg-red-600" : "bg-accent hover:bg-accent/90"}
            `}
          >
            {showMenu ? (
              <FiX className="text-2xl text-white" />
            ) : (
              <CgMenuGridR className="text-3xl text-white" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FixedMenu;