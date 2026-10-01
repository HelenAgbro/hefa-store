import { Container } from "@/components/ui/Container";

/** Thin promotional strip that sits at the very top of the homepage. */
export function AnnouncementBar() {
  return (
    <div className="bg-black text-cream">
      <Container className="py-2.5 text-center">
        <p className="text-[0.6rem] uppercase tracking-[0.2em] sm:text-xs">
          Complimentary nationwide delivery on orders over ₦150,000 · Now shipping internationally
        </p>
      </Container>
    </div>
  );
}
