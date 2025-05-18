import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import { Open_Sans } from 'next/font/google';
import "./globals.css";

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // add weights as needed
  display: 'swap',
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
    <html lang="en">
      <body
        className={openSans.className}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
