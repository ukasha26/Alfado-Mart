import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Backdrop } from "@/components/Backdrop";
import { QuantitySelector } from "@/components/QuantitySelector";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const openCheckout = useUIStore((s) => s.openCheckout);

  useScrollLock(isOpen);

  const formatPrice = (price: number) => `Rs. ${price.toLocaleString("en-PK")}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClick={closeCart} zIndex={300} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 flex h-[100dvh] flex-col bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.08)]"
            style={{ zIndex: 300, width: "100vw", maxWidth: 420 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F3F4F6] px-4 py-4 md:px-6">
              <h2 className="text-base font-semibold tracking-wide">
                YOUR CART
              </h2>
              <button
                onClick={closeCart}
                className="text-[#2A2A2A] hover:text-black transition-colors duration-150 p-1"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-[#F3F4F6] mb-4" />
                  <p className="text-lg font-medium text-black mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-[#2A2A2A] mb-6">
                    Add some products to get started
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-8 py-3 bg-black text-white text-sm font-medium hover:bg-[#2A2A2A] transition-colors duration-200 active:scale-[0.98]"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-3 border-b border-[#F3F4F6] py-4 md:gap-4"
                    >
                      {/* Product Image */}
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden border border-[#F3F4F6] min-[380px]:h-20 min-[380px]:w-20">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium text-black line-clamp-1">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-[#2A2A2A] hover:text-black transition-colors duration-150 flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-black mt-1">
                          {formatPrice(item.product.price)}
                        </p>

                        <div className="mt-2">
                          <QuantitySelector
                            quantity={item.quantity}
                            onChange={(qty) =>
                              updateQuantity(item.product.id, qty)
                            }
                            compact
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#F3F4F6] bg-white px-4 py-4 md:px-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#2A2A2A]">Subtotal</span>
                  <span className="text-lg font-semibold text-black">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-[#2A2A2A] mb-4">
                  Shipping calculated at checkout
                </p>
                <button
                  onClick={() => {
                    openCheckout();
                    closeCart();
                  }}
                  className="w-full py-4 bg-black text-white text-sm font-medium tracking-wider hover:bg-[#2A2A2A] transition-colors duration-200 active:scale-[0.98]"
                >
                  CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
