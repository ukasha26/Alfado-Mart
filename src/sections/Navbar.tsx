import { useState, useRef, useEffect } from "react";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useCartStore } from "@/stores/cartStore";

export function Navbar() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const totalItems = useCartStore((s) => s.totalItems);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);

  const [searchFocused, setSearchFocused] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[130] overflow-hidden border-b border-black bg-black text-white">
        <div className="flex min-w-max animate-ticker whitespace-nowrap py-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-xs sm:tracking-[0.35em]">
          <span className="px-8">Welcome to Alfado Mart | Up to 50% Off | 7-Day Return Policy</span>
          <span className="px-8" aria-hidden="true">
            Welcome to Alfado Mart | Up to 50% Off | 7-Day Return Policy
          </span>
          <span className="px-8" aria-hidden="true">
            Welcome to Alfado Mart | Up to 50% Off | 7-Day Return Policy
          </span>
        </div>
      </div>

      <div aria-hidden="true" className="h-8 sm:h-9" />

      <nav
        className={`sticky top-8 sm:top-9 bg-white transition-all duration-200 ${
          isSticky ? "border-b border-[#F3F4F6] shadow-sm" : ""
        }`}
        style={{ zIndex: 100 }}
      >
        <div className="flex items-center justify-between h-[60px] md:h-[72px] px-4 md:px-12 max-w-[1440px] mx-auto">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={toggleSidebar}
              className="p-1 text-black hover:text-[#2A2A2A] transition-colors duration-150"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-logo text-black text-xl md:text-[30px] leading-none hover:opacity-80 transition-opacity"
            >
              ALFADO MART.
            </button>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className={`relative transition-all duration-300 ease-in-out ${searchFocused ? "w-[320px]" : "w-[200px]"}`}>
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2A2A2A]"
              />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-9 pr-4 py-2.5 border border-[#2A2A2A] bg-white text-sm text-black placeholder:text-[#2A2A2A] focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right: PK flag + Cart */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search icon mobile */}
            <button
              className="md:hidden p-1 text-black"
              onClick={() => setSearchFocused(true)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* PK Badge */}
            <div className="pk-badge text-xs font-semibold text-[#2A2A2A]">
              <img
                src="https://flagcdn.com/w40/pk.png"
                alt="PK"
                className="w-5 h-3.5 rounded-sm"
              />
              <span>PK</span>
            </div>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-1 text-black hover:text-[#2A2A2A] transition-colors duration-150"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-black text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {searchFocused && (
          <div className="md:hidden fixed inset-0 bg-white z-[110] p-4">
            <div className="flex items-center gap-3">
              <Search size={16} className="text-[#2A2A2A] flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-2.5 border-b border-black text-sm text-black placeholder:text-[#2A2A2A] focus:outline-none"
              />
              <button
                onClick={() => {
                  setSearchFocused(false);
                  setSearchQuery("");
                }}
                className="text-sm text-[#2A2A2A]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
