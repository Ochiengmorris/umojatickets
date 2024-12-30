"use client";

import { Search } from "lucide-react";
import Form from "next/form";
import { Input } from "./ui/input";

export default function SearchBar() {
  return (
    <div className="grow max-w-4xl mx-auto">
      <Form action={"/search"} className="relative flex gap-1">
        <Input
          type="text"
          name="q"
          placeholder="Search for events..."
          className="w-full pr-4 pl-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <button
          type="submit"
          className=" bg-primary text-primary-foreground shadow hover:bg-primary/90  px-4 py-1.5 rounded-lg text-sm font-semibold  transition-colors duration-200"
        >
          Search
        </button>
      </Form>
    </div>
  );
}
