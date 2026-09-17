import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
export const metadata: Metadata = { title: { default: "Lumen — Histórias visuais", template: "%s | Lumen" }, description: "Um acervo visual do Estúdio Lumen.", metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="pt-BR"><body className={`${inter.variable} ${playfair.variable} font-sans grain`}>{children}</body></html>; }
