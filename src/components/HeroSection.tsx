"use client";

import Image from "next/image";
import { useHeroSelection } from "./context/heroSelectionContext";

export default function SectionHero() {
  // ۱. لیست هیروهای دو تیم را از کانتکست دریافت می‌کنیم
  const { enemyHeroes, allyHeroes, setActiveTeam, clearHeroSlot } =
    useHeroSelection();
  const changeTeamEnemy = () => {
    setActiveTeam("enemy");
  };
  const changeTeamAlly = () => {
    setActiveTeam("ally");
  };

  return (
    <div className="h-full p-0 me-2 flex flex-col justify-center items-center  parent-section">
      {/* بخش هیروهای دشمن */}
      <div
        onClick={() => {
          changeTeamEnemy();
        }}
        className="grid flex justify-center items-center h-fit grid-cols-5 "
      >
        {enemyHeroes.map((hero, index) => {
          // ۲. برای هر اسلات چک می‌کنیم: اگر هیرو وجود داشت، عکسش را نمایش بده
          if (hero) {
            const heroShortName = hero.name.replace("npc_dota_hero_", "");
            const imageUrl = `http://cdn.dota2.com/apps/dota2/images/heroes/${heroShortName}_full.png`;
            return (
              <div
                onClick={() => {
                  clearHeroSlot("enemy", index);
                }}
                key={`enemy-${hero.id}-${index}`}
                className="border w-[80px] h-fit border-0"
              >
                <Image
                  src={imageUrl}
                  alt={hero.localized_name}
                  width={50}
                  height={38}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            );
          }
          // ۳. اگر هیرو وجود نداشت (null بود)، همان باکس خالی را نمایش بده
          return (
            <span
              key={`enemy-empty-${index}`}
              className="border  w-[80px] h-[58px] border-gray-100 rounded bg-gray-400 me-2  rounded"
            ></span>
          );
        })}
      </div>

      {/* بخش هیروهای خودی */}
      <div
        onClick={() => {
          changeTeamAlly();
        }}
        className="grid mt-5 flex justify-center items-center   h-fit grid-cols-5 "
      >
        {allyHeroes.map((hero, index) => {
          // همین منطق برای تیم خودی هم تکرار می‌شود
          if (hero) {
            const heroShortName = hero.name.replace("npc_dota_hero_", "");
            const imageUrl = `http://cdn.dota2.com/apps/dota2/images/heroes/${heroShortName}_full.png`;
            return (
              <div
                onClick={() => {
                  clearHeroSlot("ally", index);
                }}
                key={`ally-${hero.id}-${index}`}
                className="   w-[80px] h-fit rounded"
              >
                <Image
                  src={imageUrl}
                  alt={hero.localized_name}
                  width={100}
                  height={56}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            );
          }
          return (
            <span
              key={`ally-empty-${index}`}
              className="border  w-[80px] h-[58px] border-gray-100 rounded me-2  bg-gray-400  "
            ></span>
          );
        })}
      </div>
    </div>
  );
}
