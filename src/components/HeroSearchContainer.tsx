"use client";

import { useMemo } from "react";
import HeroList from "./heroList";
import Fuse, { type IFuseOptions } from "fuse.js";
import { useHeroSelection } from "./context/heroSelectionContext";
import type { Hero } from "@/components/draftTypes"; // ۱. وارد کردن نوع اصلی Hero

// یک نوع جدید تعریف می‌کنیم که فیلد حروف اول را هم داشته باشد
type HeroWithInitials = Hero & {
  initials?: string;
};

type Props = {
  initialHeroes: Hero[];
};

export default function HeroSearchContainer({ initialHeroes }: Props) {
  const { searchQuery } = useHeroSelection(); // ✅

  const heroesWithInitials: HeroWithInitials[] = useMemo(() => {
    if (!Array.isArray(initialHeroes)) return [];
    return initialHeroes.map((hero) => {
      const words = hero.localized_name.split(/[\s\-_/]+/);
      const initials =
        words.length > 1 ? words.map((w) => w[0]).join("") : undefined;
      console.log(hero.localized_name, "=>", initials);

      return {
        ...hero,
        initials: initials,
      };
    });
  }, [initialHeroes]);

  const fuse = useMemo(() => {
    const options: IFuseOptions<HeroWithInitials> = {
      // ✅ ۲. به Fuse می‌گوییم در نام و حروف اول جستجو کند
      // ما به حروف اول وزن بیشتری می‌دهیم تا در اولویت باشند
      keys: [
        { name: "localized_name", weight: 0.7 },
        { name: "initials", weight: 0.3 },
      ],
      threshold: 0,
      includeScore: true,
    };
    // از داده‌های آماده شده استفاده می‌کنیم
    return new Fuse(heroesWithInitials, options);
  }, [heroesWithInitials]);

  const filteredHeroes = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : heroesWithInitials; // نمایش لیست اولیه با حروف اول

  return (
    <div>
      <div className="h-[60%]">
        <HeroList heroes={filteredHeroes} />
      </div>
    </div>
  );
}
