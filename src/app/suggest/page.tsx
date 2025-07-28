import { findBestCounters, findAllyCounters } from "@/lib/actions";
import { Suspense } from "react";
import SuggestPageUI from "@/components/SuggestPageUI"; // کامپوننت UI را وارد
type SuggestPageProps = {
  searchParams: Promise<{
    enemies?: string;
    allies?: string;
  }>;
};
export default async function SuggestPage({ searchParams }: SuggestPageProps) {
  // انتظار می‌رود که searchParams یک Promise باشد، پس باید آن را با await فراخوانی کنیم.
  const params = await searchParams; // صبر می‌کنیم تا داده‌ها بارگذاری شوند

  const enemiesParam = params?.enemies;
  const enemyNames = enemiesParam ? enemiesParam.split(",") : [];

  const alliesParam = params?.allies;
  const allyNames = alliesParam ? alliesParam.split(",") : [];

  const [counterSuggestions, allyCounterSuggestions] = await Promise.all([
    findBestCounters(enemyNames, allyNames),
    findAllyCounters(allyNames, enemyNames), // <-- شما اینجا findAllyCounters را گذاشته بودید
  ]);

  const enemyDisplayNames = enemyNames
    .map((name) =>
      name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(", ");

  const allyDisplayNames = allyNames
    .map((name) =>
      name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(", ");
  // ۳. تمام داده‌های آماده شده به کلاینت کامپوننت پاس داده می‌شوند
  return (
    <Suspense
      fallback={
        <div className="text-center p-10">در حال محاسبه پیشنهادها...</div>
      }
    >
      <SuggestPageUI
        enemyDisplayNames={enemyDisplayNames}
        allyDisplayNames={allyDisplayNames}
        counterSuggestions={counterSuggestions}
        allyCounterSuggestions={allyCounterSuggestions}
      />
    </Suspense>
  );
}
