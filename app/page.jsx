"use client";
import { MotionConfig } from "framer-motion";
// components
import Hero from "@/components/Hero";
import Credentials from "@/components/Credentials";
import AboutModal from "@/components/AboutModal";
import Journey from "@/components/Journey";
import Work from "@/components/Work/Work";
import LiveProject from "@/components/LiveProject";
import Contact from "@/components/Contact";
import FixedMenu from "@/components/FixedMenu";
import Footer from "@/components/Footer";

// Order: who I am → proof (badges) → best work → experience → the rest
const Home = () => (
  <MotionConfig reducedMotion="user">
    <Hero />
    <Credentials />
    <FixedMenu />
    <LiveProject />
    <section id="Experience">
      <Work />
    </section>
    <Journey />
    <AboutModal />
    <Contact />
    <Footer />
  </MotionConfig>
);

export default Home;
