import { motion } from "framer-motion";
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
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="text-[22px] md:text-[32px] font-semibold text-black tracking-[-0.01em] leading-tight"
        >
          {OFFER_LABEL}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="text-sm md:text-base text-[#2A2A2A] mt-2"
        >
          {OFFER_BANNER_TEXT} on all products. Limited time offer!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 mt-4"
        >
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
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="hidden sm:block text-xs text-[#2A2A2A] mt-2 tracking-wider"
        >
          DAYS : HOURS : MINUTES : SECONDS
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
          onClick={handleShopNow}
          className="mt-6 px-8 py-3.5 bg-black text-white text-sm font-medium tracking-wider hover:bg-[#2A2A2A] transition-colors duration-200 active:scale-[0.98]"
        >
          SHOP NOW
        </motion.button>
      </div>
    </section>
  );
}
