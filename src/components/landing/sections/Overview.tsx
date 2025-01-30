"use client";

import { motion } from "framer-motion";
import { EqualSquareIcon, ShieldCheckIcon, TimerIcon } from "lucide-react";

const Overview = () => {
  return (
    <section className="bg-white/50 rounded-2xl p-8 ">
      <motion.div>
        <p className="sm:text-[18px] text-[14px] text-landingsecondary uppercase tracking-wider">
          Transactional
        </p>
        <div className="grid grid-cols-1 text-landingsecondary lg:grid-cols-2">
          <h2
            className={
              "md:text-[60px] sm:text-[50px] font-bold xs:text-[40px] text-[30px]"
            }
          >
            Features.
          </h2>
        </div>
        <p className="md:text-[18px] text-landingsecondary sm:text-[16px] xs:text-[14px]">
          Organize events and manage tickets easily using our user-friendly{" "}
          <br />
          interface crafted to assist event organizers and ticket sellers to
          seamlessly manage their events.
        </p>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 mb-2">
        <div className="shadow-md p-6 rounded-lg flex flex-col">
          <div className="mb-4">
            <ShieldCheckIcon className="w-16 h-16 text-landingprimary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-landingsecondary">
            Secure Payments
          </h2>
          <p className="text-lg text-gray-600">
            Umoja Tickets uses trusted and secure payment gateways to ensure all
            your transactions are protected with the highest security standards.
          </p>
        </div>

        <div className="shadow-md p-6 rounded-lg flex flex-col">
          <div className="mb-4">
            <EqualSquareIcon className="w-16 h-16 text-landingprimary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-landingsecondary">
            Easy Payment Methods
          </h2>
          <p className="text-lg text-gray-600">
            We offer a variety of payment options, making it easy for you to
            securely complete your ticket purchase.
          </p>
        </div>

        <div className="p-6 rounded-lg flex flex-col shadow-md">
          <div className="mb-4">
            <TimerIcon className="w-16 h-16 text-landingprimary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-landingsecondary">
            Instant Payment Confirmation
          </h2>
          <p className="text-lg text-gray-600">
            Get instant confirmation of your ticket purchase, ensuring you’re
            all set for your event right away.
          </p>
        </div>
      </div>
    </section>
  );
};
export default Overview;
