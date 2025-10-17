import Image from "next/image";

const services = [
  {
    icon: "assets/services/icon-1.svg",
    title: "UI UX Design",
    description:"Design complete user interfaces and engaging user experiences for websites and mobile applications.",
  },
  {
    icon: "assets/services/icon-2.svg",
    title: "Web Development",
    description:"Develop responsive and high-performance websites tailored to client needs and goals.",
  },
  {
    icon: "assets/services/icon-3.svg",
    title: "E-commerce Solutions",
    description:
      "Build and maintain online stores with seamless shopping experiences.",
  },
  {
    icon: "assets/services/icon-4.svg",
    title: "Care & Support",
    description:
      "Provide ongoing website maintenance and support to ensure optimal performance.",
  },
];
const Service = () => {
  return (
    <section className="relative z-40">
      <div className="container mx-auto">
        <ul className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4
         gap-[20px] -top-12 place-items-center lg:place-items-stretch">
          {services.map((service, index) => {
            return (
              <li key={index} className="bg-white shadow-custom p-6 max-3-[350px] md:max-w-none
              rounded-lg">
                <Image
                  src={service.icon}
                  width={48}
                  height={48}
                  alt=""
                  className="md-4"
                />
                <h3 className="text-[20px] text-primary font-semibold mb-3">{service.title}</h3>
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
