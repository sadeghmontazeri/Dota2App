"use client";
import { useRouter } from "next/navigation";
import { TiDeleteOutline } from "react-icons/ti";
import { FaArrowRight } from "react-icons/fa6";
import Input from "./input";
import SectionHero from "./HeroSection";
import { useHeroSelection } from "./context/heroSelectionContext";
import { useState, useEffect } from "react";

// ✅ ۱. تابع استانداردسازی نام‌ها را به اینجا اضافه کنید
function standardizeName(name: string): string {
  // این تابع دقیقاً همان کاری را می‌کند که در seed.ts انجام دادیم
  // "npc_dota_hero_shadow_shaman" -> "shadow_shaman"
  return name.replace("npc_dota_hero_", "");
}

export default function Header() {
  const router = useRouter();
  const { resetDraft, allyHeroes, enemyHeroes } = useHeroSelection();
  const [suggest, setSuggest] = useState(false);

  const SuggestPage = () => {
    // پردازش تیم دشمن
    const pickedEnemies = enemyHeroes.filter((hero) => hero !== null);
    // ✅ ۲. نام‌ها را قبل از ارسال، استاندارد می‌کنیم
    const enemyNames = pickedEnemies.map((hero) => standardizeName(hero.name));

    // پردازش تیم خودی
    const pickedAllies = allyHeroes.filter((hero) => hero !== null);
    const allyNames = pickedAllies.map((hero) => standardizeName(hero.name));

    if (enemyNames.length === 0 && allyNames.length === 0) {
      alert("لطفاً حداقل یک هیرو را انتخاب کنید.");
      return;
    }

    const params = new URLSearchParams();
    if (allyNames.length > 0) {
      params.append("allies", allyNames.join(","));
    }
    if (enemyNames.length > 0) {
      params.append("enemies", enemyNames.join(","));
    }

    // لاگ برای دیباگ: ببینیم چه چیزی در حال ارسال است
    console.log("در حال هدایت به آدرس:", `/suggest?${params.toString()}`);
    router.push(`/suggest?${params.toString()}`);
  };

  const resetAll = () => {
    resetDraft();
  };

  useEffect(() => {
    const pickedAlliesCount = allyHeroes.filter((hero) => hero !== null).length;
    const pickedEnemiesCount = enemyHeroes.filter(
      (hero) => hero !== null
    ).length;
    const totalPicked = pickedAlliesCount + pickedEnemiesCount;
    setSuggest(totalPicked >= 1);
  }, [allyHeroes, enemyHeroes]);

  return (
    <div className="parent-header flex flex-col flex-1 w-full h-full">
      <div className="header-sec-1 grid grid-cols-3 w-full flex justify-around">
        {suggest && (
          <button onClick={resetAll} className="flex justify-center">
            <span className="text-2xl">Reset</span>
            <TiDeleteOutline className="text-4xl" />
          </button>
        )}
        <h1 className="text-center text-lg font-extrabold">
          Sadegh Montazeriha
        </h1>
        {suggest && (
          <button onClick={SuggestPage} className="flex justify-center">
            <span className="text-2xl">suggest</span>
            <FaArrowRight className="text-4xl" />
          </button>
        )}
      </div>
      <div className="flex-1/4 w-full">
        <Input />
      </div>
      <div className="flex-3/4">
        <SectionHero />
      </div>
    </div>
  );
}
