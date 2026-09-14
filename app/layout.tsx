import type { Metadata } from "next";
import { Archivo_Black, DM_Sans } from "next/font/google";

import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "ECO KEPHYRA",
  description: "Electric scooter rental",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${dmSans.variable}`}
    >
      <body>
        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}