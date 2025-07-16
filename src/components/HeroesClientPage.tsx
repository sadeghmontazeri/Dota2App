// components/HeroesClientPage.tsx
"use client";

import { HeroSelectionProvider } from "@/components/context/heroSelectionContext";
import Header from "./header";
import HeroSearchContainer from "./HeroSearchContainer";

export default function HeroesClientPage({ initialHeroes }) {
  return (
    // Provider در اینجا قرار می‌گیرد تا تمام فرزندان به آن دسترسی داشته باشند
    <HeroSelectionProvider>
      <div className="flex flex-col w-full h-[100vh]">
        <div className="top-section flex flex-col w-full h-[35%]">
          {/* دیگر نیازی به پاس دادن پراپ نیست */}
          <Header />
        </div>

        <div className=" rounded-t-3xl bg-black h-[65%] overflow-y-auto">
          {/* فقط لیست اولیه هیروها پاس داده می‌شود */}
          <HeroSearchContainer initialHeroes={initialHeroes} />
        </div>
      </div>
    </HeroSelectionProvider>
  );
}
