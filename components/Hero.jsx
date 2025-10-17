"use client"; // คือ การบอก Next.js ว่าไฟล์นี้เป็น Client Component
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { Link as ScrollLink } from "react-scroll";

// components
import RotatingShape from "./RotatingShape";
import Header from "./Header";
import Stats from "./Stats/Stats";
const Hero = () => {
  return (
    <section
      className="h-[800px] relative bg-accent/10 
    xl:bg-white xl:bg-white"
      id="Home"
    >
      {/* Header */}
      <Header />
      <div className="container mx-auto h-full">
        <div
          className="relative z-20 h-full w-full xl:max-w-[768px] flex flex-col 
          items-center xl:items-start justify-center text-center xl:text-left pt-10"
        >
          <h1 className="h1 mb-2 max-w[320px] xl:max-w-none">
            <span className="text-accent"> I'm Computer</span> Engineering
            <br></br>
            <TypeAnimation
              preRenderFristString={true}
              sequence={[
                "My",
                1000,
                "My World",
                1000,
                "My World of",
                1000,
                "My World of Creations",
                2000,
              ]}
              speed={50}
              repeat={Infinity}
              wrapper="span"
              cursor={false}
              className="ml-2 xl:ml-4"
            />
          </h1>
          <p className="lead max-w-[476px] md-7">
            Delivering powerful, custom Websites that blend aesthetics with
            performance
          </p>
          <ScrollLink to="contact" smooth>
            <button className="btn btn-accent mt-8">Contact Me</button>
          </ScrollLink>
          {/* stats */}
          <Stats />
        </div>
        {/* image */}
        <div className="hidden xl:flex w-[55vw] h-[800px] absolute top-0 right-0 bg-accent">
          {/*   //! สามารถแก้ layout image ได้ที่นี่*/}
          <div className="absolute w-[558px] h-[500px] bottom-0 z-40 left-[6.5vw]">
            <Image
              src="/assets/hero/dev2.png" //! เปลี่ยนรูปภาพ Avatar ได้ที่นี่
              fill
              quality="100"
              priority
              className="object-contain"
              alt=""
            />
            {/* arrow shape */}
            <div
              className="hidden xl:flex absolute top-[-15px] left-[4vw]"
              data-scroll
              data-scroll-speed="0.05"
            >
              <Image
                src="/assets/hero/arrow.svg"
                width={160}
                height={160}
                alt=""
              />
            </div>
            {/* shape 1 */}
            <div
              className="absolute top-[200px] left-[3vw]"
              data-scroll
              data-scroll-speed="0.2"
            >
              <RotatingShape
                content={
                  <Image
                    src="assets/hero/shape-1.svg"
                    width={38}
                    height={38}
                    alt=""
                  />
                }
                direction="left"
                duration={6}
              />
            </div>
            {/* shape 2 */}
            <div
              className="absolute top-[200px] right-[2vw]"
              data-scroll
              data-scroll-speed="0.2"
            >
              <RotatingShape
                content={
                  <Image
                    src="assets/hero/shape-2.svg"
                    width={34}
                    height={34}
                    alt=""
                  />
                }
                direction="right"
                duration={5}
              />
            </div>
            {/* shape 3 */}
            <div
              className="absolute top-[0px] right-[5vw]"
              data-scroll
              data-scroll-speed="0.08"
            >
              <RotatingShape
                content={
                  <Image
                    src="assets/hero/shape-3.svg"
                    width={38}
                    height={38}
                    alt=""
                  />
                }
                direction="left"
                duration={10}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
