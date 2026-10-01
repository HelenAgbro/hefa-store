"use client";

import { useEffect, useState } from "react";

/** Approximate measurements (in centimetres) for the pants line. */
const SIZE_ROWS = [
  { size: "28", waist: "71", hip: "91", inseam: "76" },
  { size: "30", waist: "76", hip: "96", inseam: "77" },
  { size: "32", waist: "81", hip: "101", inseam: "78" },
  { size: "34", waist: "86", hip: "106", inseam: "79" },
  { size: "36", waist: "91", hip: "111", inseam: "80" },
  { size: "38", waist: "96", hip: "116", inseam: "81" },
];

/** "Size guide" link that opens a modal with a measurement table. */
export function SizeGuide() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs uppercase tracking-[0.18em] text-charcoal underline underline-offset-4 transition-colors hover:text-burnt-orange"
      >
        Size guide
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Size guide"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close size guide"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60"
          />

          <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto bg-cream p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">Fit</p>
                <h2 className="mt-2 text-2xl">Size guide</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-charcoal transition-colors hover:text-burnt-orange"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
              Measurements in centimetres. If you are between sizes, we recommend sizing up for a
              relaxed fit.
            </p>

            <table className="mt-6 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/20 text-left text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">
                  <th className="py-3 pr-4 font-medium">Size</th>
                  <th className="py-3 pr-4 font-medium">Waist</th>
                  <th className="py-3 pr-4 font-medium">Hip</th>
                  <th className="py-3 font-medium">Inseam</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_ROWS.map((row) => (
                  <tr key={row.size} className="border-b border-black/10">
                    <td className="py-3 pr-4 tabular-nums">{row.size}</td>
                    <td className="py-3 pr-4 tabular-nums">{row.waist}</td>
                    <td className="py-3 pr-4 tabular-nums">{row.hip}</td>
                    <td className="py-3 tabular-nums">{row.inseam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </>
  );
}
