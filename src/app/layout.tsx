import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

/* Typography:
   - Playfair Display (serif) is used for headings — luxury, editorial feel.
   - Inter (sans-serif) is used for body copy — clean and highly legible. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HEFA — Modern Nigerian Tailoring",
    template: "%s · HEFA",
  },
  description:
    "HEFA is a Nigerian designer label crafting premium tailored clothing for the modern wardrobe.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream font-sans text-black">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

