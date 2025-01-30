import Cta from "@/components/landing/sections/Cta";
import Hero from "@/components/landing/sections/Hero";
import Mission from "@/components/landing/sections/Mission";
import Overview from "@/components/landing/sections/Overview";
import WhyUs from "@/components/landing/sections/WhyUs";

const page = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Hero />
      <Overview />
      <WhyUs />
      <Mission />
      <Cta />
    </div>
  );
};
export default page;
