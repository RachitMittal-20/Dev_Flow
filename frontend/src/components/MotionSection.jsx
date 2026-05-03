import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const revealVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.68,
      delay,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

export default function MotionSection({
  className,
  children,
  delay = 0,
  once = true
}) {
  return (
    <motion.div
      className={cn(className)}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={revealVariants}
    >
      {children}
    </motion.div>
  );
}
