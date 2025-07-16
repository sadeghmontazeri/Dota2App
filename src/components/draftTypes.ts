// types/DraftTypes.ts

export type Hero = {
  id: number;
  name: string;
  localized_name: string;
};

export type Team = string | "ally" | "enemy";

export type DraftContextType = {
  // بخش ۱: داده‌های فقط-خواندنی (Read-Only Data)
  // کامپوننت‌ها این مقادیر را فقط برای نمایش استفاده می‌کنند.
  allyHeroes: (Hero | null)[];
  enemyHeroes: (Hero | null)[];
  selectedHero: Hero | null;
  activeTeam: Team;
  suggest: boolean;
  setSuggest: (query: string) => void;

  // بخش ۲: عملیات‌ها (Actions)
  // کامپوننت‌ها این توابع را برای درخواست تغییر در state فراخوانی می‌کنند.
  handleHeroSelect: (hero: Hero) => void;
  setActiveTeam: (team: Team) => void;
  setSugget: (a: string) => void;
  // یک مثال دیگر برای یک عملیات مفید که می‌توانید اضافه کنید
  clearHeroSlot: (team: Team, slotIndex: number) => void;
  resetDraft: () => void;
  searchQuery: string;
  setSearchQuery: (qeury: string) => void;
};
