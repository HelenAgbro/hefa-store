import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BRAND, FOOTER_LINKS } from "@/lib/constants";

interface FooterColumnProps {
  title: string;
  links: readonly { label: string; href: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/50">{title}</p>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-cream/80 transition-colors hover:text-ochre">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Site-wide footer: brand blurb, navigation columns and contact details.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-black text-cream">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="sm:col-span-2 lg:col-span-1">
          <span className="font-serif text-2xl tracking-[0.3em]">{BRAND.name}</span>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">{BRAND.description}</p>
          <div className="mt-6 flex flex-wrap gap-5 text-xs uppercase tracking-[0.18em]">
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/80 transition-colors hover:text-ochre"
            >
              Instagram
            </a>
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/80 transition-colors hover:text-ochre"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="text-cream/80 transition-colors hover:text-ochre"
            >
              Email
            </a>
          </div>
        </div>

        <FooterColumn title="Shop" links={FOOTER_LINKS.shop} />
        <FooterColumn title="Help" links={FOOTER_LINKS.help} />
        <FooterColumn title="Account" links={FOOTER_LINKS.account} />
      </Container>

      <div className="border-t border-cream/15">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60 sm:flex-row">
          <p>
            © {year} {BRAND.name}. {BRAND.tagline}.
          </p>
          <p>
            {BRAND.location} · {BRAND.email}
          </p>
        </Container>
      </div>
    </footer>
  );
}
