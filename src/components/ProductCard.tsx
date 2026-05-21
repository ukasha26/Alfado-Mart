import { motion } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";
import { useUIStore } from "@/stores/uiStore";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const addToast = useToastStore((s) => s.addToast);
  const openProductModal = useUIStore((s) => s.openProductModal);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    openCart();
    addToast("Added to cart", "success");
  };

  const handleClick = () => {
    openProductModal(product.id);
  };

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString("en-PK")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group cursor-pointer border border-[#F3F4F6] bg-white transition-colors duration-300 hover:border-black"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute top-3 left-3 px-2 py-1 text-[11px] font-medium tracking-wider ${
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
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-white border-t border-black text-sm font-medium text-black hover:bg-[#F3F4F6] transition-colors duration-200 active:scale-[0.98]"
            type="button"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm md:text-base font-medium text-black line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base md:text-lg font-semibold text-black">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm md:text-base text-[#2A2A2A] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Mobile Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="md:hidden w-full mt-3 py-3 bg-black text-white text-sm font-medium hover:bg-[#2A2A2A] transition-colors duration-200 active:scale-[0.98]"
          type="button"
        >
          ADD TO CART
        </button>
      </div>
    </motion.div>
  );
}
