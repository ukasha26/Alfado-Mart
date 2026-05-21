import { useUIStore } from "@/stores/uiStore";
import { categories } from "@/data/products";

export function FilterBar() {
  const activeCategory = useUIStore((s) => s.activeCategory);
  const setActiveCategory = useUIStore((s) => s.setActiveCategory);

  return (
    <section className="bg-white border-b border-[#F3F4F6] sticky top-[60px] md:top-[72px] z-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative flex-shrink-0 py-3 px-3 md:px-4 text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
                activeCategory === cat.id
                  ? "text-black"
                  : "text-[#2A2A2A] hover:text-black"
              }`}
            >
              {cat.name}
              {activeCategory === cat.id && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
