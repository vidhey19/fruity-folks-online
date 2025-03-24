
import { motion } from "framer-motion";
import { pageTransition } from "../utils/animations";

interface AnimatedPageProps {
  children: React.ReactNode;
}

const AnimatedPage = ({ children }: AnimatedPageProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
