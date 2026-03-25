export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E1F5EE",
          500: "#1D9E75",
          700: "#0F6E56",
          900: "#04342C",
        },
        surface: { DEFAULT: "#FFFFFF", secondary: "#F8FAF9" },
      },
      fontFamily: { sans: ["DM Sans", "system-ui", "sans-serif"] },
    },
  },
};
