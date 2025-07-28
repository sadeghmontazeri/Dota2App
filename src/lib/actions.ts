import prisma from "@/lib/prisma";
import { MatchupType, Hero } from "@prisma/client";

function advantageToScore(advantage: number): number {
  return advantage * -1;
}
export async function findAllyCounters(
  allyNames: string[],
  enemyNames: string[]
) {
  // اگر یاری انتخاب نشده بود، لیست خالی برگردان
  if (allyNames.length === 0) return [];

  // این کوئری دقیقاً مثل findBestCounters است، فقط به جای enemyNames از allyNames استفاده می‌کند
  const allRelevantMatchups = await prisma.matchup.findMany({
    where: {
      hero: { name: { in: allyNames } }, // <-- تغییر اصلی اینجاست
      type: { in: [MatchupType.GOOD_AGAINST, MatchupType.BAD_AGAINST] },
    },
    include: { relatedHero: true },
  });

  const heroScores = new Map<
    string,
    { totalScore: number; heroObject: Hero }
  >();

  for (const matchup of allRelevantMatchups) {
    const candidateHero = matchup.relatedHero;
    const score = advantageToScore(matchup.advantage) * -1;

    if (!heroScores.has(candidateHero.name)) {
      heroScores.set(candidateHero.name, {
        totalScore: 0,
        heroObject: candidateHero,
      });
    }
    heroScores.get(candidateHero.name)!.totalScore += score;
  }

  const finalReport = Array.from(heroScores.entries())
    .map(([, data]) => ({
      ...data.heroObject,
      score: data.totalScore,
    }))
    // هیروهایی که از قبل انتخاب شده‌اند را حذف می‌کنیم
    .filter(
      (hero) =>
        !enemyNames.includes(hero.name) && !allyNames.includes(hero.name)
    )
    .sort((a, b) => b.score - a.score)
    .map((hero) => ({
      ...hero,
      score: hero.score * -1,
    }));

  return finalReport;
}

export async function findBestCounters(
  enemyNames: string[],
  allyNames: string[]
) {
  if (enemyNames.length === 0) return [];

  const allRelevantMatchups = await prisma.matchup.findMany({
    where: {
      hero: { name: { in: enemyNames } },
      type: { in: [MatchupType.GOOD_AGAINST, MatchupType.BAD_AGAINST] },
    },
    include: { relatedHero: true },
  });

  const heroScores = new Map<
    string,
    { totalScore: number; heroObject: Hero }
  >();

  for (const matchup of allRelevantMatchups) {
    const candidateHero = matchup.relatedHero;
    const score = advantageToScore(matchup.advantage);

    if (!heroScores.has(candidateHero.name)) {
      heroScores.set(candidateHero.name, {
        totalScore: 0,
        heroObject: candidateHero,
      });
    }
    heroScores.get(candidateHero.name)!.totalScore += score;
  }

  const finalReport = Array.from(heroScores.entries())
    // ✅✅✅ تغییر در اینجا: 'name' به '_' تبدیل شد ✅✅✅
    .map(([, data]) => ({
      ...data.heroObject,
      score: data.totalScore,
    }))
    .filter(
      (hero) =>
        !enemyNames.includes(hero.name) && !allyNames.includes(hero.name)
    )
    .sort((a, b) => a.score - b.score);

  return finalReport;
}

export async function findBestAllies(allyNames: string[]) {
  if (allyNames.length === 0) return [];

  const allRelevantMatchups = await prisma.matchup.findMany({
    where: {
      hero: { name: { in: allyNames } },
      type: MatchupType.GOOD_WITH,
    },
    include: { relatedHero: true },
  });

  const heroScores = new Map<
    string,
    { totalScore: number; heroObject: Hero }
  >();

  for (const matchup of allRelevantMatchups) {
    const candidateHero = matchup.relatedHero;
    const score = matchup.advantage;

    if (!heroScores.has(candidateHero.name)) {
      heroScores.set(candidateHero.name, {
        totalScore: 0,
        heroObject: candidateHero,
      });
    }
    heroScores.get(candidateHero.name)!.totalScore += score;
  }

  return (
    Array.from(heroScores.entries())
      // ✅✅✅ تغییر در اینجا: 'name' به '_' تبدیل شد ✅✅✅
      .map(([, data]) => ({
        ...data.heroObject,
        score: data.totalScore,
      }))
      .sort((a, b) => a.score - b.score)
  );
}
