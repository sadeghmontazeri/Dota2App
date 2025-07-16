import { findBestCounters, findBestAllies } from "@/lib/actions";
import { Suspense } from "react";
import Image from "next/image"; // ✅ کامپوننت Image را وارد کنید

// کامپوننت جدید و async که وظیفه اصلی را انجام می‌دهد
async function SuggestionsList({
  enemyNames,
  allyNames,
}: {
  enemyNames: string[];
  allyNames: string[];
}) {
  // این تابع سنگین دریافت دیتا را انجام می‌دهد
  const [counterSuggestions, allySuggestions] = await Promise.all([
    findBestCounters(enemyNames),
    findBestAllies(allyNames), // ✅ تابع جدید را اینجا صدا بزنید
  ]);
  // اگر پیشنهادی پیدا نشد، پیام مناسب نمایش بده
  if (counterSuggestions.length === 0) {
    return (
      <p className="text-black">
        هیچ پیشنهاد مناسبی برای این ترکیب از دشمنان پیدا نشد.
      </p>
    );
  }
  return (
    <div className="flex justify-around">
      <div className="good-picks">
        <ol className="text-black  border min-w-fit overflow-y-scroll">
          {counterSuggestions.map((hero, index) => {
            // ✅ ساخت URL عکس
            const imageUrl = `http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_full.png`;
            return (
              <li
                key={hero.id}
                className="flex items-center justify-between p-1 border-b"
              >
                <div className="flex items-center ">
                  <span className=" text-gray-500">{index + 1}.</span>
                  {/* ✅ نمایش عکس */}
                  <Image
                    src={imageUrl}
                    alt={hero.name}
                    width={59}
                    height={33}
                    className="rounded"
                  />
                </div>
                <strong style={{ color: hero.score > 0 ? "green" : "red" }}>
                  {hero.score.toFixed(1)}
                </strong>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="ally-suggest">
        <ol className="text-black border min-w-fit overflow-y-scroll">
          {allySuggestions.map((hero, index) => {
            // ✅ ساخت URL عکس
            const imageUrl = `http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_full.png`;
            return (
              <li
                key={hero.id}
                className="flex items-center justify-around p-1 border-b"
              >
                <div className="flex items-center gap-2">
                  <span className=" text-gray-500">{index + 1}.</span>
                  {/* ✅ نمایش عکس */}
                  <Image
                    src={imageUrl}
                    alt={hero.name}
                    width={59}
                    height={33}
                    className="rounded"
                  />
                </div>
                <strong style={{ color: "blue" }}>
                  {hero.score.toFixed(1)}
                </strong>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

// کامپوننت اصلی صفحه که حالا سبک‌تر و سریع‌تر است
export default function SuggestPage({
  searchParams,
}: {
  searchParams: { enemies?: string; allies?: string };
}) {
  // ۱. پارامترها را با احتیاط می‌خوانیم
  const enemiesQuery = searchParams?.enemies || "";
  const enemyNames = enemiesQuery ? enemiesQuery.split(",") : [];
  const alliesQuery = searchParams?.allies || "";
  const allyNames = alliesQuery ? alliesQuery.split(",") : [];

  return (
    <div className="p-2 m-5 bg-gray-200">
      <div className="">
        {enemyNames.length > 0 ? (
          <h1>
            بهترین پیشنهادها در برابر:{" "}
            <span className="text-black">{enemyNames.join(", ")}</span>
          </h1>
        ) : (
          <h1 className="text-black">صفحه پیشنهادها</h1>
        )}
      </div>

      {/* ۲. از Suspense استفاده می‌کنیم */}
      <Suspense
        fallback={<div className="text-black">در حال محاسبه پیشنهادها...</div>}
      >
        <SuggestionsList allyNames={allyNames} enemyNames={enemyNames} />
      </Suspense>
    </div>
  );
}
