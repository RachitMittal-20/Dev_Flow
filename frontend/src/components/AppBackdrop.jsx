import { motion } from "framer-motion";

const orbTransition = {
  duration: 12,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut"
};

export default function AppBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="page-grid" />
      <div className="page-grain" />
      <div className="page-spotlight" />

      <motion.div
        className="orb orb-blue left-[-8rem] top-[10vh] h-[22rem] w-[22rem]"
        animate={{ x: [0, 28, -10], y: [0, -18, 12] }}
        transition={{ ...orbTransition, delay: 0.2 }}
      />
      <motion.div
        className="orb orb-teal right-[-9rem] top-[34vh] h-[26rem] w-[26rem]"
        animate={{ x: [0, -24, 14], y: [0, 20, -12] }}
        transition={{ ...orbTransition, delay: 1.4, duration: 14 }}
      />
      <motion.div
        className="orb orb-violet bottom-[-8rem] left-[32%] h-[20rem] w-[20rem]"
        animate={{ x: [0, 18, -14], y: [0, -16, 10] }}
        transition={{ ...orbTransition, delay: 0.8, duration: 13 }}
      />
    </div>
  );
}
