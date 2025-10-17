"use client";

import { animate, motion } from "framer-motion";
const RotatingShape = ({ content, direction, duration }) => {
  //define the rotation animation
  const rotateAnimation = {
    animate: {
    //rotate 360 dagree base on the direction
    rotate: direction === "right" ? 360 : direction === "left" ? -360 : 0,
    transition: {
      duration: duration, // duration of one full rotation
      ease: "linear", // smooth rotation
      repeat: Infinity, // repeat forever
    },
  },
};
  return (
    <motion.div variants={rotateAnimation} animate="animate">
      {content}
    </motion.div>
  );
};
export default RotatingShape;
