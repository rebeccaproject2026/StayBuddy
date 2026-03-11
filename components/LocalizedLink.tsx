"use client";

import Link, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { ReactNode, forwardRef, AnchorHTMLAttributes } from "react";

interface LocalizedLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  children: ReactNode;
  className?: string;
}

const LocalizedLink = forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  ({ href, children, ...props }, ref) => {
    const params = useParams();
    const country = params?.country as string;
    
    // Fallback to default if somehow missing (middleware handles most)
    const currentCountry = country || 'in';

    // Parse the href to inject the country.
    // Handles string hrefs
    let localizedHref = href;
    
    if (typeof href === 'string') {
        if (href.startsWith('/')) {
             localizedHref = `/${currentCountry}${href === '/' ? '' : href}`;
        }
    } else if (typeof href === 'object' && href.pathname?.startsWith('/')) {
        // Handle object hrefs if used
        localizedHref = {
            ...href,
            pathname: `/${currentCountry}${href.pathname === '/' ? '' : href.pathname}`
        };
    }

    return (
      <Link href={localizedHref} ref={ref} {...props}>
        {children}
      </Link>
    );
  }
);

LocalizedLink.displayName = "LocalizedLink";

export default LocalizedLink;
