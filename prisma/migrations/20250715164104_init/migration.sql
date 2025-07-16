-- CreateTable
CREATE TABLE "Hero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "localized_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Matchup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "advantage" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "heroId" INTEGER NOT NULL,
    "relatedHeroId" INTEGER NOT NULL,
    CONSTRAINT "Matchup_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Matchup_relatedHeroId_fkey" FOREIGN KEY ("relatedHeroId") REFERENCES "Hero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Hero_name_key" ON "Hero"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Matchup_heroId_relatedHeroId_type_key" ON "Matchup"("heroId", "relatedHeroId", "type");
