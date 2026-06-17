import { useCallback, useEffect, useState } from "react";

const BANNERS = [
  { src: "/Banner.png", alt: "Alfado Mart promotional banner" },
  { src: "/banner1.png", alt: "Alfado Mart special offers banner" },
] as const;

const INTERVAL_MS = 2000;

export function TopBannerSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % BANNERS.length);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(goToNext, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [goToNext]);

  return (
    <section
      aria-label="Promotional banners"
      className="relative w-full overflow-hidden bg-black"
    >
      <div className="relative w-full min-h-[180px] sm:min-h-[220px] md:min-h-[420px]">
        {BANNERS.map((banner, index) => (
          <img
            key={banner.src}
            src={banner.src}
            alt={banner.alt}
            width={1440}
            height={420}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`absolute inset-0 block h-full w-full object-contain transition-opacity duration-700 sm:max-h-[320px] md:max-h-none md:object-cover md:object-center ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== activeIndex}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      <div
        className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2"
        role="tablist"
        aria-label="Banner slides"
      >
        {BANNERS.map((banner, index) => (
          <button
            key={banner.src}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to banner ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === activeIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
