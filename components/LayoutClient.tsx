"use client";

import React from "react";
import { usePathname, useParams } from "next/navigation";
import NextLink from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

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

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard') || pathname?.includes('/control');

  return (
    <SmoothScroll>
      <PrefetchRoutes />
      {!isDashboard && <Navbar />}
      <main className={!isDashboard ? 'pt-16 sm:pt-20' : ''}>{children}</main>
      {!isDashboard && <Footer />}
    </SmoothScroll>
  );
}
