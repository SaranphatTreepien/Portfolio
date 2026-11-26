"use client";
import { MotionConfig } from "framer-motion";
// components
import Hero from "@/components/Hero";
import Latest from "@/components/Latest";
import Credentials from "@/components/Credentials";
import AboutModal from "@/components/AboutModal";
import Journey from "@/components/Journey";
import Work from "@/components/Work/Work";
import LiveProject from "@/components/LiveProject";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HashScroll from "@/components/site/HashScroll";

// Order: who I am → what's new → proof (badges) → best work → experience → the rest
const Home = () => (
  <MotionConfig reducedMotion="user">
    <HashScroll />
    <Hero />
    <Latest />
    <Credentials />
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
