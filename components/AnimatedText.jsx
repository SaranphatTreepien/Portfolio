"use client";
import { animate, motion } from "framer-motion";

const letterAnimation = {
  initial: {
    y: "100%",
    opacity: 0,
  },
  animate: (i) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: [0.2, 0, 0.1, 1], delay: i[0] },
  }),
};
// Split into graphemes (not UTF-16 units) so Thai vowels and tone marks stay attached to their consonant.
const splitGraphemes = (text) =>
  typeof Intl !== "undefined" && Intl.Segmenter
    ? Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment)
    : Array.from(text);
const getLetter = (name) => {
  let letters = [];
  splitGraphemes(name).forEach((letter, index) => {
    return letters.push(
      <motion.span
        variants={letterAnimation}
        initial="initial"
        animate="animate"
        custom={[index * 0.015, (name.length - index) * 0.008]}
        key={index}
      >
        {letter}
      </motion.span>
    );
  });
  return letters;
};
const AnimatedText = ({text,textStyles}) => {
    // key on text so the letters animate in again when the language changes
    return <div key={text} className={`${textStyles}`}>{getLetter(text)}</div>;
};

export default AnimatedText;
