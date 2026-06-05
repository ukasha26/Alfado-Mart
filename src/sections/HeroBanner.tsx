export function HeroBanner() {
  const handleShopNow = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-white border-b border-[#F3F4F6]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8 md:py-12 text-center">
        {/* Heading removed to avoid duplicate site title under hero banner */}
        <p className="text-sm md:text-base text-[#2A2A2A] mt-2">
          Shop the featured kitchen essential below.
        </p>

        <button
          onClick={handleShopNow}
          className="mt-6 px-8 py-3.5 bg-black text-white text-sm font-medium tracking-wider hover:bg-[#2A2A2A] transition-colors duration-200 active:scale-[0.98]"
        >
          SHOP NOW
        </button>
      </div>
    </section>
  );
}
