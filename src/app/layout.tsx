import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import AppLayout from "../components/AppLayout";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "RETRO Qatar | Gaming, Computers, Consoles & Repairs",
  description: "Doha's premium gaming store & computer customization center. Shop high-end gaming rigs, vintage consoles, parts, and get professional device repair services.",
  keywords: "Gaming, Qatar, Doha, Custom PC, Retro Consoles, PC Parts, Repair, PS5, Xbox, Nintendo, Msheireb",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="h-full bg-slate-950 text-slate-100">
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
      </body>
    </html>
  );
}
