export function getDiscountPercentage(originalPrice: number, price: number) {
  if (originalPrice <= 0 || price >= originalPrice) {
    return 0;
  }

  return ((originalPrice - price) / originalPrice) * 100;
}

export function formatDiscountPercentage(originalPrice: number, price: number) {
  return `${Math.round(getDiscountPercentage(originalPrice, price))}%`;
}
