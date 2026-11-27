"use client";
import { MotionConfig } from "framer-motion";
// components
import Hero from "@/components/Hero";
import Credentials from "@/components/Credentials";
import AboutModal from "@/components/AboutModal";
import LiveProject from "@/components/LiveProject";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HashScroll from "@/components/site/HashScroll";

// Order: who I am → work → proof (badges) → contact. Activities and Journey have their own pages.
const Home = () => (
  <MotionConfig reducedMotion="user">
    <HashScroll />
    <Hero />
    <LiveProject />
    <Credentials />
    <AboutModal />
    <Contact />
    <Footer />
  </MotionConfig>
);

export default Home;
