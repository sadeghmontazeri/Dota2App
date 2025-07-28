import { findBestCounters, findAllyCounters } from "@/lib/actions";
import { Suspense } from "react";
import SuggestPageUI from "@/components/SuggestPageUI"; // کامپوننت UI را وارد کنید

export default async function SuggestPage({ searchParams }) {
  // ۱. داده‌ها در سرور کامپوننت آماده می‌شوند
  const enemiesParam = searchParams?.enemies;
  const enemyNames =
    typeof enemiesParam === "string" ? enemiesParam.split(",") : [];

  const alliesParam = searchParams?.allies;
  const allyNames =
    typeof alliesParam === "string" ? alliesParam.split(",") : [];

  // ۲. توابع Server Action به صورت همزمان فراخوانی می‌شوند
  // نکته: من findBestAllies را هم اضافه کردم که در کد شما نبود
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
