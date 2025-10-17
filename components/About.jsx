import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";

const About = () => {
  return (
    <section className="relative pt-12 pb-24" id="About">
      <div className="container mx-auto h-full">
        <div className="h-full flex items-center justify-center">
          {/* image + shapes*/}
          <div className="hidden xl:flex flex-1 pl-8">
            <div className="relative w-full max-w-[380px]">
              {/* shape */}
              <div className="w-[160px] h-[160px] bg-accent absolute -left-5 -top-5 -z-10"></div>

              {/* image */}
              <div
                className="rounded-tl-[8px] rounded-tr-[120px] w-full bg-[#e5f8f6]
              min-h-[480px] flex items-center justify-center"
              >
                <Image
                  src="/assets/about/dev3.png"
                  width={350}
                  height={478}
                  quality={100}
                  priority
                  alt=""
                />
              </div>
              {/* rotating sharp */}
              {/* <div className="absolute top-2/4 -right-[65px] flex items-center justify-center">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 10,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  <Image
                    src="/assets/about/shape-1.svg"
                    width={160}
                    height={160}
                    alt=""
                  />
                </motion.div>
                <div className="absolute text-center text-white">
                  <div className="text-5xl font-bold leading-none"> 10+ </div>
                  <div className="leadding-none text-center">
                    Years of <br />
                    Experience
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          {/* text */}
          <div
            className="text-center xl:text-left w-full xl:w-[50%] mx-auto xl:mx-0
          flex flex-col gap-6"
          >
            <div>
              <AnimatedText text="My Name is Max" textStyles="h2 mb-2" />
              <p className="text-lg">B.Eng., Computer Engineering</p>
            </div>
            <p className="max-w-[680px] mx-auto xl:mx-0 mb-2">
               I am passionate about working with networks because managing servers and connecting devices such as switches, routers, and APs gives me satisfaction and motivates me to improve. I have learned programming to control network devices and understand how systems communicate. I also have experience using AI with cameras to detect objects, vehicles, and people, applying it for PPE and construction safety. In addition, I have explored IoT protocols such as I2C, RS232, and RS485, using MQTT and HTTP, as well as assembling and working with hardware chips. I enjoy working with data by cleaning, analyzing, 
             and performing basic risk assessments, combining it with AI and IoT projects to create practical and intelligent solutions
            </p>
            {/* info items */}
            <div className="flex flex-col lg:flex-row gap-8 
            xl:gap-12 max-w-max mx-auto xl:mx-0 items-center">
              {/* item 1 */}
              {/* <div className="max-w-max">
                <div className="uppercase font-bold text-primary">Age</div>
                <p  className="whitespace-nowrap">25 Years</p>
              </div> */}
               {/* item 2 */}
              {/* <div className="max-w-max">
                <div className="uppercase font-bold text-primary">Born In</div>
                <p>Rayong,BangKok</p>
              </div> */}
                {/* item 3 */}
              <div className="max-w-max">
                <div className="uppercase font-bold text-primary">Phone</div>
                <p>+66614461930</p>
              </div>
                   {/* item 4 */}
              <div className="max-w-max">
                <div className="uppercase font-bold text-primary">Email</div>
                <p>saranphat.tre289@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
