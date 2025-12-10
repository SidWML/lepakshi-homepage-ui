"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import {
  Breadcrumb,
  Footer,
  ProductCard,
  StarRating,
  Badge,
  getTagVariant,
} from "@/components/ui";
import {
  getCategoryUrl,
  getSubcategoryUrl,
  type Product,
  type Category,
  type Subcategory
} from "@/lib/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

export interface ProductDetailContentProps {
  product: Product;
  parentGroup: { name: string; slug: string };
  category: Category;
  subcategory: Subcategory;
  relatedProducts: Product[];
}

// Accordion Component
const Accordion = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#e5e5e5]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-medium text-[#1a1a1a]">{title}</span>
        <motion.svg
          className="w-5 h-5 text-[#666]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Image Zoom Modal Component
const ImageZoomModal = ({
  images,
  activeIndex,
  onClose,
  onChangeIndex
}: {
  images: string[];
  activeIndex: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.min(Math.max(1, prev + delta), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    resetZoom();
    onChangeIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  };

  const handleNext = () => {
    resetZoom();
    onChangeIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Zoom Controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
        <button
          onClick={(e) => { e.stopPropagation(); setScale(prev => Math.max(1, prev - 0.5)); }}
          className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="text-white text-sm min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
        <button
          onClick={(e) => { e.stopPropagation(); setScale(prev => Math.min(3, prev + 0.5)); }}
          className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        {scale > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); resetZoom(); }}
            className="ml-2 px-3 py-1 text-white text-xs bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Main Image */}
      <div
        className="relative max-w-[90vw] max-h-[80vh] overflow-hidden cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <motion.div
          animate={{ scale, x: position.x, y: position.y }}
          transition={{ type: "tween", duration: 0.1 }}
          className="select-none"
        >
          <Image
            src={images[activeIndex]}
            alt="Product zoom"
            width={800}
            height={800}
            className="object-contain max-h-[80vh] w-auto"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); resetZoom(); onChangeIndex(index); }}
              className={`w-16 h-16 border-2 overflow-hidden transition-all ${
                activeIndex === index ? "border-white" : "border-white/30 hover:border-white/60"
              }`}
            >
              <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute bottom-4 right-4 text-white/60 text-sm">
        {activeIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
};

