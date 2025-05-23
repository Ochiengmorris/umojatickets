"use client";

import { textVariant } from "@/constants/motion";
import { SectionWrapper } from "@/hoc";
import { motion } from "framer-motion";

const Mission = () => {
  return (
    <section className=" p-8 pt-14 bg-landingsecondary">
      <motion.div
        variants={textVariant({ delay: 0 })}
        className="flex flex-col items-center"
      >
        {/* section subheading */}
        <p className="sm:text-[18px] text-[14px] text-landingprimary uppercase tracking-wider">
          Browse events happening soon
        </p>

        {/* section heading */}
        <h2
          className={
            "md:text-[60px] text-landingwhite sm:text-[50px] xs:text-[40px] text-[30px] font-bold"
          }
        >
          Upcoming Events
        </h2>
      </motion.div>
    </section>
  );
};
export default SectionWrapper({ Component: Mission, idName: "mission" });
