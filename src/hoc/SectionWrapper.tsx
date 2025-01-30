import { staggerContainer } from "@/constants/motion";
import { motion } from "framer-motion";

type StarWrapperProps = {
  idName: string;
  Component: React.ComponentType;
};

const StarWrapper = ({ Component, idName }: StarWrapperProps) => {
  const HOC: React.FC = () => {
    return (
      <motion.section
        variants={staggerContainer({
          staggerChildren: 0.5,
          delayChildren: 0.2,
        })}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className={`max-w-7xl mx-auto relative z-0`}
      >
        <Component />
      </motion.section>
    );
  };

  return HOC;
};

export default StarWrapper;
