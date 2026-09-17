import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#0d0d0d", cream: "#ffffff", rust: "#ff5e36", sage: "#a1a1aa", graphite: "#171717", mist: "#a1a1aa" }, fontFamily: { sans: ["var(--font-inter)"], display: ["var(--font-playfair)"] } } },
  plugins: []
};
export default config;
