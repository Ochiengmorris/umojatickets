import React, { JSX } from "react";
import CategoryCard from "../CategoryCard";
import {
  Cpu,
  Film,
  Music,
  Palette,
  Plane,
  Trophy,
  Utensils,
} from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

const categoryOptions = [
  "Music",
  "Sports",
  "Arts",
  "Food & Drink",
  "Technology",
  "Travel",
];

const CategoriesSection = async () => {
  const events = await fetchQuery(api.events.get);

  const categoryCounts = events.reduce<Record<string, number>>((acc, event) => {
    const category = event.category;
    if (category) {
      acc[category] = (acc[category] || 0) + 1;
    }
    return acc;
  }, {});

  const categoryCountsArray = categoryOptions.map((category) => ({
    category,
    count: categoryCounts[category] || 0,
  }));

  const categoryIcons: Record<string, JSX.Element> = {
    Music: <Music className="h-6 w-6 text-purple-600" />,
    Technology: <Cpu className="h-6 w-6 text-blue-600" />,
    "Food & Drink": <Utensils className="h-6 w-6 text-orange-600" />,
    Arts: <Palette className="h-6 w-6 text-pink-600" />,
    Sports: <Trophy className="h-6 w-6 text-green-600" />,
    Travel: <Plane className="h-6 w-6 text-red-600" />,
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
          {categoryCountsArray.map(({ category, count }) => (
            <CategoryCard
              key={category}
              title={category}
              icon={categoryIcons[category]}
              count={count}
              color="bg-gray-100"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
