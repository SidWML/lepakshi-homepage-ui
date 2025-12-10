"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import {
  Breadcrumb,
  Footer,
  ProductCard,
  Button,
} from "@/components/ui";
import {
  type Product,
  type Category,
  type CategoryGroup
} from "@/lib/data/products";

interface CategoryContentProps {
  parentGroup: CategoryGroup;
  category: Category;
  products: Product[];
}

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest First" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

export default function CategoryContent({ parentGroup, category, products }: CategoryContentProps) {
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "newest": return b.id - a.id;
      default: return 0;
    }
  });

  return (
    <>
      <Header variant="solid" />

      {/* Hero Banner */}
      <section className="relative pt-20">
        <div className={`relative h-[280px] md:h-[350px] bg-gradient-to-r ${category.color} overflow-hidden`}>
          {/* Background Image */}
          {category.image && (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover opacity-30"
            />
          )}

          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="category-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#category-pattern)" className="text-white" />
            </svg>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: parentGroup.name, href: `/${parentGroup.slug}` },
                { label: category.name },
              ]}
              className="mb-4 text-white/80"
            />

            <motion.h1
              className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {category.name}
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {category.tagline}
            </motion.p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
        </div>
      </section>


      {/* Products Section */}
      <section className="py-8 md:py-12 bg-[#faf8f5] min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Bar - Sort & View Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e0d5]">
            {/* Left - Results Count */}
            <div className="flex items-center gap-4">
              <p className="text-[#666] text-sm">
                Showing <span className="font-medium text-[#1a1a1a]">{sortedProducts.length}</span> products
              </p>
            </div>

            {/* Right - Sort & View Toggle */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-[#e5e0d5] px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#c9a227] cursor-pointer"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center border border-[#e5e0d5] bg-white">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-[#c9a227] text-white" : "text-[#666] hover:text-[#1a1a1a]"}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-[#c9a227] text-white" : "text-[#666] hover:text-[#1a1a1a]"}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <motion.div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1"
              }`}
              layout
            >
              <AnimatePresence>
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} variant={viewMode} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-[#e5e0d5]">
              <svg className="w-16 h-16 mx-auto mb-4 text-[#c9a227]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-[#666] mb-4">No products available in this category yet.</p>
              <Link href={`/${parentGroup.slug}`}>
                <Button variant="outline">Browse Other Categories</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
