// app/heroes/page.tsx

// ❌ مطمئن شوید که "use client" در این فایل وجود ندارد
import HeroesClientPage from "@/components/HeroesClientPage"; // این کامپوننت را ایمپورت کنید

type Hero = {
  id: number;
  name: string;
  localized_name: string;
};

async function getAllHeroes(): Promise<Hero[]> {
  try {
    const response = await fetch("https://api.opendota.com/api/heroes", {
      cache: "force-cache",
    });
    if (!response.ok) throw new Error("Failed to fetch heroes");
    return response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// این یک سرور کامپوننت باقی می‌ماند
export default async function HeroesPage() {
  const heroesData = await getAllHeroes();

  // تمام دیتا را به یک کلاینت کامپوننت واحد پاس بدهید
  return <HeroesClientPage initialHeroes={heroesData} />;
}
