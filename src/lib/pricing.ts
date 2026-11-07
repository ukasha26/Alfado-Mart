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
]);

export const TIERED_BUNDLE_PRODUCT_IDS = new Set([
  "vegetable-cutter",
  "stainless-steel-vegetable-cutter",
]);

export function getTieredExtraDiscountPercent(quantity: number): number {
  if (quantity >= 3) return 15;
  if (quantity >= 2) return 10;
  return 0;
}

export function getTieredDeliveryCharge(): number {
  return 0;
}

export function calculateTieredLineTotal(price: number, quantity: number): number {
  const subtotal = price * quantity;
  const extraDiscount = getTieredExtraDiscountPercent(quantity);
  return Math.round(subtotal * (1 - extraDiscount / 100));
}

export function calculateTieredOrderTotal(price: number, quantity: number): number {
  return calculateTieredLineTotal(price, quantity) + getTieredDeliveryCharge();
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
