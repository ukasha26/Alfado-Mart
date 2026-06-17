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

export function hasTieredDiscount(productId: string): boolean {
  return TIERED_DISCOUNT_PRODUCT_IDS.has(productId);
}
