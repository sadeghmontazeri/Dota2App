import prisma from "@/lib/prisma";
import { MatchupType, Hero } from "@prisma/client";

function advantageToScore(advantage: number): number {
  return advantage * -1;
}

export async function findBestCounters(enemyNames: string[]) {
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
    .map(([_, data]) => ({
      ...data.heroObject,
      score: data.totalScore,
    }))
    .sort((a, b) => b.score - a.score);

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
      .map(([_, data]) => ({
        ...data.heroObject,
        score: data.totalScore,
      }))
      .sort((a, b) => b.score - a.score)
  );
}
