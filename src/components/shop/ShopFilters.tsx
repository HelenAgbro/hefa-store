import type { ReactNode } from "react";
import { COLOR_SWATCHES, SORT_OPTIONS, type SortKey } from "@/lib/shop";
import type { CategoryName } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ShopFiltersProps {
  categories: CategoryName[];
  sizes: string[];
  colors: string[];
  category: CategoryName | "all";
  size: string | null;
  color: string | null;
  sort: SortKey;
  resultCount: number;
  hasActiveFilters: boolean;
  onCategoryChange: (value: CategoryName | "all") => void;
  onSizeChange: (value: string | null) => void;
  onColorChange: (value: string | null) => void;
  onSortChange: (value: SortKey) => void;
  onClear: () => void;
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
      <span className="w-20 shrink-0 text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

interface PillProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  "aria-label"?: string;
}

function Pill({ active, onClick, children, ...rest }: PillProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "border px-4 py-2 text-[0.65rem] uppercase tracking-[0.18em] transition-colors",
        active
          ? "border-black bg-black text-cream"
          : "border-black/20 bg-transparent text-charcoal hover:border-black hover:text-black",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * The shop filter + sort bar: category, size and colour filters plus a sort
 * dropdown and the live result count.
 */
export function ShopFilters({
  categories,
  sizes,
  colors,
  category,
  size,
  color,
  sort,
  resultCount,
  hasActiveFilters,
  onCategoryChange,
  onSizeChange,
  onColorChange,
  onSortChange,
  onClear,
}: ShopFiltersProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Result count, sort and clear */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/70">
          {resultCount} {resultCount === 1 ? "piece" : "pieces"}
        </p>

        <div className="flex items-center gap-4">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onClear}
              className="text-xs uppercase tracking-[0.18em] text-charcoal/70 underline underline-offset-4 transition-colors hover:text-burnt-orange"
            >
              Clear
            </button>
          ) : null}

          <label htmlFor="sort" className="sr-only">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortKey)}
            className="h-10 border border-black/20 bg-transparent px-3 text-[0.65rem] uppercase tracking-[0.14em] text-black outline-none transition-colors focus:border-black"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter rows */}
      <div className="flex flex-col gap-5 border-y border-black/10 py-6">
        <FilterRow label="Category">
          <Pill active={category === "all"} onClick={() => onCategoryChange("all")}>
            All
          </Pill>
          {categories.map((name) => (
            <Pill
              key={name}
              active={category === name}
              onClick={() => onCategoryChange(category === name ? "all" : name)}
            >
              {name}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Size">
          {sizes.map((value) => (
            <Pill
              key={value}
              active={size === value}
              onClick={() => onSizeChange(size === value ? null : value)}
            >
              {value}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Color">
          {colors.map((name) => {
            const active = color === name;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                aria-label={`Color ${name}`}
                onClick={() => onColorChange(active ? null : name)}
                className={cn(
                  "inline-flex items-center gap-2 border px-3 py-2 text-[0.65rem] uppercase tracking-[0.18em] transition-colors",
                  active
                    ? "border-black text-black"
                    : "border-black/20 text-charcoal hover:border-black hover:text-black",
                )}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: COLOR_SWATCHES[name] ?? "#b9b2a4" }}
                />
                {name}
              </button>
            );
          })}
        </FilterRow>
      </div>
    </div>
  );
}
