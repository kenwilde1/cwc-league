import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';

import localFont from 'next/font/local';

import "./globals.css";

const myFont = localFont({
  src: '../../public/fonts/FifaSane_Regular.woff',
  weight: '400', // optional
  style: 'normal', // optional
});


export const metadata: Metadata = {
  title: "Club World Cup 2025 Predictor",
  description: "Just for",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={myFont.className}>
      <body
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
