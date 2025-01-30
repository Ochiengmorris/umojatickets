"use client";

import { Input } from "@/components/ui/input";
import image1 from "@/images/landing_card_event.png";
import image2 from "@/images/landing_ticket.png";
import mike from "@/images/mike.png";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const Hero = () => {
  const [eventName, setEventName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Your logic to search events goes here
  };
  return (
    <section className="mb-24">
      <div className=" px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 md:grid-cols-2 gap-1">
        <div className="">
          <h1 className=" text-4xl xl:text-6xl text-landingsecondary font-extrabold mb-4">
            Unlock Seamless Event Experiences with Umoja Tickets
          </h1>
          <p className=" text-2xl xl:text-3xl text-landingsecondary/80 mb-4">
            Effortlessly book and create events all in one place.
          </p>
          <p className=" text-base text-landingsecondary/80">
            {" "}
            Take your events to the next level with Umoja Tickets— the ultimate
            solution for stress-free ticketing and unforgettable experiences.
          </p>

          <div className="mt-4 py-2 px-2 xl:px-4 gap-1 flex sm:flex-col md:flex-row items-center">
            <Input
              name="eventName"
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Search for events"
              className="px-4 py-6 w-full"
            />
            <button
              onClick={handleSubmit}
              className="whitespace-nowrap text-sm px-4 py-4 rounded-lg text-white bg-landingprimary hover:bg-landingprimary/80 transition duration-300"
            >
              Search Events
            </button>
          </div>

          <div className="mt-8 text-landingsecondary flex justify-center gap-4 xl:gap-8">
            {["Mpesa", "Coinbase", "InstaCart"].map((item) => (
              <p key={`item-${item}`} className="font-[1000] text-4xl">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="border p-2 relative bg-black rounded-xl">
          <div className="w-fit h-full rounded-4xl overflow-hidden">
            <Image src={image1} alt="event image" className="object-contain" />
          </div>
          <div className="absolute top-2/3 left-1/2 hidden lg:block  rounded-2xl overflow-hidden">
            <Image src={image2} alt="event image" className="object-contain" />
          </div>
        </div>
      </div>

      <div className="mt-2 border-l px-4 p-6 border-landingsecondary/10 w-full md:w-3/5">
        <motion.div
          transition={{
            repeat: Infinity, // Keep repeating the animation infinitely
            repeatType: "mirror", // To make the animation reverse direction when reaching the end
            duration: 10, // Duration of one full cycle (adjust as needed)
            ease: "easeInOut", // Smooth easing effect
          }}
          animate={{ x: [0, "60%"] }}
          className=""
        >
          <Image
            src={mike}
            alt="event image"
            className="object-contain w-[150px]"
            priority={true}
          />
        </motion.div>
      </div>
    </section>
  );
};
export default Hero;
