export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F0FDFF",
          100: "#CFFAFE",
          500: "#22D3EE", // Cyan - New Primary
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
        },
        secondary: {
          500: "#4AC389",
        },
        midnight: "#0A0637", // New Dark Section Background
        slate: {
          900: "#111827",
          800: "#1F2937",
          600: "#4B5563",
          300: "#D1D5DB",
          200: "#E5E7EB",
        },
        surface: { DEFAULT: "#FFFFFF", secondary: "#F8FAF9" },
      },
      fontFamily: { sans: ["DM Sans", "system-ui", "sans-serif"] },
    },
  },
};
