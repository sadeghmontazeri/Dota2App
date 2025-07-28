// context/HeroSelectionContext.tsx

"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { Hero, Team, DraftContextType } from "../draftTypes";

const HeroSelectionContext = createContext<DraftContextType | null>(null);

type HeroSelectionProviderProps = {
  children: ReactNode;
};

export function HeroSelectionProvider({
  children,
}: HeroSelectionProviderProps) {
  // ۱. استیت‌ها فقط یک بار تعریف می‌شوند و از sessionStorage می‌خوانند
  const [allyHeroes, setAllyHeroes] = useState<(Hero | null)[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("allyHeroes"); // کلید صحیح
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return Array(5).fill(null);
  });

  const [enemyHeroes, setEnemyHeroes] = useState<(Hero | null)[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("enemyHeroes"); // کلید صحیح
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return Array(5).fill(null);
  });

  // ۲. این useEffect ها هر بار که تیم‌ها تغییر می‌کنند، داده‌ها را ذخیره می‌کنند
  useEffect(() => {
    sessionStorage.setItem("allyHeroes", JSON.stringify(allyHeroes)); // متغیر صحیح
  }, [allyHeroes]);

  useEffect(() => {
    sessionStorage.setItem("enemyHeroes", JSON.stringify(enemyHeroes)); // متغیر صحیح
  }, [enemyHeroes]);

  // --- بقیه استیت‌ها و توابع شما ---
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [activeTeam, setActiveTeam] = useState<Team>("enemy");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggest, setSuggest] = useState(false);

  const handleHeroSelect = (hero: Hero) => {
    const isAlreadyPicked =
      allyHeroes.some((pickedHero) => pickedHero?.id === hero.id) ||
      enemyHeroes.some((pickedHero) => pickedHero?.id === hero.id);

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
    const setTeamHeroes = team === "enemy" ? setEnemyHeroes : setAllyHeroes;
    const currentTeamHeroes = team === "enemy" ? enemyHeroes : allyHeroes;
    const newTeamHeroes = [...currentTeamHeroes];
    newTeamHeroes[slotIndex] = null;
    setTeamHeroes(newTeamHeroes);
  };

  const resetDraft = () => {
    setAllyHeroes(Array(5).fill(null));
    setEnemyHeroes(Array(5).fill(null));
    setSelectedHero(null);
  };

  const value: DraftContextType = {
    allyHeroes,
    enemyHeroes,
    selectedHero,
    activeTeam,
    searchQuery,
    suggest,
    handleHeroSelect,
    setActiveTeam,
    clearHeroSlot,
    resetDraft,
    setSearchQuery,
    setSuggest,
  };

  return (
    <HeroSelectionContext.Provider value={value}>
      {children}
    </HeroSelectionContext.Provider>
  );
}

export const useHeroSelection = () => {
  const context = useContext(HeroSelectionContext);
  if (!context) {
    throw new Error(
      "useHeroSelection must be used within a HeroSelectionProvider"
    );
  }
  return context;
};
