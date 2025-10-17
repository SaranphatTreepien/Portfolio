import Image from "next/image";

const services = [
  {
    icon: "assets/services/icon-1.svg",
    title: "Mindset",
    description:
      "I enjoy working with data, practicing on Colab and Jupyter, cleaning data, analyzing it, and trying simple predictions.",
  },
  {
    icon: "assets/services/icon-2.svg",
    title: "AI",
    description:
      "I am interested in AI and have practiced using Python with YOLO to classify objects. I tried controlling commands and connecting with IP cameras for detection. I also explored datasets from Kaggle to improve my models and understand predictions.",
  },
  {
    icon: "assets/services/icon-3.svg",
    title: "Networks",
    description:
      "I learned networking basics through NetPrime training and completed over 50 labs using Cisco Packet Tracer. I gained hands-on experience with the OSI model and basic networking devices. This helped me understand how networks connect and communicate.",
  },
  {
    icon: "assets/services/icon-4.svg",
    title: "AIoT  ",  
       description: "I worked with ESP32-CAM and YOLO to detect objects and practiced hardware skills like soldering and assembling circuits. I learned to use multimeters, sensors, and vibration detectors, and to analyze and display data such as temperature and humidity. This experience helped me understand both AI integration and IoT systems."

  },
];
const Service = () => {
  return (
    <section className="relative z-40">
      <div className="container mx-auto">
        <ul
          className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4
         gap-[20px] -top-12 place-items-center lg:place-items-stretch"
        >
          {services.map((service, index) => {
            return (
              <li
                key={index}
                className="bg-white shadow-custom p-6 max-3-[350px] md:max-w-none
              rounded-lg"
              >
                <Image
                  src={service.icon}
                  width={48}
                  height={48}
                  alt=""
                  className="md-4"
                />
                <h3 className="text-[20px] text-primary font-semibold mb-3">
                  {service.title}
                </h3>
                <p className="text-[15px]">{service.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Service;
