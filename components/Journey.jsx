import { FaCss3Alt, FaFigma, FaHtml5, FaJs, FaReact, FaWordpress } from "react-icons/fa";
import AnimatedText from "./AnimatedText";
import Cards from "./Cards/Cards";

const Journey = () => {
  return (
    // ✅ เพิ่ม padding-top (pt) เพื่อดันเนื้อหาลงมาไม่ให้ชนข้างบน
    // pt-20 = สำหรับจอมือถือ, lg:pt-32 = สำหรับจอใหญ่ (ให้ห่างเยอะหน่อย)
    <section id="journey" className="pt-20 pb-12 lg:pt-32 lg:pb-24">
      <div className="container mx-auto px-4">
        <AnimatedText
          text="My Journey"
          textStyles="h2 mb-[30px] text-center"
        />
        <Cards />
      </div>
    </section>
  );
};

export default Journey;