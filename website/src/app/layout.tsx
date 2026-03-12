import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IGJ - Inspecção-Geral de Jogos",
  description: "Entidade Reguladora de Jogos e Apostas de Cabo Verde. Regulação e Supervisão para Casinos, Jogos de Fortuna ou Azar.",
  keywords: "IGJ, Inspecção-Geral de Jogos, Cabo Verde, Regulação, Jogos, Casino",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
