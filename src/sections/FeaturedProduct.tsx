import { products } from "@/data/products";
import { Link } from "react-router-dom";

export function FeaturedProduct() {
  return (
    <section id="featured-products" className="bg-white border-t border-[#F3F4F6]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-6 md:py-10">
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {products.map((product) => {
            const heroImage = product.images?.[0] ?? product.image;

            return (
              <article
                key={product.id}
                id={product.id}
                className="rounded-lg border border-[#F3F4F6] bg-white p-3 md:p-4"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="relative w-full overflow-hidden text-left"
                  style={{ textDecoration: "none" }}
                  aria-label={`Open ${product.name}`}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border border-[#F3F4F6] bg-white flex items-center justify-center">
                    <img
                      src={heroImage}
                      alt={product.name}
                      className="h-full w-full object-contain p-3"
                    />

                    {/* Discount tag (top corner) */}
                    {product.originalPrice !== null && product.badge && (
                      <div className="absolute top-3 left-3 px-2 py-1 text-[11px] font-medium tracking-wider bg-[#F2A93B] text-black rounded-md">
                        <span className="whitespace-nowrap">{product.badge} OFF</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="mt-3">
                  <h2 className="line-clamp-2 text-base font-semibold leading-tight text-black md:text-xl">
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

