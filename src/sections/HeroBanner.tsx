import { useMemo } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { OFFER_BANNER_TEXT, OFFER_LABEL, getOfferEndDate } from "@/lib/offer";

export function HeroBanner() {
  const targetDate = useMemo(() => getOfferEndDate(), []);
  const { days, hours, minutes, seconds } = useCountdown(targetDate);
  const pad = (n: number) => String(n).padStart(2, "0");

  const handleShopNow = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-white border-b border-[#F3F4F6]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8 md:py-12 text-center">
        <h1 className="text-[22px] md:text-[32px] font-semibold text-black tracking-[-0.01em] leading-tight">
          {OFFER_LABEL}
        </h1>

        <p className="text-sm md:text-base text-[#2A2A2A] mt-2">
          {OFFER_BANNER_TEXT} on all products. Limited time offer!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 mt-4">
          <span className="bg-[#F3F4F6] min-w-11 px-2.5 md:px-3 py-2 text-lg md:text-[28px] font-bold text-black text-center">
            {pad(days)}
          </span>
          <span className="text-[#2A2A2A] text-lg md:text-xl font-light">:</span>
          <span className="bg-[#F3F4F6] min-w-11 px-2.5 md:px-3 py-2 text-lg md:text-[28px] font-bold text-black text-center">
            {pad(hours)}
          </span>
          <span className="text-[#2A2A2A] text-lg md:text-xl font-light">:</span>
          <span className="bg-[#F3F4F6] min-w-11 px-2.5 md:px-3 py-2 text-lg md:text-[28px] font-bold text-black text-center">
            {pad(minutes)}
          </span>
          <span className="text-[#2A2A2A] text-lg md:text-xl font-light">:</span>
          <span className="bg-[#F3F4F6] min-w-11 px-2.5 md:px-3 py-2 text-lg md:text-[28px] font-bold text-black text-center">
            {pad(seconds)}
          </span>
        </div>

        <p className="hidden sm:block text-xs text-[#2A2A2A] mt-2 tracking-wider">
          DAYS : HOURS : MINUTES : SECONDS
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
