"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import {
  Button,
  QuantitySelector,
  PriceCompact,
  DiscountBadge,
  BreadcrumbBar,
  Toast,
  useToast,
  EmptyState,
  Footer,
} from "@/components/ui";
import { useCart } from "@/contexts/CartContext";
import { getProductUrl, getFeaturedProducts } from "@/lib/data/products";
import ProductCard from "@/components/ui/ProductCard";

// ============================================
// COMPONENTS
// ============================================

// Cart Item Component
const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: {
    productId: number;
    product: {
      id: number;
      name: string;
      price: number;
      originalPrice?: number;
      image: string;
      subcategoryId: string;
      categoryId: string;
      slug: string;
      tag?: string;
      rating: number;
      reviews: number;
      inStock: boolean;
      sku?: string;
    };
    quantity: number;
  };
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}) => {
  const { product, quantity } = item;
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
      <div className="flex flex-row">
        {/* Product Image */}
        <div className="w-28 sm:w-40 md:w-48 shrink-0">
          <Link href={productUrl}>
            <div className="aspect-square bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe3] relative">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 160px, 192px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#c9a227]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-2 right-2">
                  <DiscountBadge percentage={discount} />
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col min-w-0">
          <div className="flex-1">
            {/* Category & SKU */}
            <div className="flex items-center justify-between mb-1">
              <p className="text-[#c9a227] text-[10px] sm:text-xs tracking-wider uppercase truncate">
                {product.subcategoryId.replace(/-/g, " ")}
              </p>
              {product.sku && (
                <span className="text-[10px] sm:text-xs text-[#999] hidden sm:block">SKU: {product.sku}</span>
              )}
            </div>

            {/* Title */}
            <Link href={productUrl}>
              <h3 className="font-medium text-sm sm:text-base text-[#1a1a1a] mb-2 sm:mb-3 hover:text-[#c9a227] transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>

            {/* Price */}
            <PriceCompact price={product.price} originalPrice={product.originalPrice} className="mb-3 sm:mb-4" />
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => onUpdateQuantity(product.id, quantity + 1)}
              onDecrease={() => onUpdateQuantity(product.id, quantity - 1)}
              size="sm"
            />

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Item Total */}
              <span className="font-semibold text-sm sm:text-base text-[#1a1a1a]">
                Rs.{(product.price * quantity).toLocaleString()}
              </span>

              {/* Remove Button */}
              <button
                onClick={() => onRemove(product.id)}
                className="p-1.5 sm:p-2 text-[#999] hover:text-[#d32f2f] transition-colors"
                title="Remove item"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Promo Code Component
