// فایل: prisma/seed.ts (نسخه نهایی با مپ استاندارد)
import { PrismaClient, MatchupType } from "@prisma/client";
import matchupData from "./counterData.json";
import heroesData from "./data_heroes.json";

const prisma = new PrismaClient();

type DotaHero = { id: number; name: string; localized_name: string };
type MatchupJsonData = {
  [heroName: string]: {
    [category: string]: { [relatedHeroName: string]: string };
  };
};

// این تابع نام‌ها را به یک فرمت یکسان تبدیل می‌کند
function standardizeName(name: string): string {
  // "Anti-Mage" -> "antimage"
  // "Wraith King" -> "wraithking"
  return name.toLowerCase().replace(/[\s-_']+/g, "");
}

async function main() {
  console.log(`--- شروع فرآیند Seed ---`);

  try {
    // ۱. ساخت هیروها (این بخش صحیح بود)
    const heroesToCreate = (heroesData as DotaHero[]).map((hero) => ({
      name: hero.name.replace("npc_dota_hero_", ""),
      localized_name: hero.localized_name,
    }));
    await prisma.hero.createMany({ data: heroesToCreate });
    console.log(`[SEED] ✅ ${heroesToCreate.length} هیرو در دیتابیس ساخته شد.`);

    // ۲. ✅ ساخت Map با استفاده از نام‌های استاندارد شده
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
      // ✅ نام هیروی اصلی را قبل از جستجو در Map، استاندارد می‌کنیم
      const heroId = heroMap.get(standardizeName(heroKey));
      if (!heroId) {
        console.log(`هشدار: ID برای هیروی اصلی ${heroKey} پیدا نشد.`);
        continue;
      }

      for (const category in typedMatchupData[heroKey]) {
        let type: MatchupType;
        if (category === "BadAgainst") type = MatchupType.BAD_AGAINST;
        else if (category === "GoodAgainst") type = MatchupType.GOOD_AGAINST;
        else if (category === "GoodWith") type = MatchupType.GOOD_WITH;
        else continue;

        for (const relatedHeroKey in typedMatchupData[heroKey][category]) {
          // ✅ نام هیروی مرتبط را هم قبل از جستجو، استاندارد می‌کنیم
          const relatedHeroId = heroMap.get(standardizeName(relatedHeroKey));
          const advantage = parseFloat(
            typedMatchupData[heroKey][category][relatedHeroKey]
          );
          if (heroId && relatedHeroId && !isNaN(advantage)) {
            matchupsToCreate.push({ heroId, relatedHeroId, type, advantage });
          } else {
            console.log(
              `هشدار: ID برای هیروی مرتبط ${relatedHeroKey} پیدا نشد.`
            );
          }
        }
      }
    }
    console.log(
      `[SEED] ✅ ${matchupsToCreate.length} رابطه برای ساخت آماده شد.`
    );

    // ۴. ساخت روابط
    await prisma.matchup.createMany({ data: matchupsToCreate });
    console.log(
      `[SEED] ✅ ${matchupsToCreate.length} رابطه با موفقیت ساخته شد.`
    );
  } catch (e) {
    console.error("⛔ یک خطای جدی در حین اجرای اسکریپت Seed رخ داد:", e);
    process.exit(1);
  }
}

main().finally(async () => await prisma.$disconnect());
