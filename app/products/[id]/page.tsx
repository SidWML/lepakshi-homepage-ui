"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";

// ============================================
// SAMPLE DATA
// ============================================

const product = {
  id: 1,
  name: "Srikalahasti Kalamkari Saree",
  price: 15500,
  originalPrice: 18000,
  tag: "Bestseller",
  category: "Textiles & Weaves",
  craft: "Kalamkari",
  rating: 4.9,
  reviews: 156,
  sku: "KAL-SAR-001",
  availability: "In Stock",
  description: "This exquisite Kalamkari saree is a masterpiece of traditional Indian textile art. Hand-painted by skilled artisans from Srikalahasti, each piece tells a story through intricate mythological motifs and nature-inspired designs using natural dyes.",
  highlights: [
    "100% Pure Cotton fabric",
    "Hand-painted using natural vegetable dyes",
    "Traditional mythological motifs",
    "Includes matching blouse piece",
    "Certificate of authenticity included"
  ],
  specifications: {
    "Material": "Pure Cotton",
    "Length": "6.3 meters (with blouse piece)",
    "Width": "46 inches",
    "Blouse Piece": "0.8 meters included",
    "Wash Care": "Dry clean only",
    "Origin": "Srikalahasti, Andhra Pradesh"
  },
  artisan: {
    name: "Master Artisan Venkatesh",
    experience: "35+ years",
    location: "Srikalahasti",
    bio: "A third-generation Kalamkari artist who has dedicated his life to preserving this ancient art form. His work has been exhibited internationally and awarded by the Government of India."
  },
  images: [
    "/products/saree-1.jpg",
    "/products/saree-2.jpg",
    "/products/saree-3.jpg",
    "/products/saree-4.jpg",
  ]
};

const relatedProducts = [
  { id: 2, name: "Hand-painted Kalamkari Dupatta", price: 4990, originalPrice: null, tag: "New", category: "Textiles", rating: 4.7, reviews: 43 },
  { id: 12, name: "Kalamkari Wall Hanging", price: 3500, originalPrice: 4000, tag: null, category: "Textiles", rating: 4.7, reviews: 34 },
  { id: 3, name: "Pembarthi Brass Diya Set", price: 6900, originalPrice: null, tag: null, category: "Metal Crafts", rating: 4.8, reviews: 89 },
  { id: 4, name: "Tanjore Painting - Lakshmi", price: 12500, originalPrice: 14000, tag: "Premium", category: "Paintings", rating: 4.9, reviews: 67 },
];

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    comment: "Absolutely stunning saree! The craftsmanship is exceptional and the colors are vibrant. The artisan's attention to detail is visible in every inch of the fabric. Received many compliments when I wore it to a wedding.",
    helpful: 24
  },
  {
    id: 2,
    name: "Meera Reddy",
    rating: 5,
    date: "1 month ago",
    verified: true,
    comment: "This is my third purchase from Lepakshi and they never disappoint. The Kalamkari work is authentic and the saree drapes beautifully. Worth every rupee!",
    helpful: 18
  },
  {
    id: 3,
    name: "Anjali Krishnan",
    rating: 4,
    date: "2 months ago",
    verified: true,
    comment: "Beautiful saree with intricate designs. The only reason I'm giving 4 stars is because the delivery took a bit longer than expected. But the product quality is outstanding.",
    helpful: 12
  }
];

// ============================================
// COMPONENTS
// ============================================

