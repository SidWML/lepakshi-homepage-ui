"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { StarRating } from "./StarRating";
import { Badge, getTagVariant, DiscountBadge } from "./Badge";
import { PriceCompact } from "./Price";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProductUrl, type Product } from "@/lib/data/products";

// ============================================
// TYPES
// ============================================

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

// ============================================
// WISHLIST BUTTON
// ============================================

const WishlistButton = ({
  isActive,
  onClick,
  className = ""
}: {
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick?.();
    }}
    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
      isActive
        ? "bg-red-500 text-white"
        : "bg-white hover:bg-[#c9a227] hover:text-white"
    } ${className}`}
    aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
  >
    <svg
      className="w-4 h-4"
      fill={isActive ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  </button>
);

// ============================================
// ADD TO CART BUTTON
// ============================================

const AddToCartButton = ({
  onClick,
  variant = "overlay",
  inCart = false
}: {
  onClick?: () => void;
  variant?: "overlay" | "inline";
  inCart?: boolean;
}) => {
  if (variant === "overlay") {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick?.();
        }}
        className={`absolute bottom-0 left-0 right-0 py-3 text-white text-xs font-medium tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-full group-hover:translate-y-0 z-10 ${
          inCart ? "bg-green-600 hover:bg-green-700" : "bg-[#c9a227] hover:bg-[#b8922a]"
        }`}
      >
        {inCart ? "ADD MORE" : "ADD TO CART"}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={`px-6 py-2.5 text-white text-sm font-medium tracking-wider transition-colors ${
        inCart ? "bg-green-600 hover:bg-green-700" : "bg-[#c9a227] hover:bg-[#b8922a]"
      }`}
    >
      {inCart ? "ADD MORE" : "ADD TO CART"}
    </button>
  );
};

// ============================================
// GRID VIEW CARD
// ============================================

export function ProductCardGrid({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const productUrl = getProductUrl(product);
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
    >
      <Link href={productUrl} className="block">
        {/* Product Image */}
        <div className="aspect-[3/4] bg-[#f7f5f0] mb-4 relative overflow-hidden border border-[#e5e0d5] group-hover:border-[#c9a227] transition-all duration-300 group-hover:shadow-lg">
          {/* Image */}
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#f0ebe3] to-[#e5dfd4] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#c9a227]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            </div>
          )}

          {/* Tag */}
          {product.tag && (
            <div className="absolute top-3 left-3">
              <Badge variant={getTagVariant(product.tag)}>{product.tag}</Badge>
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 right-3">
              <DiscountBadge percentage={discount} />
            </div>
          )}

          {/* Wishlist */}
          <div className={`absolute ${discount > 0 ? "top-12" : "top-3"} right-3 opacity-0 group-hover:opacity-100 transition-all duration-300`}>
            <WishlistButton
              isActive={inWishlist}
              onClick={() => toggleWishlist(product)}
            />
          </div>

          {/* Quick Add */}
          <AddToCartButton
            onClick={() => addItem(product)}
            inCart={inCart}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          <p className="text-[#c9a227] text-xs tracking-wider uppercase">{product.subcategoryId.replace(/-/g, " ")}</p>
          <h3 className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#c9a227] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <StarRating rating={product.rating} reviews={product.reviews} />
          <PriceCompact price={product.price} originalPrice={product.originalPrice} className="pt-1" />
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// LIST VIEW CARD
// ============================================

export function ProductCardList({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const productUrl = getProductUrl(product);
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div
      className="group bg-white border border-[#e5e0d5] hover:border-[#c9a227] transition-all duration-300 hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
    >
      <Link href={productUrl} className="flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className="sm:w-48 md:w-56 lg:w-64 flex-shrink-0">
          <div className="aspect-[4/3] sm:aspect-square bg-[#f7f5f0] relative overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#f0ebe3] to-[#e5dfd4] flex items-center justify-center">
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
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="text-[#c9a227] text-xs tracking-wider uppercase mb-1">
                  {product.subcategoryId.replace(/-/g, " ")}
                </p>
                <h3 className="text-lg font-medium text-[#1a1a1a] group-hover:text-[#c9a227] transition-colors leading-snug">
                  {product.name}
                </h3>
              </div>
              <WishlistButton
                isActive={inWishlist}
                onClick={() => toggleWishlist(product)}
                className="opacity-100 bg-[#f7f5f0]"
              />
            </div>

            <div className="mb-3">
              <StarRating rating={product.rating} reviews={product.reviews} />
            </div>

            {product.description && (
              <p className="text-sm text-[#666] line-clamp-2 hidden md:block">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e5e0d5]">
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold text-[#1a1a1a]">
                Rs.{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="line-through text-[#999]">
                    Rs.{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-[#596C45] font-medium">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            <AddToCartButton
              onClick={() => addItem(product)}
              variant="inline"
              inCart={inCart}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// UNIFIED EXPORT
// ============================================

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  if (variant === "list") {
    return <ProductCardList product={product} />;
  }
  return <ProductCardGrid product={product} />;
}

export default ProductCard;
