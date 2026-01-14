import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AI 身心靈顧問 | 東西方智慧融合平台",
  description: "融合塔羅、八字、人類圖、占星、紫微的 AI 智慧命理平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-zinc-600 antialiased`}>
        {children}
      </body>
    </html>
  );
}
