// checkDuplicates.js
const fs = require("fs");
const path = require("path");

// مسیر فایل JSON خود را تنظیم کنید
const heroesPath = path.join(__dirname, "./prisma/data_heroes.json");
const heroesData = JSON.parse(fs.readFileSync(heroesPath, "utf-8"));

const nameCounts = new Map();

heroesData.forEach((hero) => {
  if (hero && typeof hero.name === "string") {
    const name = hero.name.replace("npc_dota_hero_", "");
    const count = nameCounts.get(name) || 0;
    nameCounts.set(name, count + 1);
  }
});

const duplicates = [];
for (const [name, count] of nameCounts.entries()) {
  if (count > 1) {
    duplicates.push(name);
  }
}

if (duplicates.length > 0) {
  console.error(
    "⛔ نام‌های تکراری در فایل data_heroes.json پیدا شد:",
    duplicates
  );
} else {
  console.log("✅ هیچ نام تکراری در فایل JSON پیدا نشد.");
}
