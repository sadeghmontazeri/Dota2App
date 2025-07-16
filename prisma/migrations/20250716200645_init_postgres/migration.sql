-- CreateEnum
CREATE TYPE "MatchupType" AS ENUM ('BAD_AGAINST', 'GOOD_AGAINST', 'GOOD_WITH');

-- CreateTable
CREATE TABLE "Hero" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "localized_name" TEXT NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matchup" (
    "id" SERIAL NOT NULL,
    "advantage" DOUBLE PRECISION NOT NULL,
    "type" "MatchupType" NOT NULL,
    "heroId" INTEGER NOT NULL,
    "relatedHeroId" INTEGER NOT NULL,

    CONSTRAINT "Matchup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hero_name_key" ON "Hero"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Matchup_heroId_relatedHeroId_type_key" ON "Matchup"("heroId", "relatedHeroId", "type");

-- AddForeignKey
ALTER TABLE "Matchup" ADD CONSTRAINT "Matchup_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matchup" ADD CONSTRAINT "Matchup_relatedHeroId_fkey" FOREIGN KEY ("relatedHeroId") REFERENCES "Hero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
