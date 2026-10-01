import type { Product } from "@/lib/types";

/** A single line in the cart (one product + colour + size). */
export interface CartLine {
  id: string;
  productId: string;
  color: string;
  size: string;
  quantity: number;
}

/** A cart line enriched with its product details and line total. */
export interface CartItem extends CartLine {
  product: Product;
  lineTotal: number;
}

export interface AddItemInput {
  productId: string;
  color: string;
  size: string;
  quantity?: number;
}

const STORAGE_KEY = "hefa.cart.v1";
const MAX_QUANTITY = 10;
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let initialized = false;
const listeners = new Set<() => void>();

function buildLineId(productId: string, color: string, size: string): string {
  return `${productId}::${color}::${size}`;
}

function clampQuantity(value: number): number {
  if (Number.isNaN(value)) return 1;
  return Math.min(Math.max(Math.round(value), 1), MAX_QUANTITY);
}

function emit(): void {
  for (const listener of listeners) listener();
}

function persist(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Ignore storage failures (e.g. private browsing).
  }
}

function commit(next: CartLine[]): void {
  lines = next;
  persist();
  emit();
}

/** Read the saved cart from localStorage once, on the client only. */
function initialize(): void {
  if (initialized) return;
  initialized = true;
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) lines = parsed as CartLine[];
  } catch {
    // Ignore unreadable storage and keep the empty cart.
  }
}

/**
 * A tiny external store for the cart, consumed through useSyncExternalStore.
 *
 * Keeping the cart outside React gives us one shared source of truth for the
 * product page, the mini-cart drawer and the cart page, and it avoids
 * hydration mismatches because the server snapshot is always empty.
 */
export const cartStore = {
  subscribe(listener: () => void): () => void {
    initialize();
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot(): CartLine[] {
    return lines;
  },

  getServerSnapshot(): CartLine[] {
    return EMPTY;
  },

  addItem(input: AddItemInput): void {
    initialize();
    const quantity = clampQuantity(input.quantity ?? 1);
    const id = buildLineId(input.productId, input.color, input.size);
    const existing = lines.find((line) => line.id === id);

    if (existing) {
      commit(
        lines.map((line) =>
          line.id === id ? { ...line, quantity: clampQuantity(line.quantity + quantity) } : line,
        ),
      );
      return;
    }

    commit([
      ...lines,
      { id, productId: input.productId, color: input.color, size: input.size, quantity },
    ]);
  },

  removeItem(id: string): void {
    initialize();
    commit(lines.filter((line) => line.id !== id));
  },

  updateQuantity(id: string, quantity: number): void {
    initialize();
    commit(
      lines.map((line) => (line.id === id ? { ...line, quantity: clampQuantity(quantity) } : line)),
    );
  },

  clear(): void {
    initialize();
    commit(EMPTY);
  },
};
