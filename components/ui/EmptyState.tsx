"use client";

import { motion } from "framer-motion";
import { Button } from "./Button";

type EmptyStateType = "cart" | "wishlist" | "search" | "orders" | "custom";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const defaultContent: Record<EmptyStateType, { title: string; description: string; actionLabel: string; actionHref: string; icon: React.ReactNode }> = {
  cart: {
    title: "Your Cart is Empty",
    description: "Looks like you haven't added any handcrafted treasures to your cart yet.",
    actionLabel: "START SHOPPING",
    actionHref: "/products",
    icon: (
      <svg className="w-12 h-12 text-[#c9a227]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  wishlist: {
    title: "Your Wishlist is Empty",
    description: "Save your favorite handcrafted treasures here and come back to them anytime.",
    actionLabel: "EXPLORE PRODUCTS",
    actionHref: "/products",
    icon: (
      <svg className="w-12 h-12 text-[#c9a227]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  search: {
    title: "No Products Found",
    description: "Try adjusting your filters to find what you're looking for.",
    actionLabel: "CLEAR ALL FILTERS",
    actionHref: "/products",
    icon: (
      <svg className="w-12 h-12 text-[#c9a227]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  orders: {
    title: "No Orders Yet",
    description: "You haven't placed any orders yet. Start shopping to see your orders here.",
    actionLabel: "BROWSE PRODUCTS",
    actionHref: "/products",
    icon: (
      <svg className="w-12 h-12 text-[#c9a227]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  custom: {
    title: "Nothing Here",
    description: "This section is empty.",
    actionLabel: "GO BACK",
    actionHref: "/",
    icon: (
      <svg className="w-12 h-12 text-[#c9a227]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
  },
};

export function EmptyState({
  type = "custom",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon,
  className = "",
}: EmptyStateProps) {
  const defaults = defaultContent[type];

  const finalTitle = title || defaults.title;
  const finalDescription = description || defaults.description;
  const finalActionLabel = actionLabel || defaults.actionLabel;
  const finalActionHref = actionHref || defaults.actionHref;
  const finalIcon = icon || defaults.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-16 ${className}`}
    >
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#f8f6f3] flex items-center justify-center">
        {finalIcon}
      </div>

      <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1a1a1a] mb-3">
        {finalTitle}
      </h2>

      <p className="text-[#666] mb-8 max-w-md mx-auto">
        {finalDescription}
      </p>

      {onAction ? (
        <Button variant="primary" size="lg" onClick={onAction}>
          {finalActionLabel}
        </Button>
      ) : (
        <Button variant="primary" size="lg" href={finalActionHref}>
          {finalActionLabel}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Button>
      )}
    </motion.div>
  );
}

export default EmptyState;
