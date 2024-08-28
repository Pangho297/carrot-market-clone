import type { Metadata } from "next";
import { Roboto, Rubik_Scribble } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"], // 그리스어, 라틴어, 독일어 등 특수 언어
  weight: ["400", "500"], // 폰트의 굵기
  style: ["normal", "italic"], // 기울기
  variable: "--roboto-text", // 변수 설정
});

const rubik = Rubik_Scribble({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--rubik-text",
});

const metallica = localFont({
  src: "./metallica.ttf",
  variable: "--metallica-text",
});

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
  console.log(metallica);
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${rubik.variable} ${metallica.variable} mx-auto h-dvh max-w-screen-md bg-neutral-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
