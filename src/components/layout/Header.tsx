import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/constants";
import { MobileMenu } from "./MobileMenu";
import { Nav } from "./Nav";

/**
 * Site-wide sticky header: brand mark, primary navigation and
 * utility links (account, cart). Also hosts the mobile menu button.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-cream/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <div className="flex items-center gap-2">
          <MobileMenu />
          <Link
            href="/"
            aria-label={`${BRAND.name} home`}
            className="font-serif text-2xl tracking-[0.3em] text-black sm:text-[1.7rem]"
          >
            {BRAND.name}
          </Link>
        </div>

        <Nav />

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/login"
            aria-label="Account"
            className="hidden text-charcoal transition-colors hover:text-burnt-orange sm:inline-flex"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
            </svg>
          </Link>

          <Link
            href="/cart"
            aria-label="Cart"
            className="inline-flex text-charcoal transition-colors hover:text-burnt-orange"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6 7h12l-1 13H7L6 7Z" strokeLinejoin="round" />
              <path d="M9 7a3 3 0 0 1 6 0" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </Container>
    </header>
  );
}
