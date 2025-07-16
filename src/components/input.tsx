"use client";

import { useState, useRef } from "react";
import { useHeroSelection } from "@/components/context/heroSelectionContext"; // فرض می‌کنیم کانتکست شما اینجاست

export default function SearchInput() {
  const { setSearchQuery } = useHeroSelection();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null); // برای دسترسی مستقیم به اینپوت (جهت focus/blur)

  // ۲. تابع setSearchQuery را از کانتکست سراسری می‌گیریم

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query); // استیت محلی را آپدیت می‌کنیم
    setSearchQuery(query); // استیت سراسری را هم برای فیلتر کردن آپدیت می‌کنیم
  };

  const handleCancelClick = () => {
    setInputValue(""); // مقدار اینپوت را پاک کن
    setSearchQuery(""); // جستجوی سراسری را هم پاک کن
    inputRef.current?.blur(); // فوکوس را از روی اینپوت بردار
  };

  return (
    <div className="flex w-full items-center gap-2 p-2">
      {/* ۳. اینپوت ما که حالا هوشمند است */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Search your hero..."
        value={inputValue}
        onChange={handleInputChange}
        className="flex-grow bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-amber-400"
      />

      {/* ۴. دکمه کنسل فقط زمانی نمایش داده می‌شود که متنی در اینپوت وجود داشته باشد */}
      {inputValue.length > 0 && (
        <button
          onClick={handleCancelClick}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
