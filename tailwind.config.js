const plugin = require("tailwindcss/plugin");
module.exports = {
  important: true, // تمام کلاس‌های Tailwind را !important می‌کند (غیرrecommended)
  darkMode: "class",
  content: [
    ["./src/**/*.{js,jsx,ts,tsx,html}"],
    ["./app/**/*.{js,jsx,ts,tsx,html}"],
    ["./pages/**/*.{js,jsx,ts,tsx,html}"],
  ],
  corePlugins: {
    preflight: false, // غیرفعال کردن استایل‌های پیش‌فرض Tailwind (برای جلوگیری از تداخل با Bootstrap)
  },
  theme: {
    extend: {},
    screens: {
      xs: "475px", // اضافه کردن xs
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  safelist: [
    { pattern: /rounded-\[(.*)\]/ },
    { pattern: /w-\[.+?\]/ },
    { pattern: /(p|m|gap)-\d+/ },
    { pattern: /text-(xs|sm|base|lg|xl|\d+)/ },
    { pattern: /rounded-(sm|md|lg|xl|full|\d+)/ },
    { pattern: /w-(\d+|px|rem|%|em|vh|vw|full|screen|min|max|auto|-\[.+?\])/ },
    { pattern: /h-(\d+|px|rem|%|em|vh|vw|full|screen|min|max|-\[.+?\])/ },
    { pattern: /(p|m|gap)-\[(.*)\]/ },
  ],

  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities(
        {
          ".reset-all": {
            all: "unset",
          },
        },
        {
          variants: ["responsive", "hover", "focus"], // variant‌های مورد نظر
        }
      );
    }),
    plugin(function ({ addUtilities }) {
      addUtilities(
        {
          ".reset-all": {
            all: "unset",
            margin: "0",
            padding: "0",
            border: "none",
            background: "transparent",
            color: "inherit",
            boxShadow: "none",
            textDecoration: "none",
            fontSize: "inherit",
            fontWeight: "inherit",
            fontFamily: "inherit",
            lineHeight: "inherit",
            "&:hover, &:focus, &:active": {
              color: "inherit",
              background: "transparent",
              boxShadow: "none",
              textDecoration: "none",
            },
          },
        },
        {
          variants: ["responsive", "hover", "focus", "active"],
        }
      );
    }),
  ],
};
