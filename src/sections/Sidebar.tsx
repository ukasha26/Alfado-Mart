import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Backdrop } from "@/components/Backdrop";

const menuItems = [
  { label: "HOME", href: "#" },
  { label: "SHOP", href: "#products" },
  { label: "NEW ARRIVALS", href: "#products" },
  { label: "BESTSELLERS", href: "#products" },
  { label: "SALE", href: "#products" },
  { label: "ABOUT US", href: "#" },
  { label: "CONTACT", href: "#" },
];

export function Sidebar() {
  const isOpen = useUIStore((s) => s.sidebarOpen);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  useScrollLock(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClick={closeSidebar} zIndex={200} />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 h-full bg-white shadow-lg"
            style={{ zIndex: 200, width: "85vw", maxWidth: 360 }}
          >
            <div className="flex flex-col h-full p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-logo text-black text-xl">
                  ALFADO MART.
                </span>
                <button
                  onClick={closeSidebar}
                  className="text-[#2A2A2A] hover:text-black transition-colors duration-150 p-1"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu Links */}
              <nav className="flex-1">
                <ul className="flex flex-col">
                  {menuItems.map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.05,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      <a
                        href={item.href}
                        onClick={closeSidebar}
                        className="block py-4 text-base font-medium text-black border-b border-[#F3F4F6] hover:bg-[#F3F4F6] hover:pl-2 transition-all duration-150"
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Footer */}
              <div className="pt-6 border-t border-[#F3F4F6]">
                <div className="flex gap-4 text-sm text-[#2A2A2A]">
                  <span className="hover:text-black cursor-pointer transition-colors">
                    Instagram
                  </span>
                  <span className="hover:text-black cursor-pointer transition-colors">
                    Facebook
                  </span>
                </div>
                <p className="text-sm text-[#2A2A2A] mt-3">
                  support@alfadomart.com
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
