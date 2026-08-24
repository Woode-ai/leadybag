import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ألوان أساسية للمتجر - يمكن تغييرها لاحقاً حسب هوية leadybag
        primary: "#B76E79", // وردي فاتح (روز غولد) يناسب متجر نسائي
        secondary: "#2D2D2D",
      },
    },
  },
  plugins: [],
};

export default config;
