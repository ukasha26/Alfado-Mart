export function getDiscountPercentage(originalPrice: number, price: number) {
  if (originalPrice <= 0 || price >= originalPrice) {
    return 0;
  }

  return ((originalPrice - price) / originalPrice) * 100;
}

export function formatDiscountPercentage(originalPrice: number, price: number) {
  return `${getDiscountPercentage(originalPrice, price).toFixed(1)}%`;
}