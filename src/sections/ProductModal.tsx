import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useCartStore } from "@/stores/cartStore";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Backdrop } from "@/components/Backdrop";
import { OrderCheckoutForm } from "@/components/OrderCheckoutForm";

export function ProductModal() {
  const isOpen = useUIStore((s) => s.checkoutModalOpen);
  const checkoutRequested = useUIStore((s) => s.checkoutRequested);
  const clearCheckout = useUIStore((s) => s.clearCheckout);
  const closeCheckoutModal = useUIStore((s) => s.closeCheckoutModal);
  const items = useCartStore((s) => s.items);

  useScrollLock(isOpen && checkoutRequested);

  const handleClose = () => {
    closeCheckoutModal();
    clearCheckout();
  };

  const shouldShow = isOpen && checkoutRequested;

  return (
    <AnimatePresence>
      {shouldShow && (
        <div className="relative">
          <Backdrop onClick={handleClose} zIndex={300} />

          <motion.div
            initial={{ opacity: 0, y: "100%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 bottom-0 h-[100dvh] overflow-y-auto bg-white md:inset-0 md:flex md:h-auto md:items-center md:justify-center md:bg-transparent"
            style={{ zIndex: 300 }}
          >
            <div className="relative h-full w-full overflow-y-auto bg-white md:h-auto md:max-h-[90vh] md:max-w-[640px]">
              <button
                onClick={handleClose}
                className="absolute right-3 top-3 z-10 bg-white/90 p-2 text-[#2A2A2A] transition-colors duration-150 hover:text-black md:right-4 md:top-4"
                aria-label="Close"
                type="button"
              >
                <X size={24} />
              </button>

              <OrderCheckoutForm
                orderItems={items}
                onBack={handleClose}
                onComplete={handleClose}
                clearCartOnSuccess
                backLabel="Close"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
