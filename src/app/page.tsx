// src/app/page.tsx (نسخه نهایی و اصلاح شده)

import HeroesClientPage from "@/components/HeroesClientPage";
import type { Hero } from "@/components/draftTypes"; // ✅ ۱. نوع کامل Hero را از فایل مرکزی وارد می‌کنیم

// ❌ ۲. تعریف محلی و ناقص Hero از اینجا حذف شد

// این تابع دیتا را از API خارجی می‌خواند
async function getAllHeroes(): Promise<Hero[]> {
  try {
    const response = await fetch("https://api.opendota.com/api/heroes", {
      cache: "force-cache",
    });
    if (!response.ok) throw new Error("Failed to fetch heroes");
    // TypeScript حالا می‌داند که خروجی باید با نوع کامل Hero مطابقت داشته باشد
    return response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// این کامپوننت سرور، دیتا را fetch کرده و به کلاینت پاس می‌دهد
export default async function HeroesPage() {
  const heroesData = await getAllHeroes();

  // ✅ حالا heroesData نوع صحیح و کامل را دارد و خطایی وجود نخواهد داشت
  return <HeroesClientPage initialHeroes={heroesData} />;
}
