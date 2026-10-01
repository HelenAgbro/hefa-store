import { Button } from "@/components/ui/Button";

interface ProductEmptyStateProps {
  /** When provided, shows a "Clear filters" button that calls this. */
  onClear?: () => void;
  title?: string;
  description?: string;
}

/** Shown when a filter combination returns no products. */
export function ProductEmptyState({
  onClear,
  title = "No pieces match your filters",
  description = "Try removing a filter, or clear them all to see the full collection.",
}: ProductEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-black/20 px-6 py-20 text-center">
      <p className="font-serif text-2xl">{title}</p>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal/70">{description}</p>
      {onClear ? (
        <Button type="button" variant="outline" size="md" className="mt-8" onClick={onClear}>
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
