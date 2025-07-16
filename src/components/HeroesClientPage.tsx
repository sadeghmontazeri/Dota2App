// src/components/HeroesClientPage.tsx (نسخه نهایی و اصلاح شده)
"use client";

import { HeroSelectionProvider } from "@/components/context/heroSelectionContext";
import Header from "./header";
import HeroSearchContainer from "./HeroSearchContainer";
import type { Hero } from "@/components/draftTypes"; // ✅ ۱. نوع Hero را از فایل مرکزی وارد می‌کنیم

// ✅ ۲. نوع پراپ‌ها را به صورت واضح تعریف می‌کنیم
type HeroesClientPageProps = {
  initialHeroes: Hero[];
};

export default function HeroesClientPage({
  initialHeroes,
}: HeroesClientPageProps) {
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
