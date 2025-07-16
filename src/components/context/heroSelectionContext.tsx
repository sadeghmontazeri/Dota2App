// context/HeroSelectionContext.tsx

"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { Hero, Team, DraftContextType } from "../draftTypes";

const HeroSelectionContext = createContext<DraftContextType | null>(null);

type HeroSelectionProviderProps = {
  children: ReactNode;
};

// این تابع را به طور کامل جایگزین کنید
export function HeroSelectionProvider({
  children,
}: HeroSelectionProviderProps) {
  const [suggest, setSuggest] = useState(false);
  // ۱. تعریف استیت‌ها در اینجا (بالاترین سطح)
  // این بخش باید قبل از هر تابع دیگری باشد
  const [allyHeroes, setAllyHeroes] = useState<(Hero | null)[]>(
    Array(5).fill(null)
  );
  const [enemyHeroes, setEnemyHeroes] = useState<(Hero | null)[]>(
    Array(5).fill(null)
  );
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [activeTeam, setActiveTeam] = useState<Team>("enemy");
  const [searchQuery, setSearchQuery] = useState("");
  // ۲. تعریف توابع برای کار با استیت‌ها
  const handleHeroSelect = (hero: Hero) => {
    const isAlreadyPicked =
      allyHeroes.some((pickedHero) => pickedHero?.id === hero.id) ||
      enemyHeroes.some((pickedHero) => pickedHero?.id === hero.id);

    // ۲. اگر هیرو قبلاً انتخاب شده، هیچ کاری انجام نده و از تابع خارج شو
    if (isAlreadyPicked) {
      return;
    }
    setSelectedHero(hero);
    const isEnemyTeam = activeTeam === "enemy";
    const currentTeamHeroes = isEnemyTeam ? enemyHeroes : allyHeroes;
    const setTeamHeroes = isEnemyTeam ? setEnemyHeroes : setAllyHeroes;

    const emptySlotIndex = currentTeamHeroes.findIndex((slot) => slot === null);

    if (emptySlotIndex === -1) return;

    const newTeamHeroes = [...currentTeamHeroes];
    newTeamHeroes[emptySlotIndex] = hero;
    setTeamHeroes(newTeamHeroes);
  };

  const clearHeroSlot = (team: Team, slotIndex: number) => {
    const isEnemyTeam = team === "enemy";
    const currentTeamHeroes = isEnemyTeam ? enemyHeroes : allyHeroes;
    const setTeamHeroes = isEnemyTeam ? setEnemyHeroes : setAllyHeroes;

    if (slotIndex < 0 || slotIndex >= currentTeamHeroes.length) return;

    const newTeamHeroes = [...currentTeamHeroes];
    newTeamHeroes[slotIndex] = null;
    setTeamHeroes(newTeamHeroes);
  };
  const resetDraft = () => {
    // ⚠️ مهم: به حالت اولیه برگردانید، نه یک آرایه خالی
    setAllyHeroes(Array(5).fill(null));
    setEnemyHeroes(Array(5).fill(null));
    setSelectedHero(null); // بهتر است هیروی انتخابی هم ریست شود
  };

  // ۳. آماده‌سازی مقادیری که به اشتراک گذاشته می‌شوند
  const value: DraftContextType = {
    allyHeroes,
    enemyHeroes,
    selectedHero,
    activeTeam,
    handleHeroSelect,
    setActiveTeam,
    clearHeroSlot,
    resetDraft,
    searchQuery,
    setSearchQuery,
    suggest,
    setSuggest,
  };

  // ۴. برگرداندن Provider با مقادیر آماده شده
  return (
    <HeroSelectionContext.Provider value={value}>
      {children}
    </HeroSelectionContext.Provider>
  );
}

// هوک سفارشی شما که صحیح است و نیازی به تغییر ندارد
export const useHeroSelection = () => {
  const context = useContext(HeroSelectionContext);
  if (!context) {
    throw new Error(
      "useHeroSelection must be used within a HeroSelectionProvider"
    );
  }
  return context;
};
