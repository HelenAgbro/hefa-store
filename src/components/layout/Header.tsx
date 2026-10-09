import Link from "next/link";
import { CartButton } from "@/components/cart/CartButton";
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
          {/* Points at /account for everyone: the account layout sends
              signed-out visitors on to /login, so one static link is correct
              in both states and the header itself can stay static. */}
          <Link
            href="/account"
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

          <CartButton />
        </div>
      </Container>
    </header>
  );
}
