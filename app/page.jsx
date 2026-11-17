"use client";
import { useEffect } from "react";
// components
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Journey from "@/components/Journey";
import Work from "@/components/Work/Work";
import LiveProject from "@/components/LiveProject";
import Contact from "@/components/Contact";
import FixedMenu from "@/components/FixedMenu";
import Testimonial from "@/components/Testimonial";
import Footer from "@/components/Footer";

const Home = () => {
  //implement locomotive scroll

  return (
    <>
      <Hero />
      <FixedMenu />
      <LiveProject />
      {/* <Services /> */}
      {/* --- แก้ไขจุดนี้ครับ --- */}
      <section id="Experience">
        <Work />
      </section>
      {/* -------------------- */}
      <Journey />
      <About />
      {/* <Testimonial /> */}
      <Contact />
      <Footer />
      {/* temporary div  */}
      {/* <div className="h-[3000px]"></div> */}
    </>
  );
};

export default Home;
