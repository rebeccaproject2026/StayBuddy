"use client";

import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes("/dashboard");

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" className="bg-white!" />
        <title>StayBuddy - Find Your Perfect Stay</title>
        <meta name="description" content="Premium rental marketplace for PG and tenant listings" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          {!isDashboard && <Navbar />}
          <main className={!isDashboard ? "pt-20" : ""}>{children}</main>
          {!isDashboard && <Footer />}
        </LanguageProvider>
      </body>
    </html>
  );
}
