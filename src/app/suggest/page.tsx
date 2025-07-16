import { findBestCounters, findBestAllies } from "@/lib/actions";
import { Suspense } from "react";
import Image from "next/image";

// این کامپوننت فرزند، وظیفه دریافت و نمایش داده‌ها را دارد
async function SuggestionsList({
  enemyNames,
  allyNames,
}: {
  enemyNames: string[];
  allyNames: string[];
}) {
  // ۱. هر دو درخواست به دیتابیس به صورت همزمان ارسال می‌شوند
  const [counterSuggestions, allySuggestions] = await Promise.all([
    findBestCounters(enemyNames),
    findBestAllies(allyNames),
  ]);

  return (
    <div className="flex justify-around mt-5 gap-5">
      {/* بخش اول: نمایش کانترهای پیشنهادی */}
      <div className="good-picks w-1/2">
        <h2 className="text-lg font-bold text-black mb-2">
          ✔️ بهترین پیک‌ها (کانتر)
        </h2>
        <div className="text-black border rounded p-2 min-w-fit bg-white h-96 overflow-y-auto">
          {counterSuggestions.length === 0 ? (
            <p>هیچ پیشنهاد مناسبی پیدا نشد.</p>
          ) : (
            <ol>
              {counterSuggestions.map((hero, index) => {
                // آدرس عکس با استفاده از نام داخلی ساخته می‌شود
                const imageUrl = `http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_full.png`;
                return (
                  <li
                    key={hero.id}
                    className="flex items-center justify-between p-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-gray-500">{index + 1}.</span>
                      <Image
                        src={imageUrl}
                        alt={hero.localized_name}
                        width={59}
                        height={33}
                        className="rounded"
                        unoptimized // برای جلوگیری از خطای هاست‌نیم در Vercel
                      />
                      {/* ✅ نام نمایشی به کاربر نشان داده می‌شود */}
                      <strong>{hero.localized_name}</strong>
                    </div>
                    <strong
                      style={{
                        color: hero.score > 0 ? "green" : "red",
                        direction: "ltr",
                      }}
                    >
                      {hero.score > 0 ? "+" : ""}
                      {hero.score.toFixed(1)}
                    </strong>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>

      {/* بخش دوم: نمایش یارهای پیشنهادی */}
      <div className="ally-suggest w-1/2">
        <h2 className="text-lg font-bold text-black mb-2">
          🤝 یارهای پیشنهادی
        </h2>
        <div className="text-black border rounded p-2 min-w-fit bg-white h-96 overflow-y-auto">
          {allySuggestions.length === 0 ? (
            <p>هیچ پیشنهاد مناسبی پیدا نشد.</p>
          ) : (
            <ol>
              {allySuggestions.map((hero, index) => {
                const imageUrl = `http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_full.png`;
                return (
                  <li
                    key={hero.id}
                    className="flex items-center justify-between p-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-gray-500">{index + 1}.</span>
                      <Image
                        src={imageUrl}
                        alt={hero.localized_name}
                        width={59}
                        height={33}
                        className="rounded"
                        unoptimized
                      />
                      <strong>{hero.localized_name}</strong>
                    </div>
                    <strong style={{ color: "blue", direction: "ltr" }}>
                      +{hero.score.toFixed(1)}
                    </strong>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

// این کامپوننت اصلی و والد صفحه است
export default function SuggestPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const enemiesParam = searchParams?.enemies;
  const enemyNames =
    typeof enemiesParam === "string" ? enemiesParam.split(",") : [];

  const alliesParam = searchParams?.allies;
  const allyNames =
    typeof alliesParam === "string" ? alliesParam.split(",") : [];

  // نام‌های استاندارد شده را برای نمایش به کاربر، دوباره به حالت خوانا برمی‌گردانیم
  const displayNames = [...enemyNames, ...allyNames]
    .map((name) =>
      name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(", ");

  return (
    <div className="p-4 m-5 bg-gray-200 rounded-lg">
      <div className="text-black text-center mb-4">
        {displayNames ? (
          <h1>
            بهترین پیشنهادها برای:{" "}
            <span className="font-bold">{displayNames}</span>
          </h1>
        ) : (
          <h1 className="text-black">صفحه پیشنهادها</h1>
        )}
      </div>

      <Suspense
        fallback={
          <div className="text-black text-center p-10">
            در حال محاسبه پیشنهادها...
          </div>
        }
      >
        <SuggestionsList allyNames={allyNames} enemyNames={enemyNames} />
      </Suspense>
    </div>
  );
}
