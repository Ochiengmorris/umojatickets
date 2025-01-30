"use client";

import { motion } from "framer-motion";

const Mission = () => {
  return (
    <section className=" p-8 mt-14 bg-landingsecondary">
      <motion.div className="flex flex-col items-center">
        {/* section subheading */}
        <p className="sm:text-[18px] text-[14px] text-landingprimary uppercase tracking-wider">
          Our Mission
        </p>

        {/* section heading */}
        <h2
          className={
            "md:text-[60px] text-landingwhite sm:text-[50px] xs:text-[40px] text-[30px] font-bold"
          }
        >
          What Drives Us.
        </h2>
      </motion.div>
    </section>
  );
};
export default Mission;
