"use client";

import { useEffect } from "react";
import { cartStore } from "@/lib/cart";

/**
 * Empties the cart once a payment is confirmed.
 *
 * The cart lives in localStorage, so it survives the trip to Paystack. Without
 * this, a customer who has just paid would return to a cart that still holds
 * their items and could easily buy the same thing twice.
 */
export function ClearCartOnSuccess() {
  useEffect(() => {
    cartStore.clear();
  }, []);

  return null;
}