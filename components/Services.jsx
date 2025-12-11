import { 
  FiTrendingUp, 
  FiCpu,      
  FiGlobe,    
  FiZap       
} from "react-icons/fi"; 

const services = [
  {
    icon: <FiTrendingUp className="w-10 h-10 text-[#7edad2]" />, 
    title: "Growth Mindset", 
    description:
      "I love learning and improving myself. I am hardworking, open-minded, and enjoy sharing ideas. I am always ready to travel to learn new things.",
  },
  {
    icon: <FiCpu className="w-10 h-10 text-[#7edad2]" />, 
    title: "AI & Vision", 
    // ✅ เนื้อหาใหม่: สัตว์ร้าย + YOLOv8 + Train scale
    description:
      "Built a dangerous animal detection project using YOLOv8. I experimented with training models at different scales to optimize performance.",
  },
  {
    icon: <FiGlobe className="w-10 h-10 text-[#7edad2]" />, 
    title: "Networks", 
    // ✅ เนื้อหาใหม่: ชอบพิเศษ + หาเรียนเอง + Cisco Lab
    description:
      "My current passion. I learned through NetPrime training and self-enrolled courses. I actively practice Cisco labs to master network configuration.",
  },
  {
    icon: <FiZap className="w-10 h-10 text-[#7edad2]" />, 
    title: "AIoT Integration", 
    // ✅ เนื้อหาใหม่: ESP32/IP Cam + บัดกรีวางชิป
    description:
      "Developed a detection system using ESP32-CAM and IP Cameras. I have strong hardware skills, including complex soldering and placing chips on boards.",
  },
];

const Service = () => {
  return (
    <section className="relative z-40">
      <div className="container mx-auto">
        <ul
          className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[20px] -top-12 place-items-center lg:place-items-stretch"
        >
          {services.map((service, index) => {
            return (
              <li
                key={index}
                className="group bg-white shadow-custom p-6 rounded-2xl flex flex-col items-start h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#7edad2]"
              >
                {/* Icon Section */}
                <div className="mb-4 p-4 rounded-full bg-[#7edad2]/15 group-hover:bg-[#7edad2]/25 transition-colors">
                  {service.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-[20px] text-gray-800 font-bold mb-3 group-hover:text-[#7edad2] transition-colors">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Service;