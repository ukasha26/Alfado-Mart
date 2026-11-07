import {
  calculateTieredLineTotal,
} from "@/lib/pricing";
import { Truck } from "lucide-react";

interface TieredDiscountProps {
  quantity: number;
  unitPrice: number;
  onSelectTier: (quantity: number) => void;
  hasFreeBaseDelivery?: boolean;
}

const TIERS = [
  { minQty: 1, label: "Pack of 1", discount: 0, description: "Regular sale price" },
  { minQty: 2, label: "Pack of 2", discount: 10, description: "10% off + Free Delivery" },
  { minQty: 3, label: "Pack of 3", discount: 15, description: "15% off + Free Delivery" },
] as const;

const formatPrice = (price: number) => `Rs. ${price.toLocaleString("en-PK")}`;

function getDeliveryLabel(): string {
  return "Free Delivery";
}

export function TieredDiscount({
  quantity,
  unitPrice,
  onSelectTier,
}: TieredDiscountProps) {
  const activeDeliveryLabel = getDeliveryLabel();

  return (
    <section
      aria-label="Tiered bundle discount offers"
      className="mt-6 overflow-hidden rounded-xl border-2 border-[#F2A93B] bg-gradient-to-br from-[#FFF9EE] to-white p-4"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex rounded-full bg-[#F2A93B] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">
          Bundle Offer
        </span>
        <h2 className="text-sm font-semibold text-black">Tiered Discount</h2>
      </div>

      <ul className="mt-3 space-y-2" role="listbox" aria-label="Select a bundle option">
        {TIERS.map((tier) => {
          const isActive =
            tier.minQty === 3 ? quantity >= 3 : quantity === tier.minQty;

          const lineTotal = calculateTieredLineTotal(unitPrice, tier.minQty);
          const tierGrandTotal = lineTotal;
          const deliveryLabel = getDeliveryLabel();
          const showDeliveryIcon = true;

          return (
            <li key={tier.label} role="presentation">
              <div
                role="option"
                aria-selected={isActive}
                tabIndex={0}
                onClick={() => onSelectTier(tier.minQty)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectTier(tier.minQty);
                  }
                }}
                className={`flex cursor-pointer flex-col rounded-xl border px-3 py-2.5 text-sm transition-all duration-200 hover:border-orange-400 ${
                  isActive
                    ? "border-black bg-black text-white shadow-md"
                    : "border-[#F3F4F6] bg-white text-[#2A2A2A] hover:bg-[#FFFBF5]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${isActive ? "text-white" : "text-black"}`}>
                      {tier.label}
                    </p>
                    <p className={`text-xs ${isActive ? "text-white/80" : "text-[#666]"}`}>
                      {tier.description}
                    </p>
                  </div>
                  <div className="text-right">
                    {tier.discount > 0 && (
                      <span className="mr-2 text-xs font-bold text-[#F2A93B]">
                        -{tier.discount}%
                      </span>
                    )}
                    <span className={`font-semibold ${isActive ? "text-white" : "text-black"}`}>
                      {formatPrice(tierGrandTotal)}
                    </span>
                  </div>
                </div>
                <p
                  className={`mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium ${
                    isActive ? "text-[#86EFAC]" : "text-[#16A34A]"
                  }`}
                >
                  {showDeliveryIcon ? <Truck size={12} className="shrink-0" /> : null}
                  {deliveryLabel}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-center text-xs font-medium text-[#2A2A2A]">
        Selected: {activeDeliveryLabel}
      </p>
    </section>
  );
}
