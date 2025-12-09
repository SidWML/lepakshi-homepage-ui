"use client";

type BadgeVariant =
  | "bestseller"
  | "new"
  | "popular"
  | "premium"
  | "eco"
  | "organic"
  | "sale"
  | "discount"
  | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  bestseller: "bg-[#c9a227] text-white",
  new: "bg-[#1a1a1a] text-white",
  popular: "bg-[#7cb69d] text-white",
  premium: "bg-gradient-to-r from-[#c9a227] to-[#f7d794] text-white",
  eco: "bg-[#596C45] text-white",
  organic: "bg-[#596C45] text-white",
  sale: "bg-[#d32f2f] text-white",
  discount: "bg-[#1a1a1a] text-white",
  default: "bg-white text-[#1a1a1a] border border-[#e5e0d5]",
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-block px-2.5 py-1
        text-[10px] font-medium tracking-wider
        ${variantStyles[variant]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}

// Helper to get variant from tag string
export function getTagVariant(tag: string): BadgeVariant {
  const tagLower = tag.toLowerCase();
  if (tagLower === "bestseller") return "bestseller";
  if (tagLower === "new") return "new";
  if (tagLower === "popular") return "popular";
  if (tagLower === "premium") return "premium";
  if (tagLower === "eco-friendly" || tagLower === "eco") return "eco";
  if (tagLower === "organic") return "organic";
  if (tagLower === "sale") return "sale";
  return "default";
}

// Discount Badge Component
interface DiscountBadgeProps {
  percentage: number;
  className?: string;
}

export function DiscountBadge({ percentage, className = "" }: DiscountBadgeProps) {
  if (percentage <= 0) return null;

  return (
    <span
      className={`
        inline-block px-2 py-1
        bg-[#1a1a1a] text-white
        text-xs font-medium
        ${className}
      `.trim()}
    >
      -{percentage}%
    </span>
  );
}

// Stock Badge Component
interface StockBadgeProps {
  inStock: boolean;
  className?: string;
}

export function StockBadge({ inStock, className = "" }: StockBadgeProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`w-2 h-2 rounded-full ${inStock ? "bg-[#2e7d32]" : "bg-[#d32f2f]"}`}
      />
      <span
        className={`text-sm font-medium ${inStock ? "text-[#2e7d32]" : "text-[#d32f2f]"}`}
      >
        {inStock ? "In Stock" : "Out of Stock"}
      </span>
    </div>
  );
}

export default Badge;