const PromoCode = ({
  onApply,
}: {
  onApply: (code: string) => boolean;
}) => {
  const [code, setCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");

  const handleApply = () => {
    if (!code.trim()) return;
    setIsApplying(true);
    setError("");

    setTimeout(() => {
      const success = onApply(code);
      if (!success) {
        setError("Invalid promo code");
      } else {
        setCode("");
      }
      setIsApplying(false);
    }, 500);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError("");
          }}
          placeholder="Enter promo code"
          className="w-full sm:flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-[#e5e5e5] bg-white text-sm focus:outline-none focus:border-[#c9a227] transition-colors"
        />
        <Button
          variant="primary"
          onClick={handleApply}
          disabled={!code.trim() || isApplying}
          loading={isApplying}
          className="w-full sm:w-auto"
        >
          APPLY
        </Button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <p className="text-xs text-[#999] mt-2">Try: WELCOME10, CRAFT20, or FESTIVE15</p>
    </div>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    applyPromo,
    removePromo,
    promoCode,
    promoDiscount,
    subtotal,
    savings,
    shipping,
    total,
    itemCount,
  } = useCart();
  const { message, variant, showToast } = useToast();

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1 || quantity > 10) return;
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: number) => {
    const item = items.find(i => i.productId === id);
    removeItem(id);
    if (item) {
      showToast(`${item.product.name} removed from cart`);
    }
  };

  const handleApplyPromo = (code: string): boolean => {
    const success = applyPromo(code);
    if (success) {
      showToast(`Promo code "${code}" applied successfully!`);
    }
    return success;
  };

  const handleRemovePromo = () => {
    removePromo();
    showToast("Promo code removed");
  };

  // Free shipping threshold
  const freeShippingRemaining = subtotal < 999 ? 999 - subtotal : 0;

  // Related products
  const relatedProducts = getFeaturedProducts().slice(0, 4);

  return (
    <>
      <Header variant="solid" />

      <main className="pt-20 pb-24 lg:pb-0 min-h-screen bg-gradient-to-b from-[#f8f6f3] via-[#fafafa] to-white">
        <BreadcrumbBar items={[
          { label: "Home", href: "/" },
          { label: "Shopping Cart" },
        ]} />

        {/* Page Header with pattern */}
        <div className="bg-gradient-to-br from-white via-[#fafafa] to-[#f8f6f3] border-b border-[#e5e5e5] relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#c9a227] rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 relative z-10">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Shopping Bag Icon */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#c9a227] to-[#b8922a] flex items-center justify-center shadow-lg flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl text-[#1a1a1a] mb-0.5 sm:mb-1">
                  Shopping Cart
                </h1>
                <p className="text-[#666] text-sm sm:text-base">
                  {itemCount} {itemCount === 1 ? "item" : "items"} ready for checkout
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
          {items.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {/* Free Shipping Progress */}
                {freeShippingRemaining > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#f0f9f0] border border-[#c8e6c9] rounded-lg p-4 flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-[#2e7d32] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-[#2e7d32]">
                        Add <span className="font-semibold">Rs.{freeShippingRemaining.toLocaleString()}</span> more to get <span className="font-semibold">FREE shipping!</span>
                      </p>
                      <div className="mt-2 h-1.5 bg-[#c8e6c9] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#2e7d32] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Items List */}
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemove}
                    />
                  ))}
                </AnimatePresence>

                {/* Continue Shopping */}
                <div className="pt-4">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[#666] hover:text-[#c9a227] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border-2 border-[#e5d5a8] rounded-lg overflow-hidden sticky top-28 shadow-lg">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#f3e6c6] to-[#f8f0d6] px-6 py-5 border-b border-[#e5d5a8]">
                    <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#1a1a1a] flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#c9a227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Order Summary
                    </h2>
                  </div>

                  {/* Summary Details */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#666]">Subtotal ({itemCount} items)</span>
                        <span className="text-[#1a1a1a] font-medium">Rs.{subtotal.toLocaleString()}</span>
                      </div>

                      {savings > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#666]">Product Savings</span>
                          <span className="text-[#2e7d32] font-medium">-Rs.{savings.toLocaleString()}</span>
                        </div>
                      )}

                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-[#666]">Promo ({promoCode})</span>
                            <button
                              onClick={handleRemovePromo}
                              className="text-[#999] hover:text-[#d32f2f]"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <span className="text-[#2e7d32] font-medium">-Rs.{promoDiscount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-[#666]">Shipping</span>
                        <span className={`font-medium ${shipping === 0 ? "text-[#2e7d32]" : "text-[#1a1a1a]"}`}>
                          {shipping === 0 ? "FREE" : `Rs.${shipping}`}
                        </span>
                      </div>
                    </div>

                    {/* Promo Code */}
                    {!promoCode && (
                      <div className="mb-6 pb-6 border-b border-[#e5e5e5]">
                        <p className="text-sm font-medium text-[#1a1a1a] mb-3">Have a promo code?</p>
                        <PromoCode onApply={handleApplyPromo} />
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between items-baseline py-4 border-t border-[#e5e5e5]">
                      <span className="text-lg font-medium text-[#1a1a1a]">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-semibold text-[#1a1a1a]">Rs.{total.toLocaleString()}</span>
                        <p className="text-xs text-[#999] mt-1">Including all taxes</p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Button variant="gold" fullWidth size="lg" className="mt-4">
                      PROCEED TO CHECKOUT
                    </Button>

                    {/* Payment Methods */}
                    <div className="mt-6 pt-6 border-t border-[#e5e5e5]">
                      <p className="text-xs text-[#999] text-center mb-3">Secure payment options</p>
                      <div className="flex justify-center gap-3">
                        <div className="w-10 h-6 bg-[#f5f5f5] rounded flex items-center justify-center">
                          <span className="text-[10px] font-bold text-[#1a1a1a]">VISA</span>
                        </div>
                        <div className="w-10 h-6 bg-[#f5f5f5] rounded flex items-center justify-center">
                          <span className="text-[10px] font-bold text-[#1a1a1a]">MC</span>
                        </div>
                        <div className="w-10 h-6 bg-[#f5f5f5] rounded flex items-center justify-center">
                          <span className="text-[10px] font-bold text-[#1a1a1a]">UPI</span>
                        </div>
                        <div className="w-10 h-6 bg-[#f5f5f5] rounded flex items-center justify-center">
                          <span className="text-[10px] font-bold text-[#1a1a1a]">NET</span>
                        </div>
                        <div className="w-10 h-6 bg-[#f5f5f5] rounded flex items-center justify-center">
                          <span className="text-[10px] font-bold text-[#1a1a1a]">COD</span>
                        </div>
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-6 h-6 text-[#c9a227] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-[10px] text-[#666]">Secure Checkout</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <svg className="w-6 h-6 text-[#c9a227] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-[10px] text-[#666]">Easy Returns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState type="cart" />
          )}
        </section>

        {/* You May Also Like */}
        {items.length > 0 && relatedProducts.length > 0 && (
          <section className="bg-gradient-to-br from-[#f8f6f3] to-white border-t-2 border-[#e5d5a8] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#c9a227] opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#c9a227] opacity-5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#b8922a] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1a1a1a]">
                  You May Also Like
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Toast message={message} variant={variant} />

      {/* Spacer for mobile sticky bar */}
      {items.length > 0 && <div className="h-20 lg:hidden" />}

      <Footer />

      {/* Sticky Checkout Bar (Mobile) */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e5e5] p-4 lg:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-[#666] mb-0.5">Total ({itemCount} items)</p>
              <p className="text-xl font-semibold text-[#1a1a1a]">Rs.{total.toLocaleString()}</p>
            </div>
            <Button variant="gold" className="flex-1">
              CHECKOUT
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
