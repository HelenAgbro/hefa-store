/** Countries offered in the checkout country selector. */
export const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
  "Canada",
  "Other",
] as const;

/** Standard shipping becomes free at or above this subtotal (Naira). */
export const FREE_SHIPPING_THRESHOLD = 150000;

export interface ShippingMethod {
  id: string;
  label: string;
  description: string;
  /** Cost in Naira. */
  price: number;
  /** When set, the method is free at or above this subtotal. */
  freeOver?: number;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    label: "Standard delivery",
    description: "3–5 business days",
    price: 3500,
    freeOver: FREE_SHIPPING_THRESHOLD,
  },
  {
    id: "express",
    label: "Express delivery",
    description: "1–2 business days",
    price: 7500,
  },
  {
    id: "pickup",
    label: "Studio pickup",
    description: "Lagos studio · ready in 24 hours",
    price: 0,
  },
];

/** Shipping cost for a method at a given subtotal (0 = free). */
export function getShippingCost(methodId: string, subtotal: number): number {
  const method = SHIPPING_METHODS.find((item) => item.id === methodId);
  if (!method) return 0;
  if (method.freeOver !== undefined && subtotal >= method.freeOver) return 0;
  return method.price;
}

/** The checkout form fields. */
export interface CheckoutValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  shippingMethod: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

export const INITIAL_CHECKOUT_VALUES: CheckoutValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "Nigeria",
  shippingMethod: "standard",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate the checkout form. Pure — returns an object of error messages
 * keyed by field, and an empty object when everything is valid.
 */
export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (!values.firstName.trim()) errors.firstName = "Please enter your first name.";
  if (!values.lastName.trim()) errors.lastName = "Please enter your last name.";

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (values.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!values.address1.trim()) errors.address1 = "Please enter your street address.";
  if (!values.city.trim()) errors.city = "Please enter your city.";
  if (!values.region.trim()) errors.region = "Please enter your state or region.";
  if (!values.country.trim()) errors.country = "Please select a country.";

  return errors;
}
