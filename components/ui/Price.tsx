"use client";

interface PriceProps {
  price: number;
  originalPrice?: number | null;
  size?: "sm" | "md" | "lg" | "xl";
  showSavings?: boolean;
  showPercentage?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: { current: "text-sm font-semibold", original: "text-xs", savings: "text-xs" },
  md: { current: "text-base font-semibold", original: "text-sm", savings: "text-sm" },
  lg: { current: "text-xl font-semibold", original: "text-base", savings: "text-sm" },
  xl: { current: "text-3xl font-semibold", original: "text-xl", savings: "text-sm" },
};

export function Price({
  price,
  originalPrice,
  size = "md",
  showSavings = false,
  showPercentage = false,
  className = "",
}: PriceProps) {
  const styles = sizeStyles[size];
  const hasDiscount = originalPrice && originalPrice > price;
  const savingsAmount = hasDiscount ? originalPrice - price : 0;
  const discountPercentage = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  return (
    <div className={`flex flex-wrap items-baseline gap-2 ${className}`}>
      <span className={`${styles.current} text-[#1a1a1a]`}>
        Rs.{price.toLocaleString()}
      </span>

      {hasDiscount && (
        <>
          <span className={`${styles.original} text-[#999] line-through`}>
            Rs.{originalPrice.toLocaleString()}
          </span>

          {showPercentage && (
            <span className={`${styles.savings} text-[#596C45] font-medium`}>
              {discountPercentage}% OFF
            </span>
          )}

          {showSavings && (
            <span className={`${styles.savings} px-3 py-1 bg-[#f0f9f0] text-[#2e7d32] font-medium rounded-full`}>
              Save Rs.{savingsAmount.toLocaleString()}
            </span>
          )}
        </>
      )}
    </div>
  );
}

// Compact Price for Cards
interface PriceCompactProps {
  price: number;
  originalPrice?: number | null;
  className?: string;
}

export function PriceCompact({ price, originalPrice, className = "" }: PriceCompactProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-semibold text-[#1a1a1a]">Rs.{price.toLocaleString()}</span>
      {originalPrice && originalPrice > price && (
        <span className="text-sm text-[#999] line-through">
          Rs.{originalPrice.toLocaleString()}
        </span>
      )}
    </div>
  );
}

export default Price;
