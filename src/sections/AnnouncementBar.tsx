import { X } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useCountdown } from "@/hooks/useCountdown";
import { useMemo } from "react";
import { OFFER_BANNER_TEXT, OFFER_LABEL, getOfferEndDate } from "@/lib/offer";

export function AnnouncementBar() {
  const visible = useUIStore((s) => s.announcementVisible);
  const dismiss = useUIStore((s) => s.dismissAnnouncement);

  const targetDate = useMemo(() => getOfferEndDate(), []);
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    visible ? (
      <div className="relative bg-[#F3F4F6] border-b border-[#e5e7eb]" style={{ zIndex: 100 }}>
        <div className="flex items-center justify-between min-h-10 py-1 px-3 md:px-4 max-w-[1440px] mx-auto">
          {/* Left spacer for balance */}
          <div className="w-4 hidden md:block" />

          {/* Center content */}
          <div className="flex items-center gap-2 md:gap-4 overflow-hidden min-w-0">
            <span className="bg-[#F2A93B] text-black text-[10px] md:text-xs font-semibold tracking-widest px-2 py-0.5 whitespace-nowrap">
              {OFFER_LABEL}
            </span>
            <span className="text-[10px] md:text-xs font-semibold text-[#F2A93B] tracking-wide whitespace-nowrap hidden sm:inline">
              EID UL ADHA SALE — {OFFER_BANNER_TEXT}
            </span>
            <span className="text-[10px] md:text-xs font-semibold text-[#F2A93B] tracking-wide whitespace-nowrap sm:hidden truncate">
              {OFFER_BANNER_TEXT}
            </span>
            <span className="text-[#2A2A2A] text-xs hidden md:inline">—</span>
            <span className="hidden md:flex items-center gap-1 text-xs font-bold text-black">
              <span className="bg-white px-1.5 py-0.5">{pad(days)}</span>
              <span className="text-[#2A2A2A] mx-0.5">:</span>
              <span className="bg-white px-1.5 py-0.5">{pad(hours)}</span>
              <span className="text-[#2A2A2A] mx-0.5">:</span>
              <span className="bg-white px-1.5 py-0.5">{pad(minutes)}</span>
              <span className="text-[#2A2A2A] mx-0.5">:</span>
              <span className="bg-white px-1.5 py-0.5">{pad(seconds)}</span>
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={dismiss}
            className="text-[#2A2A2A] hover:text-black transition-colors duration-150 p-1 flex-shrink-0"
            aria-label="Close announcement"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    ) : null
  );
}
