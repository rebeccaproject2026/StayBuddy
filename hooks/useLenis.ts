"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";

/**
 * Hook to access the Lenis instance for programmatic scrolling
 * Usage: const lenis = useLenis();
 * Then: lenis?.scrollTo(target, { duration: 1, offset: 0 });
 */
export function useLenis() {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Get the lenis instance from the window object
    const lenisInstance = (window as any).lenis;
    if (lenisInstance) {
      setLenis(lenisInstance);
    }
  }, []);

  return lenis;
}