// Star Rating Component
const StarRating = ({ rating, reviews, size = "sm" }: { rating: number; reviews?: number; size?: "sm" | "lg" }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${size === "lg" ? "w-5 h-5" : "w-4 h-4"} ${star <= rating ? "text-[#c9a227]" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    {reviews !== undefined && (
      <span className="text-sm text-[#666]">({reviews} reviews)</span>
    )}
  </div>
);

// Product Card for Related Products - Matching listing page design
const ProductCard = ({ product }: { product: typeof relatedProducts[0] }) => (
  <motion.div
    className="group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Link href={`/products/${product.id}`} className="block">
      {/* Product Image */}
      <div className="aspect-[3/4] bg-[#f7f5f0] mb-4 relative overflow-hidden border border-[#e5e0d5] group-hover:border-[#c9a227] transition-all duration-300 group-hover:shadow-lg">
        {/* Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0ebe3] to-[#e5dfd4] flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-[#c9a227]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        </div>

        {/* Tag */}
        {product.tag && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-medium tracking-wider z-10 ${
            product.tag === "Bestseller" ? "bg-[#c9a227] text-white" :
            product.tag === "Popular" ? "bg-[#7cb69d] text-white" :
            product.tag === "New" ? "bg-[#1a1a1a] text-white" :
            product.tag === "Premium" ? "bg-gradient-to-r from-[#c9a227] to-[#f7d794] text-white" :
            product.tag === "Eco-friendly" || product.tag === "Organic" ? "bg-[#596C45] text-white" :
            "bg-white text-[#1a1a1a] border border-[#e5e0d5]"
          }`}>
            {product.tag}
          </span>
        )}

        {/* Wishlist */}
        <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:bg-[#c9a227] hover:text-white z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick Add */}
        <button className="absolute bottom-0 left-0 right-0 py-3 bg-[#c9a227] text-white text-xs font-medium tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-full group-hover:translate-y-0 z-10 hover:bg-[#b8922a]">
          ADD TO CART
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-1.5">
        <p className="text-[#c9a227] text-xs tracking-wider uppercase">{product.category}</p>
        <h3 className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#c9a227] transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <div className="flex items-center gap-2 pt-1">
          <span className="font-semibold text-[#1a1a1a]">Rs.{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="line-through text-sm text-[#999]">Rs.{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  </motion.div>
);

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

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <>
      {/* Shared Header with Menu */}
      <Header variant="solid" />

      {/* Main Content */}
      <main className="pt-20 bg-[#fafafa]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
            <nav className="flex items-center gap-2 text-sm text-[#666]">
              <Link href="/" className="hover:text-[#c9a227] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-[#c9a227] transition-colors">Products</Link>
              <span>/</span>
              <Link href="/products?category=textiles" className="hover:text-[#c9a227] transition-colors">{product.category}</Link>
              <span>/</span>
              <span className="text-[#1a1a1a] truncate max-w-[200px]">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left - Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div
                className="aspect-[4/5] bg-white border border-[#e5e5e5] overflow-hidden relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe3] flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-white/80 flex items-center justify-center">
                    <svg className="w-16 h-16 text-[#c9a227]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                </div>

                {/* Tag */}
                {product.tag && (
                  <span className="absolute top-4 left-4 px-4 py-2 bg-[#c9a227] text-white text-sm font-medium tracking-wider">
                    {product.tag}
                  </span>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                  <span className="absolute top-4 right-4 px-3 py-1.5 bg-[#1a1a1a] text-white text-sm font-medium">
                    -{discount}%
                  </span>
                )}

                {/* Zoom Icon */}
                <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                  <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </button>
              </motion.div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-1 aspect-square bg-white border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#c9a227]"
                        : "border-[#e5e5e5] hover:border-[#c9a227]/50"
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe3] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#c9a227]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="lg:py-4">
              {/* Category & SKU */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#c9a227] text-sm tracking-wider uppercase font-medium">{product.category}</span>
                <span className="text-[#999] text-sm">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl text-[#1a1a1a] mb-4 leading-tight">
                {product.name}
              </h1>

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
              <p className="text-[#555] leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Availability */}
              <div className="flex items-center gap-2 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#2e7d32]"></span>
                <span className="text-sm text-[#2e7d32] font-medium">{product.availability}</span>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#1a1a1a] mb-3">Quantity</label>
                <div className="inline-flex items-center border border-[#e5e5e5] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-[#666] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
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
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button className="flex-1 py-4 bg-[#1a1a1a] text-white font-medium tracking-wider hover:bg-[#333] transition-colors">
                  ADD TO CART
                </button>
                <button className="w-14 h-14 border border-[#e5e5e5] flex items-center justify-center hover:border-[#c9a227] hover:text-[#c9a227] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Buy Now */}
              <button className="w-full py-4 border-2 border-[#c9a227] text-[#c9a227] font-medium tracking-wider hover:bg-[#c9a227] hover:text-white transition-all mb-8">
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

                <Accordion title="About the Artisan">
                  <div className="bg-[#f8f6f3] p-5 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-[#1a1a1a] mb-1">{product.artisan.name}</h4>
                        <p className="text-sm text-[#c9a227] mb-2">{product.artisan.experience} experience • {product.artisan.location}</p>
                        <p className="text-sm text-[#666] leading-relaxed">{product.artisan.bio}</p>
                      </div>
                    </div>
                  </div>
                </Accordion>

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

        {/* Reviews Section */}
        <section className="bg-white border-t border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
              <div>
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1a1a1a] mb-2">Customer Reviews</h2>
                <div className="flex items-center gap-4">
                  <StarRating rating={product.rating} size="lg" />
                  <span className="text-[#666]">Based on {product.reviews} reviews</span>
                </div>
              </div>
              <button className="px-8 py-3 bg-[#1a1a1a] text-white font-medium tracking-wider hover:bg-[#333] transition-colors">
                WRITE A REVIEW
              </button>
            </div>

            <div className="grid gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-[#fafafa] p-6 lg:p-8 rounded-lg">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-[#1a1a1a]">{review.name}</span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-[#2e7d32] bg-[#e8f5e9] px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <span className="text-sm text-[#999]">{review.date}</span>
                  </div>
                  <p className="text-[#555] leading-relaxed mb-4">{review.comment}</p>
                  <button className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Helpful ({review.helpful})
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="px-8 py-3 border border-[#e5e5e5] text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
                Load More Reviews
              </button>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="bg-[#fafafa] border-t border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1a1a1a]">You May Also Like</h2>
              <Link href="/products" className="text-[#c9a227] hover:text-[#b8922a] text-sm font-medium flex items-center gap-2 transition-colors">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/">
                <img src="/logo.png" alt="Lepakshi" className="h-14 mb-4 brightness-0 invert" />
              </Link>
              <p className="text-white/60 text-sm">Andhra Pradesh Handicrafts Development Corporation Ltd.</p>
            </div>
            {[
              { title: "SHOP", links: ["All Products", "New Arrivals", "Bestsellers", "Sale"] },
              { title: "HELP", links: ["Contact Us", "FAQs", "Shipping", "Returns"] },
              { title: "ABOUT", links: ["Our Story", "Artisans", "Stores", "Careers"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[#c9a227] font-medium mb-4 text-sm tracking-wider">{col.title}</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="hover:text-[#c9a227] transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            <p>&copy; 2024 Lepakshi - APHDCL. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky Add to Cart Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e5e5] p-4 lg:hidden z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-[#666] mb-0.5">Total Price</p>
            <p className="text-xl font-semibold text-[#1a1a1a]">Rs.{(product.price * quantity).toLocaleString()}</p>
          </div>
          <button className="flex-1 py-4 bg-[#1a1a1a] text-white font-medium tracking-wider">
            ADD TO CART
          </button>
        </div>
      </div>
    </>
  );
}
