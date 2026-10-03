import Image from "next/image";

interface AuthAsideProps {
  /** Decorative photograph shown behind the panel. */
  image: string;
  /** Base colour underneath the photograph, so the panel is never blank. */
  tone: "forest" | "charcoal";
}

const TONE_CLASS = {
  forest: "bg-forest",
  charcoal: "bg-charcoal",
} as const;

/**
 * Brand panel beside the sign-in and create-account forms.
 *
 * Shared by both auth pages so the two stay a matched pair.
 *
 * The photograph is decorative — the "Modern Afro-Minimalism" line carries the
 * message — so it takes an empty alt and is hidden from assistive technology.
 * The tone colour sits underneath as the base layer, so the panel still reads
 * as a solid block if the image ever fails to load, and the scrim carries the
 * contrast for the cream caption rather than relying on the photo being dark.
 *
 * Desktop only, matching the single-column form on narrow screens.
 */
export function AuthAside({ image, tone }: AuthAsideProps) {
  return (
    <div className={`relative hidden min-h-[420px] overflow-hidden lg:block ${TONE_CLASS[tone]}`}>
      <Image
        src={image}
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

      <div className="absolute bottom-8 left-8 max-w-[9rem]">
        <span className="font-serif text-2xl leading-tight text-cream">
          Modern Afro-Minimalism
        </span>
      </div>
    </div>
  );
}