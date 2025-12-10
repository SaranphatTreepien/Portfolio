import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedText from "../AnimatedText";
import WorkItem from "./WorkItem";
import { projects as data } from "@/lib/projectsData";

const Work = () => {
  // 1. Extract unique categories
  const uniqueCategories = Array.from(
    new Set(data.map((item) => item.category))
  );

  const tabData = [
    { category: "all" },
    ...uniqueCategories.map((category) => ({ category })),
  ];

  const [tabValue, setTabValue] = useState("all");
  const [visibleItems, setVisibleItems] = useState(6);

  // 2. Filter Logic
  const filterWork =
    tabValue === "all"
      ? data
      : data.filter((item) => item.category === tabValue);

  // 3. Handle Tab Change (รวม Logic การเปลี่ยน Tab และ Reset visible items ไว้ด้วยกัน)
  const handleTabChange = (value) => {
    setTabValue(value);
    setVisibleItems(6); // ✅ Reset จำนวนที่แสดงกลับมาเป็นค่าเริ่มต้นเมื่อเปลี่ยนหมวด
  };

  const loadMoreItems = () => {
    setVisibleItems((prev) => prev + 2);
  };

  return (
    <section className="pt-24 min-h-[1000px]" id="work">
      <div className="container mx-auto">
        {/* ✅ ย้ายการควบคุม Value มาที่ Root Component เพื่อความแม่นยำ */}
        <Tabs 
          value={tabValue} 
          onValueChange={handleTabChange} 
          className="w-full flex flex-col"
        >
          <div className="flex flex-col xl:flex-row items-center xl:items-start xl:justify-between mb-[30px]">
            <AnimatedText
              text="My Learning"
              textStyles="h2 mb-[30px] xl:mb-0"
            />
            <TabsList className="max-w-max h-full mb-[30px] flex flex-col md:flex-row gap-4 md:gap-0">
              {tabData.map((item, index) => {
                return (
                  <TabsTrigger
                    value={item.category}
                    key={index}
                    className="capitalize w-[120px]"
                  >
                    {item.category}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <TabsContent value={tabValue} className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
              {/* ✅ mode="popLayout" ช่วยให้การ์ดเก่าหายไป แล้วการ์ดใหม่ไหลเข้ามาแทนที่อย่างสวยงาม */}
              <AnimatePresence mode="popLayout">
                {filterWork.slice(0, visibleItems).map((item) => (
                  <motion.div
                    layout // ✅ ทำให้เกิด Animation การจัดเรียงตำแหน่ง (Reordering)
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }} // ✅ ลูกเล่นยกการ์ดขึ้นเล็กน้อยตอน Hover
                    // ⚠️ สำคัญ: ต้องใช้ Unique ID (เช่น slug หรือ id) ห้ามใช้ index เด็ดขาด ไม่งั้น Animation จะเพี้ยน
                    key={item.slug || item.id || item.title} 
                  >
                    <WorkItem {...item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {visibleItems < filterWork.length && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={loadMoreItems} 
                  className="btn btn-accent transition-transform active:scale-95"
                >
                  Load more
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Work;