import type { Product } from "@/data/products";

function normalizeSearchValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function getProductSearchText(product: Product) {
  return normalizeSearchValue(
    [
      product.id,
      product.name,
      product.description,
      product.category,
      product.badge,
      ...(product.features ?? []),
      ...(product.caution ?? []),
      ...(product.keywords ?? []),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

export function searchProducts(products: Product[], query: string) {
  const terms = normalizeSearchValue(query).split(" ").filter(Boolean);

  if (terms.length === 0) {
    return products;
  }

  return products.filter((product) => {
    const searchText = getProductSearchText(product);
    return terms.every((term) => searchText.includes(term));
  });
}
