export function getDiscountPercentage(originalPrice: number, price: number) {
  if (originalPrice <= 0 || price >= originalPrice) {
    return 0;
  }

  return ((originalPrice - price) / originalPrice) * 100;
}

export function formatDiscountPercentage(originalPrice: number, price: number) {
  return `${Math.round(getDiscountPercentage(originalPrice, price))}%`;
}

export const TIERED_DISCOUNT_PRODUCT_IDS = new Set([
  "health-healer-night-cream",
  "bare-anatomy-rosemary-spray",
  "feg-plus-hair-spray",
]);

export const TIERED_BUNDLE_PRODUCT_IDS = new Set([
  "vegetable-cutter",
  "stainless-steel-vegetable-cutter",
]);

export function getTieredExtraDiscountPercent(quantity: number): number {
  if (quantity >= 3) return 30;
  if (quantity >= 2) return 20;
  return 0;
}

export const TIERED_SINGLE_DELIVERY_CHARGE = 200;

export function getTieredDeliveryCharge(quantity: number): number {
  return quantity === 1 ? TIERED_SINGLE_DELIVERY_CHARGE : 0;
}

export function calculateTieredLineTotal(price: number, quantity: number): number {
  const subtotal = price * quantity;
  const extraDiscount = getTieredExtraDiscountPercent(quantity);
  return Math.round(subtotal * (1 - extraDiscount / 100));
}

export function calculateTieredOrderTotal(price: number, quantity: number): number {
  return calculateTieredLineTotal(price, quantity) + getTieredDeliveryCharge(quantity);
}

export function shouldApplyTieredDiscount(product: {
  id: string;
  hasTieredDiscount?: boolean;
}): boolean {
  return Boolean(product.hasTieredDiscount) || TIERED_DISCOUNT_PRODUCT_IDS.has(product.id) || TIERED_BUNDLE_PRODUCT_IDS.has(product.id);
}

export function calculateOrderLineTotal(
  product: {
    id: string;
    price: number;
    hasTieredDiscount?: boolean;
  },
  quantity: number
): number {
  return shouldApplyTieredDiscount(product)
    ? calculateTieredLineTotal(product.price, quantity)
    : product.price * quantity;
}

export function hasTieredDiscount(productId: string): boolean {
  return TIERED_DISCOUNT_PRODUCT_IDS.has(productId);
}
