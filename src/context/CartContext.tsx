"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { cartStore, type AddItemInput, type CartItem } from "@/lib/cart";
import { getProductById } from "@/lib/data/products";

export type { CartItem, CartLine } from "@/lib/cart";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (input: AddItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Provides the shared cart to the whole app.
 *
 * The cart data lives in an external store (src/lib/cart.ts) so the product
 * page, mini-cart drawer and cart page all read and write the same state.
 * This component only adds the UI-only drawer state and exposes everything
 * through the useCart() hook.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const [isOpen, setIsOpen] = useState(false);

  // Lock page scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const addItem = useCallback((input: AddItemInput) => {
    cartStore.addItem(input);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    cartStore.removeItem(id);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    cartStore.updateQuantity(id, quantity);
  }, []);

  const clearCart = useCallback(() => {
    cartStore.clear();
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const items = useMemo<CartItem[]>(
    () =>
      lines
        .map((line) => {
          const product = getProductById(line.productId);
          if (!product) return null;
          return { ...line, product, lineTotal: product.price * line.quantity };
        })
        .filter((item): item is CartItem => item !== null),
    [lines],
  );

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.lineTotal, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      subtotal,
      isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      items,
      totalItems,
      subtotal,
      isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Read and control the cart from any client component. */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>.");
  }
  return context;
}

