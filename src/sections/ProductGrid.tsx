import { products } from "@/data/products";
import { useUIStore } from "@/stores/uiStore";
import { ProductCard } from "@/components/ProductCard";
import { useMemo } from "react";

export function ProductGrid() {
  const activeCategory = useUIStore((s) => s.activeCategory);
  const searchQuery = useUIStore((s) => s.searchQuery);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory === "new-arrivals") {
      result = result.filter((p) => p.isNew);
    } else if (activeCategory === "bestsellers") {
      result = result.filter((p) => p.badge === "BESTSELLER");
    } else if (activeCategory === "sale") {
      result = result.filter((p) => p.originalPrice !== null);
    } else if (activeCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  return (
    <section id="products" className="bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-6 md:py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-base font-medium text-[#2A2A2A] mb-2">
              No products found
            </p>
            <p className="text-sm text-[#2A2A2A]">
              Try a different category or search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
