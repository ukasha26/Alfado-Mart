export function TopBannerSlider() {
  return (
    <section
      aria-label="Alfado Mart product categories"
      className="w-full overflow-hidden bg-[#F7F1EB]"
    >
      <img
        src="/Banner.jpg"
        alt="Alfado Mart beauty, home gadget, and kitchen product collection"
        width={855}
        height={407}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="block h-auto max-h-[min(42vw,520px)] w-full object-cover object-center"
      />
    </section>
  );
}
