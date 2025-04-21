import React from "react";
import CategoryCard from "../CategoryCard";
import { Cpu, Film, Music, Palette, Trophy, Utensils } from "lucide-react";

const CategoriesSection = () => {
  const categoryIcons = {
    Music: <Music className="h-6 w-6 text-purple-600" />,
    Technology: <Cpu className="h-6 w-6 text-blue-600" />,
    "Food & Drink": <Utensils className="h-6 w-6 text-orange-600" />,
    Arts: <Palette className="h-6 w-6 text-pink-600" />,
    Sports: <Trophy className="h-6 w-6 text-green-600" />,
    Entertainment: <Film className="h-6 w-6 text-red-600" />,
  };
  return (
    <section id="categories" className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className=" text-landingsecondary sm:text-[50px] xs:text-[40px] text-[30px] font-bold">
            Browse by Category
          </h2>
          <p className="sm:text-[18px] text-[14px] text-landingprimary uppercase tracking-wider">
            Find events that match your interests and passions
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <CategoryCard
            title="Music"
            icon={categoryIcons["Music"]}
            count={42}
            color="bg-purple-100"
          />
          <CategoryCard
            title="Technology"
            icon={categoryIcons["Technology"]}
            count={35}
            color="bg-blue-100"
          />
          <CategoryCard
            title="Food & Drink"
            icon={categoryIcons["Food & Drink"]}
            count={28}
            color="bg-orange-100"
          />
          <CategoryCard
            title="Arts"
            icon={categoryIcons["Arts"]}
            count={21}
            color="bg-pink-100"
          />
          <CategoryCard
            title="Sports"
            icon={categoryIcons["Sports"]}
            count={19}
            color="bg-green-100"
          />
          <CategoryCard
            title="Entertainment"
            icon={categoryIcons["Entertainment"]}
            count={24}
            color="bg-red-100"
          />
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
