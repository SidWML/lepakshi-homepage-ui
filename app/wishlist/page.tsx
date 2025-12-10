"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import {
  Button,
  StarRating,
  Badge,
  getTagVariant,
  DiscountBadge,
  StockBadge,
  PriceCompact,
  BreadcrumbBar,
  Toast,
  useToast,
  EmptyState,
  Footer,
} from "@/components/ui";

// ============================================
// SAMPLE DATA
// ============================================

const initialWishlistItems = [
  {
    id: 1,
    name: "Srikalahasti Kalamkari Saree",
    price: 15500,
    originalPrice: 18000,
    tag: "Bestseller",
    category: "Textiles & Weaves",
    rating: 4.9,
    reviews: 156,
    inStock: true,
  },
  {
    id: 2,
    name: "Hand-painted Kalamkari Dupatta",
    price: 4990,
    originalPrice: null,
    tag: "New",
    category: "Textiles",
    rating: 4.7,
    reviews: 43,
    inStock: true,
  },
  {
    id: 3,
    name: "Pembarthi Brass Diya Set",
    price: 6900,
    originalPrice: null,
    tag: null,
    category: "Metal Crafts",
    rating: 4.8,
    reviews: 89,
    inStock: true,
  },
  {
    id: 4,
    name: "Tanjore Painting - Lakshmi",
    price: 12500,
    originalPrice: 14000,
    tag: "Premium",
    category: "Paintings",
    rating: 4.9,
    reviews: 67,
    inStock: false,
  },
  {
    id: 5,
    name: "Bidri Silver Inlay Vase",
    price: 8500,
    originalPrice: 9500,
    tag: null,
    category: "Metal Crafts",
    rating: 4.6,
    reviews: 34,
    inStock: true,
  },
];

// ============================================
// COMPONENTS
// ============================================

// Wishlist Item Component
const WishlistItem = ({
  item,
  onRemove,
  onMoveToCart,
}: {
  item: typeof initialWishlistItems[0];
  onRemove: (id: number) => void;
  onMoveToCart: (id: number) => void;
}) => {
  const discount = item.originalPrice
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-2 border-[#e5d5a8] rounded-lg overflow-hidden hover:shadow-xl hover:border-[#c9a227] transition-all group"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className="sm:w-48 md:w-56 flex-shrink-0">
          <Link href={`/products/${item.id}`}>
            <div className="aspect-[4/5] sm:aspect-square bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe3] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#c9a227]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              </div>

              {item.tag && (
                <div className="absolute top-3 left-3">
                  <Badge variant={getTagVariant(item.tag)}>{item.tag}</Badge>
                </div>
              )}

              {discount > 0 && (
                <div className="absolute top-3 right-3">
                  <DiscountBadge percentage={discount} />
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col">
          <div className="flex-1">
            <p className="text-[#c9a227] text-xs tracking-wider uppercase mb-1">{item.category}</p>

            <Link href={`/products/${item.id}`}>
              <h3 className="font-medium text-[#1a1a1a] text-lg mb-2 hover:text-[#c9a227] transition-colors">
                {item.name}
              </h3>
            </Link>

            <div className="mb-3">
              <StarRating rating={item.rating} reviews={item.reviews} />
            </div>

            <PriceCompact price={item.price} originalPrice={item.originalPrice} className="mb-4" />

            <StockBadge inStock={item.inStock} className="mb-4" />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={item.inStock ? "primary" : "secondary"}
              onClick={() => onMoveToCart(item.id)}
              disabled={!item.inStock}
              className="flex-1 sm:flex-none"
            >
              {item.inStock ? "ADD TO CART" : "OUT OF STOCK"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => onRemove(item.id)}
              className="hover:border-[#d32f2f] hover:text-[#d32f2f]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline">Remove</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);
  const { message, variant, showToast } = useToast();

  const handleRemove = (id: number) => {
    const item = wishlistItems.find(i => i.id === id);
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    if (item) {
      showToast(`${item.name} removed from wishlist`);
    }
  };

  const handleMoveToCart = (id: number) => {
    const item = wishlistItems.find(i => i.id === id);
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    if (item) {
      showToast(`${item.name} added to cart`);
    }
  };

  const handleClearAll = () => {
    setWishlistItems([]);
    showToast("Wishlist cleared");
  };

  return (
    <>
      <Header variant="solid" />

      <main className="pt-20 min-h-screen bg-gradient-to-b from-[#f8f6f3] via-[#fafafa] to-white">
        <BreadcrumbBar items={[
          { label: "Home", href: "/" },
          { label: "Wishlist" },
        ]} />

        {/* Page Header with pattern */}
        <div className="bg-gradient-to-br from-white via-[#fafafa] to-[#f8f6f3] border-b border-[#e5e5e5] relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#c9a227] rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Heart Icon */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a227] to-[#b8922a] flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl text-[#1a1a1a] mb-1">
                    My Wishlist
                  </h1>
                  <p className="text-[#666]">
                    {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
                  </p>
                </div>
              </div>
              {wishlistItems.length > 0 && (
                <Button variant="ghost" onClick={handleClearAll} className="text-[#666] hover:text-[#d32f2f]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Wishlist Content */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
          {wishlistItems.length > 0 ? (
            <div className="max-w-5xl mx-auto">
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {wishlistItems.map((item) => (
                    <WishlistItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                      onMoveToCart={handleMoveToCart}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <EmptyState type="wishlist" />
          )}
        </section>
      </main>

      <Toast message={message} variant={variant} />
      <Footer />
    </>
  );
}
