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
        primary: '#4AC959',
        secondary: '#E88D39',
        tertiary: '#06152B',
        quaternary: '#959595'
      }
    },
  },
  plugins: [],
};

export default config;
