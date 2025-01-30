"use client";

import bank from "@/images/bank.png";
import exchange from "@/images/exchange.png";
import queue2 from "@/images/queue2.png";
import user from "@/images/user-trust.png";
import { motion } from "framer-motion";
import Image from "next/image";

const WhyUs = () => {
  return (
    <section className=" p-8 mt-14">
      <motion.div className="flex flex-col items-center">
        <p className="sm:text-[18px] text-[14px] text-landingsecondary uppercase tracking-wider">
          Why us
        </p>

        <h2
          className={
            "md:text-[60px] text-landingsecondary sm:text-[50px] xs:text-[40px] text-[30px] font-bold"
          }
        >
          Why you Should pick Us.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-landingprimary/10 rounded-xl p-6">
          <p className="text-landingprimary text-xl md:text-3xl lg:text-4xl font-[1000]">
            Refunds
          </p>
          <p className="text-lg xl:text-xl text-landingsecondary mt-6">
            Automated refunds for canceled events and tickets.
          </p>
        </div>
        <div className="bg-landingprimary/10 rounded-xl p-6">
          <p className="text-lg xl:text-xl text-landingsecondary mt-2">
            Instant Withdraw your funds at any time. (no hidden fees)
          </p>

          <div className="flex gap-8 mt-4 px-6 items-center justify-center">
            <Image
              src={user}
              alt="user"
              className="w-12 h-12 text-landingprimary"
            />
            <Image src={exchange} alt="exchange" className="w-12 h-12" />
            <Image src={bank} alt="bank" className="w-12 h-12" />
          </div>
        </div>
      </div>
      <div className="bg-landingprimary/10 rounded-xl p-6 pb-12 lg:mt-4 mt-8">
        <p className="text-landingprimary text-xl md:text-3xl lg:text-4xl font-[1000]">
          Auto Queue System
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <p className="text-lg xl:text-xl mt-6 text-landingsecondary">
            This system makes it easy for event organizers to manage their
            tickets and ensures that tickets are sold in a first-come,
            first-serve basis.
          </p>

          <div className="max-w-[400px] mx-auto">
            <Image
              src={queue2}
              alt="ticket"
              className="w-full h-full rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default WhyUs;
