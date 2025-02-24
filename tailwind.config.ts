import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primarys: {
          // DEFAULT: "#DF7521", 
          DEFAULT : "#6A80B9"
        },
        secondarys:{
          DEFAULT : "#4B6E8B",
        },
        adminprimary:{
          DEFAULT : '#3a5a40'
          // DEFAULT : "#889E73"
        },
      },
    },
  },
  plugins: [],
};
export default config;
