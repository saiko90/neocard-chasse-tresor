import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chasse aux Trésors | NeoCard",
  description: "Un Ticket d'Or d'une valeur de 1500 CHF est dissimulé dans les montagnes valaisannes.", // J'ai amélioré ta description pour le SEO ;)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* Le tag GTM doit être à l'intérieur du body */}
        <GoogleTagManager gtmId="GTM-PJLHPWLK" />
      </body>
    </html>
  );
}