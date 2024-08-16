import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | 팡호 마켓",
    default: "팡호 마켓",
  },
  description: "어떤 물건이든 사고 파세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} mx-auto h-dvh max-w-screen-md bg-neutral-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
