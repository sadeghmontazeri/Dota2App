// فایل: draftTypes.ts (نسخه نهایی و کامل)

import type { Dispatch, SetStateAction } from "react";
export type Hero = {
  id: number;
  name: string; // نام داخلی مانند "npc_dota_hero_antimage"
  localized_name: string; // نام نمایشی مانند "Anti-Mage"
  primary_attr: "str" | "agi" | "int" | "all";
  attack_type: "Melee" | "Ranged";
  roles: string[];
  legs: number;
};

export type Team = "ally" | "enemy"; // 'string' را حذف کردم تا دقیق‌تر باشد

export type DraftContextType = {
  // داده‌ها
  allyHeroes: (Hero | null)[];
  enemyHeroes: (Hero | null)[];
  selectedHero: Hero | null;
  activeTeam: Team;
  suggest: boolean;
  searchQuery: string;

  // توابع به‌روزرسانی (Actions)
  handleHeroSelect: (hero: Hero) => void;
  setActiveTeam: (team: Team) => void;
  clearHeroSlot: (team: Team, slotIndex: number) => void;
  resetDraft: () => void;
  setSearchQuery: (query: string) => void;
  setSuggest: Dispatch<SetStateAction<boolean>>; // ✅ فقط تعریف صحیح باقی مانده
};
