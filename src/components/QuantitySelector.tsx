interface QuantitySelectorProps {
  quantity: number;
  onChange: (qty: number) => void;
  compact?: boolean;
}

export function QuantitySelector({ quantity, onChange, compact = false }: QuantitySelectorProps) {
  const size = compact ? "w-8 h-8" : "w-12 h-12";
  const textSize = compact ? "text-sm" : "text-base";
  const btnText = compact ? "text-base" : "text-xl";

  return (
    <div className="flex items-center">
      <button
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= 1}
        className={`${size} flex items-center justify-center border border-black bg-white text-black font-light ${btnText} transition-opacity disabled:opacity-30 disabled:pointer-events-none hover:bg-[#F3F4F6] transition-colors duration-150`}
        type="button"
      >
        -
      </button>
      <span className={`${size} flex items-center justify-center border-t border-b border-black bg-white ${textSize} font-semibold min-w-[48px]`}>
        {quantity}
      </span>
      <button
        onClick={() => onChange(quantity + 1)}
        className={`${size} flex items-center justify-center border border-black bg-white text-black font-light ${btnText} hover:bg-[#F3F4F6] transition-colors duration-150`}
        type="button"
      >
        +
      </button>
    </div>
  );
}
