"use client";
import AnimatedText from "./AnimatedText";
import Cards from "./Cards/Cards";
import { useLang } from "./LanguageProvider";

const Journey = () => {
  const { t } = useLang();
  return (
    // ✅ เพิ่ม padding-top (pt) เพื่อดันเนื้อหาลงมาไม่ให้ชนข้างบน
    // pt-20 = สำหรับจอมือถือ, lg:pt-32 = สำหรับจอใหญ่ (ให้ห่างเยอะหน่อย)
    <section id="Journey" className="pt-20 pb-12 lg:pt-32 lg:pb-24">
      <div className="container mx-auto px-4">
        <AnimatedText
          text={t("journey.title")}
          textStyles="h2 mb-[30px] text-center"
        />
        <Cards />
      </div>
    </section>
  );
};

export default Journey;