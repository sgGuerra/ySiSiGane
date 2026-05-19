import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "¿Y si sí? - Lotto Elite Tracker",
  description: "Registra y administra tus boletas, rifas y loterías en un solo lugar. Plataforma premium de seguimiento de sorteos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased dark`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-[#0A0A0F] text-[#fbdbd7] relative overflow-x-hidden">
        {/* Ambient Background Glows */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-container/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>
        {children}
      </body>
    </html>
  );
}