export default function ProductDetailContent({
  product,
  parentGroup,
  category,
  subcategory,
  relatedProducts
}: ProductDetailContentProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const { addItem, isInCart, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const productImages = product.images?.length ? product.images : [product.image];
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setQuantity(1);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <Header variant="solid" />

      {/* Main Content */}
      <main className="pt-20 bg-[#fafafa]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: parentGroup.name, href: `/${parentGroup.slug}` },
                { label: category.name, href: getCategoryUrl(category) },
                { label: subcategory.name, href: getSubcategoryUrl(category, subcategory) },
                { label: product.name },
              ]}
            />
          </div>
        </div>

        {/* Product Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left - Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div
                className="aspect-[4/5] bg-white border border-[#e5e5e5] overflow-hidden relative cursor-zoom-in group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsZoomOpen(true)}
              >
                <Image
                  src={productImages[activeImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  priority
                />

                {/* Tag */}
                {product.tag && (
                  <div className="absolute top-4 left-4">
                    <Badge variant={getTagVariant(product.tag)}>{product.tag}</Badge>
                  </div>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                  <span className="absolute top-4 right-4 px-3 py-1.5 bg-[#1a1a1a] text-white text-sm font-medium">
                    -{discount}%
                  </span>
                )}

                {/* Zoom Icon */}
                <button
                  onClick={(e) => { e.stopPropagation(); setIsZoomOpen(true); }}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all"
                >
                  <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </button>

                {/* Click to zoom hint */}
                <div className="absolute bottom-4 left-4 text-xs text-[#666] bg-white/90 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to zoom
                </div>
              </motion.div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-3">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-1 aspect-square bg-white border-2 transition-all overflow-hidden ${
                        activeImageIndex === index
                          ? "border-[#c9a227]"
                          : "border-[#e5e5e5] hover:border-[#c9a227]/50"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Product Info */}
            <div className="lg:py-4">
              {/* Category & SKU */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#c9a227] text-sm tracking-wider uppercase font-medium">{subcategory.name}</span>
                {product.sku && <span className="text-[#999] text-sm">SKU: {product.sku}</span>}
              </div>

              {/* Title */}
              <motion.h1
                className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl text-[#1a1a1a] mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {product.name}
              </motion.h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <StarRating rating={product.rating} reviews={product.reviews} size="lg" />
                <span className="text-[#c9a227] text-sm font-medium cursor-pointer hover:underline">Write a review</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-semibold text-[#1a1a1a]">Rs.{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-[#999] line-through">Rs.{product.originalPrice.toLocaleString()}</span>
                    <span className="px-3 py-1 bg-[#f0f9f0] text-[#2e7d32] text-sm font-medium rounded-full">
                      Save Rs.{(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              {product.description && (
                <p className="text-[#555] leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Availability */}
              <div className="flex items-center gap-2 mb-8">
                <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-[#2e7d32]" : "bg-red-500"}`}></span>
                <span className={`text-sm font-medium ${product.inStock ? "text-[#2e7d32]" : "text-red-500"}`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
                {inCart && (
                  <span className="text-sm text-[#666] ml-2">
                    ({cartQuantity} in cart)
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#1a1a1a] mb-3">Quantity</label>
                <div className="inline-flex items-center border border-[#e5e5e5] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-[#666] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
                    disabled={!product.inStock}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center font-medium text-[#1a1a1a] border-x border-[#e5e5e5]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-[#666] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
                    disabled={!product.inStock}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-4 font-medium tracking-wider transition-colors ${
                    product.inStock
                      ? "bg-[#1a1a1a] text-white hover:bg-[#333]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {inCart ? "ADD MORE TO CART" : "ADD TO CART"}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-14 h-14 border flex items-center justify-center transition-colors ${
                    inWishlist
                      ? "border-red-500 bg-red-50 text-red-500"
                      : "border-[#e5e5e5] hover:border-[#c9a227] hover:text-[#c9a227]"
                  }`}
                  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg className="w-6 h-6" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Buy Now */}
              <button
                disabled={!product.inStock}
                className={`w-full py-4 border-2 font-medium tracking-wider transition-all mb-8 ${
                  product.inStock
                    ? "border-[#c9a227] text-[#c9a227] hover:bg-[#c9a227] hover:text-white"
                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                BUY NOW
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-[#e5e5e5]">
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-[#c9a227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-xs text-[#666]">Authentic<br/>Handcrafted</p>
                </div>
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-[#c9a227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-xs text-[#666]">Free Shipping<br/>Above Rs.999</p>
                </div>
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-[#c9a227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-xs text-[#666]">Secure<br/>Payment</p>
                </div>
              </div>

              {/* Accordions */}
              <div className="mt-6">
                {/* Product Highlights */}
                {product.highlights && product.highlights.length > 0 && (
                  <Accordion title="Product Highlights" defaultOpen={true}>
                    <ul className="space-y-3">
                      {product.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-[#c9a227] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-[#555]">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </Accordion>
                )}

                {/* Specifications */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <Accordion title="Specifications">
                    <div className="space-y-3">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-[#f0f0f0] last:border-0">
                          <span className="text-[#666]">{key}</span>
                          <span className="text-[#1a1a1a] font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </Accordion>
                )}

                {/* Shipping & Returns */}
                <Accordion title="Shipping & Returns">
                  <div className="space-y-4 text-[#555]">
                    <div>
                      <h4 className="font-medium text-[#1a1a1a] mb-2">Shipping</h4>
                      <p className="text-sm leading-relaxed">Free shipping on orders above Rs.999. Standard delivery takes 5-7 business days. Express delivery available at checkout.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#1a1a1a] mb-2">Returns</h4>
                      <p className="text-sm leading-relaxed">Easy 7-day returns. Product must be unused and in original packaging. Please note that customized items cannot be returned.</p>
                    </div>
                  </div>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-[#fafafa] border-t border-[#e5e5e5]">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1a1a1a]">You May Also Like</h2>
                <Link href={getSubcategoryUrl(category, subcategory)} className="text-[#c9a227] hover:text-[#b8922a] text-sm font-medium flex items-center gap-2 transition-colors">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Sticky Add to Cart Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e5e5] p-4 lg:hidden z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-[#666] mb-0.5">Total Price</p>
            <p className="text-xl font-semibold text-[#1a1a1a]">Rs.{(product.price * quantity).toLocaleString()}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex-1 py-4 font-medium tracking-wider ${
              product.inStock
                ? "bg-[#1a1a1a] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <ImageZoomModal
            images={productImages}
            activeIndex={activeImageIndex}
            onClose={() => setIsZoomOpen(false)}
            onChangeIndex={setActiveImageIndex}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
