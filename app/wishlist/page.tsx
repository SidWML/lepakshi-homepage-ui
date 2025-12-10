"use client";

import Link from "next/link";
import Image from "next/image";
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
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { getProductUrl, type Product } from "@/lib/data/products";

// ============================================
// COMPONENTS
// ============================================

// Wishlist Item Component
const WishlistItem = ({
  item,
  onRemove,
  onMoveToCart,
}: {
  item: { productId: number; product: Product; addedAt: number };
  onRemove: (id: number) => void;
  onMoveToCart: (product: Product) => void;
}) => {
  const { product } = item;
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const productUrl = getProductUrl(product);

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
        <div className="sm:w-48 md:w-56 flex-shrink-0 self-stretch">
          <Link href={productUrl} className="block h-full">
            <div className="aspect-square sm:aspect-auto sm:h-full bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe3] relative">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes=""
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#c9a227]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                </div>
              )}

              {product.tag && (
                <div className="absolute top-3 left-3">
                  <Badge variant={getTagVariant(product.tag)}>{product.tag}</Badge>
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
            <p className="text-[#c9a227] text-xs tracking-wider uppercase mb-1">
              {product.subcategoryId.replace(/-/g, " ")}
            </p>

            <Link href={productUrl}>
              <h3 className="font-medium text-[#1a1a1a] text-lg mb-2 hover:text-[#c9a227] transition-colors">
                {product.name}
              </h3>
            </Link>

            <div className="mb-3">
              <StarRating rating={product.rating} reviews={product.reviews} />
            </div>

            <PriceCompact price={product.price} originalPrice={product.originalPrice} className="mb-4" />

            <StockBadge inStock={product.inStock} className="mb-4" />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={product.inStock ? "primary" : "secondary"}
              onClick={() => onMoveToCart(product)}
              disabled={!product.inStock}
              className="flex-1 sm:flex-none"
            >
              {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => onRemove(product.id)}
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
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { message, variant, showToast } = useToast();

  const handleRemove = (id: number) => {
    const item = items.find(i => i.productId === id);
    removeItem(id);
    if (item) {
      showToast(`${item.product.name} removed from wishlist`);
    }
  };

  const handleMoveToCart = (product: Product) => {
    addToCart(product);
    removeItem(product.id);
    showToast(`${product.name} added to cart`);
  };

  const handleClearAll = () => {
    clearWishlist();
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
                    {items.length} {items.length === 1 ? "item" : "items"} saved for later
                  </p>
                </div>
              </div>
              {items.length > 0 && (
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
          {items.length > 0 ? (
            <div className="max-w-5xl mx-auto">
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <WishlistItem
                      key={item.productId}
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
