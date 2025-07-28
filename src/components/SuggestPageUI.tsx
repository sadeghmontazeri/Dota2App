"use client"; // این کامپوننت برای استفاده از هوک، باید کلاینت باشد
import Image from "next/image";
import { useRouter } from "next/navigation"; // useRouter را اینجا وارد می‌کنیم
import { IoReturnUpBackOutline } from "react-icons/io5";
type Hero = {
  id: number;
  name: string;
  localized_name: string;
  score: number;
};

type Props = {
  enemyDisplayNames?: string;
  allyDisplayNames?: string;
  counterSuggestions: Hero[];
  allyCounterSuggestions: Hero[];
};

// این کامپوننت تمام داده‌های آماده شده را به عنوان prop دریافت می‌کند
export default function SuggestPageUI({
  enemyDisplayNames, // ✅ پراپ جدید
  allyDisplayNames, // ✅ پراپ جدید
  counterSuggestions,
  allyCounterSuggestions, // نام متغیر را اصلاح کردم تا با کد شما هماهنگ باشد
}: Props) {
  const router = useRouter(); // هوک را در کلاینت کامپوننت فراخوانی می‌کنیم

  return (
    <div className="p-2 m-2 bg-gray-300 relative rounded-lg">
      <div className="text-black text-center mb-4">
        <h1 className="text-black text-xl">
          <button
            onClick={() => router.back()}
            className="absolute top-2 left-2 text-3xl hover:text-red-500 transition-colors"
          >
            <IoReturnUpBackOutline />
          </button>

          {enemyDisplayNames || allyDisplayNames ? (
            <div className="flex flex-col items-center">
              <span>بهترین پیشنهادها</span>
              <div>
                {enemyDisplayNames && (
                  <span>
                    Enemy : {""}
                    <span className="font-bold">{enemyDisplayNames}</span>
                  </span>
                )}
                {enemyDisplayNames && allyDisplayNames && (
                  <span className="mx-2"></span>
                )}
                <br />
                {allyDisplayNames && (
                  <span>
                    Ally : <span className="font-bold">{allyDisplayNames}</span>
                  </span>
                )}
              </div>
            </div>
          ) : (
            "صفحه پیشنهادها"
          )}
        </h1>
      </div>

      <div className="flex flex-col   [@media(min-width:350px)]:flex-row justify-around mt-20 gap-2 overflow-hidden">
        {/* بخش اول: نمایش کانترهای پیشنهادی */}
        <div className="good-picks  w-full [@media(min-width:350px)]:w-1/2">
          <h2 className="text-md h-[28px] font-bold text-black mb-2">
            ✔️ بهترین پیک‌ها (کانتر)
          </h2>
          <div className="text-black border rounded p-2 min-w-fit bg-white h-96 overflow-y-auto">
            {counterSuggestions.length === 0 ? (
              <p>هیچ پیشنهاد مناسبی پیدا نشد.</p>
            ) : (
              <ol>
                {counterSuggestions.map((hero) => (
                  <li
                    key={hero.id}
                    className="flex items-center justify-between p-1 border-b last:border-b-0"
                  >
                    <div className="flex bg-amber-200 justify-between items-center w-full gap-1">
                      <Image
                        src={`http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_full.png`}
                        alt={hero.localized_name}
                        width={59}
                        height={33}
                        className="rounded"
                        unoptimized
                      />
                      <strong className="[font-size:10px]">
                        {hero.localized_name}
                      </strong>
                      <strong
                        style={{
                          fontSize: "11px",
                          color: hero.score < 0 ? "green" : "red",
                          direction: "ltr",
                        }}
                      >
                        {(hero.score * -1).toFixed(1)}
                      </strong>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* بخش دوم: نمایش یارهای پیشنهادی */}
        <div className="ally-suggest w-full [@media(min-width:350px)]:w-1/2 ">
          <h2 className="text-lg font-bold text-black mb-2">
            🤝 یارهای پیشنهادی
          </h2>
          <div className="text-black border rounded p-2 min-w-fit bg-white h-96 overflow-y-auto">
            {allyCounterSuggestions.length === 0 ? (
              <p>هیچ پیشنهاد مناسبی پیدا نشد.</p>
            ) : (
              <ol>
                {allyCounterSuggestions.map((hero) => (
                  <li
                    key={hero.id}
                    className="flex  items-center justify-between p-1 border-b last:border-b-0"
                  >
                    <div className="flex bg-green-200 justify-between items-center w-full gap-1">
                      <Image
                        src={`http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_full.png`}
                        alt={hero.localized_name}
                        width={59}
                        height={33}
                        className="rounded"
                        unoptimized
                      />
                      <strong className="[font-size:10px]">
                        {hero.localized_name}
                      </strong>
                      <strong
                        style={{
                          fontSize: "11px",
                          color: "blue",
                          direction: "ltr",
                        }}
                      >
                        {(hero.score * -1).toFixed(1)}
                      </strong>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
