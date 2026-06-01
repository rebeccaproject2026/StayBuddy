import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import LayoutClient from "@/components/LayoutClient";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <LayoutClient>
            {children}
          </LayoutClient>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
