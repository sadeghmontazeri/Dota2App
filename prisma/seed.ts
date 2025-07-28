// prisma/seed.ts

import { PrismaClient, MatchupType } from "@prisma/client";
import matchupData from "./counterData.json";
import heroesData from "./data_heroes.json";

const prisma = new PrismaClient();

// تعریف تایپ‌ها برای اطمینان از صحت داده‌ها
type DotaHero = { id: number; name: string; localized_name: string };
type MatchupJsonData = {
  [heroName: string]: {
    id: string;
    BadAgainst: { [relatedHeroName: string]: number };
    GoodAgainst: { [relatedHeroName: string]: number };
    GoodWith?: { [relatedHeroName: string]: number };
  };
};

// این تابع نام‌ها را به یک فرمت یکسان تبدیل می‌کند
function standardizeName(name: string): string {
  return name.toLowerCase().replace(/[\s-_']+/g, "");
}

// فقط یک تابع main وجود دارد
async function main() {
  console.log(`--- شروع فرآیند Seed ---`);

  console.log(`[SEED] 🗑️ در حال پاک کردن داده‌های قدیمی...`);
  await prisma.matchup.deleteMany({});
  await prisma.hero.deleteMany({});
  console.log(`[SEED] ✅ داده‌های قدیمی پاک شدند.`);

  try {
    // ۱. ساخت هیروها
    const heroesToCreate = (heroesData as DotaHero[]).map((hero) => ({
      dotaId: hero.id, // ✅ اطمینان از وجود dotaId
      name: hero.name.replace("npc_dota_hero_", ""),
      localized_name: hero.localized_name,
    }));
    await prisma.hero.createMany({ data: heroesToCreate });
    console.log(`[SEED] ✅ ${heroesToCreate.length} هیرو در دیتابیس ساخته شد.`);

    // ۲. ساخت Map برای پیدا کردن سریع ID ها
    const allHeroes = await prisma.hero.findMany();
    const heroMap = new Map(
      allHeroes.map((h) => [standardizeName(h.localized_name), h.id])
    );
    console.log(
      `[SEED] ✅ Map برای ${allHeroes.length} هیرو با نام‌های استاندارد ساخته شد.`
    );

    // ۳. آماده‌سازی داده‌های روابط
    const matchupsToCreate = [];
    const typedMatchupData: MatchupJsonData = matchupData;

    for (const heroKey in typedMatchupData) {
      const heroId = heroMap.get(standardizeName(heroKey));
      if (!heroId) {
        console.warn(`هشدار: ID برای هیروی اصلی ${heroKey} پیدا نشد.`);
        continue;
      }

      const categories: (keyof (typeof typedMatchupData)[string])[] = [
        "BadAgainst",
        "GoodAgainst",
        "GoodWith",
      ];

      for (const category of categories) {
        if (typedMatchupData[heroKey][category]) {
          let type: MatchupType;
          if (category === "BadAgainst") type = MatchupType.BAD_AGAINST;
          else if (category === "GoodAgainst") type = MatchupType.GOOD_AGAINST;
          else if (category === "GoodWith") type = MatchupType.GOOD_WITH;
          else continue;

          for (const relatedHeroKey in typedMatchupData[heroKey][category]) {
            const relatedHeroId = heroMap.get(standardizeName(relatedHeroKey));
            const advantage =
              typedMatchupData[heroKey][category][relatedHeroKey];

            if (heroId && relatedHeroId && !isNaN(advantage)) {
              matchupsToCreate.push({ heroId, relatedHeroId, type, advantage });
            } else if (!relatedHeroId) {
              console.warn(
                `هشدار: ID برای هیروی مرتبط ${relatedHeroKey} (برای ${heroKey}) پیدا نشد.`
              );
            }
          }
        }
      }
    }
    console.log(
      `[SEED] ✅ ${matchupsToCreate.length} رابطه برای ساخت آماده شد.`
    );

    // ۴. ساخت روابط
    if (matchupsToCreate.length > 0) {
      await prisma.matchup.createMany({ data: matchupsToCreate });
      console.log(
        `[SEED] ✅ ${matchupsToCreate.length} رابطه با موفقیت ساخته شد.`
      );
    }
  } catch (e) {
    console.error("⛔ یک خطای جدی در حین اجرای اسکریپت Seed رخ داد:", e);
    process.exit(1);
  }
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
