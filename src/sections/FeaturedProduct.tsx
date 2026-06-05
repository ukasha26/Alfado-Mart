import { products } from "@/data/products";
import { useUIStore } from "@/stores/uiStore";

export function FeaturedProduct() {
  const openProductModal = useUIStore((s) => s.openProductModal);

  return (
    <section id="products" className="bg-white border-t border-[#F3F4F6]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-6 md:py-10">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            const heroImage = product.images?.[0] ?? product.image;

            return (
              <article
                key={product.id}
                id={product.id}
                className="rounded-2xl border border-[#F3F4F6] bg-white p-4 md:p-5"
              >
                <button
                  type="button"
                  onClick={() => openProductModal(product.id)}
                  className="relative w-full overflow-hidden text-left"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[#F3F4F6] bg-white flex items-center justify-center">
                    <img src={heroImage} alt={product.name} className="h-full w-full object-contain p-3" />
                  </div>
                </button>

                <div className="mt-3">
                  <h2 className="text-xl md:text-2xl font-semibold leading-tight text-black tracking-[-0.02em] line-clamp-2">
                    {product.name}
                  </h2>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
