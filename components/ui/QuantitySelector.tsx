"use client";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: { button: "w-8 h-8", display: "w-10 h-8 text-sm", icon: "w-3 h-3" },
  md: { button: "w-10 h-10", display: "w-12 h-10 text-sm", icon: "w-4 h-4" },
  lg: { button: "w-12 h-12", display: "w-16 h-12 text-base", icon: "w-5 h-5" },
};

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 10,
  size = "md",
  className = "",
}: QuantitySelectorProps) {
  const styles = sizeStyles[size];
  const canDecrease = quantity > min;
  const canIncrease = quantity < max;

  return (
    <div className={`inline-flex items-center border border-[#e5e5e5] bg-white ${className}`}>
      <button
        onClick={onDecrease}
        disabled={!canDecrease}
        className={`${styles.button} flex items-center justify-center transition-colors ${
          canDecrease
            ? "text-[#666] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]"
            : "text-[#ccc] cursor-not-allowed"
        }`}
        aria-label="Decrease quantity"
      >
        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <span className={`${styles.display} flex items-center justify-center font-medium text-[#1a1a1a] border-x border-[#e5e5e5]`}>
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        disabled={!canIncrease}
        className={`${styles.button} flex items-center justify-center transition-colors ${
          canIncrease
            ? "text-[#666] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]"
            : "text-[#ccc] cursor-not-allowed"
        }`}
        aria-label="Increase quantity"
      >
        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

export default QuantitySelector;
