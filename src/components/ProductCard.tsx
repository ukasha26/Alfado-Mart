import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const addToast = useToastStore((s) => s.addToast);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    openCart();
    addToast("Added to cart", "success");
  };

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString("en-PK")}`;
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="block"
      style={{ textDecoration: "none" }}
      aria-label={`Open ${product.name}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.4,
          delay: index * 0.05,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="group min-w-0 cursor-pointer border border-[#F3F4F6] bg-white transition-colors duration-300 hover:border-black"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <img
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />

          {/* Badge */}
          {product.badge && (
            <div
              className={`absolute left-3 top-3 px-2 py-1 text-[11px] font-medium tracking-wider ${
                product.badge === "SALE"
                  ? "bg-[#F2A93B] text-black"
                  : product.badge === "NEW"
                    ? "bg-black text-white"
                    : "bg-[#2A2A2A] text-white"
              }`}
            >
              {product.badge}
            </div>
          )}

          {/* Quick Add Button - Desktop hover */}
          <div className="absolute bottom-0 left-0 right-0 hidden translate-y-full transition-transform duration-300 group-hover:translate-y-0 md:block">
            <button
              onClick={handleAddToCart}
              className="w-full border-t border-black bg-white py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-[#F3F4F6] active:scale-[0.98]"
              type="button"
            >
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-black md:text-base">
            {product.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-base font-semibold text-black md:text-lg">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm font-bold text-red-600 line-through decoration-red-500 decoration-2 md:text-base">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full bg-black py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#2A2A2A] active:scale-[0.98] md:hidden"
            type="button"
          >
            ADD TO CART
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
