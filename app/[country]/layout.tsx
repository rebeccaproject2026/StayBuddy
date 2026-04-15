"use client";

import { usePathname, useParams } from "next/navigation";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import NextLink from "next/link";

const inter = Inter({ subsets: ["latin"] });

// Invisible links that trigger Next.js route prefetching on mount
function PrefetchRoutes() {
  const params = useParams();
  const country = (params?.country as string) || 'in';
  return (
    <div style={{ display: 'none' }} aria-hidden="true">
      <NextLink href={`/${country}/login`} prefetch={true} tabIndex={-1}>{''}</NextLink>
      <NextLink href={`/${country}/signup`} prefetch={true} tabIndex={-1}>{''}</NextLink>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes("/dashboard") || pathname?.includes("/control");

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" className="bg-white!" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <title>StayBuddy - Find Your Perfect Stay</title>
        <meta name="description" content="Premium rental marketplace for PG and tenant listings" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <Providers>
          <PrefetchRoutes />
          {!isDashboard && <Navbar />}
          <main className={!isDashboard ? "pt-16 sm:pt-20" : ""}>{children}</main>
          {!isDashboard && <Footer />}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
