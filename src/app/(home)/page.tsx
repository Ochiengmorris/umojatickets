import CategoriesSection from "@/components/landing/sections/CategoriesSection";
import Cta from "@/components/landing/sections/Cta";
import FeaturedEventsSection from "@/components/landing/sections/FeaturedEventsSection";
import Hero from "@/components/landing/sections/Hero";
import HeroSection from "@/components/landing/sections/HeroSection";
import Mission from "@/components/landing/sections/Mission";
import Overview from "@/components/landing/sections/Overview";
import Upcoming from "@/components/landing/sections/Upcoming";
import WhyUs from "@/components/landing/sections/WhyUs";

const page = () => {
  return (
    <div className="">
      {/* <Hero /> */}
      <HeroSection />
      <FeaturedEventsSection />
      <CategoriesSection />
      <Upcoming />
      {/* <Mission /> */}
      {/* <WhyUs /> */}
      {/* <Overview /> */}
      <Cta />
    </div>
  );
};
export default page;
