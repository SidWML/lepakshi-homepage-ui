"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import {
  Breadcrumb,
  Footer,
  ProductCard,
  Button,
  EmptyState,
} from "@/components/ui";
import {
  getCategoryUrl,
  type Product,
  type Category,
  type Subcategory
} from "@/lib/data/products";

type SortOption = "featured" | "price-low" | "price-high" | "name" | "rating";

interface SubcategoryContentProps {
  parentGroup: { name: string; slug: string };
  category: Category;
  subcategory: Subcategory;
  products: Product[];
}

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest First" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

const priceRanges = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-500", label: "Under Rs.500", min: 0, max: 500 },
  { id: "500-1000", label: "Rs.500 - Rs.1,000", min: 500, max: 1000 },
  { id: "1000-2500", label: "Rs.1,000 - Rs.2,500", min: 1000, max: 2500 },
  { id: "2500-5000", label: "Rs.2,500 - Rs.5,000", min: 2500, max: 5000 },
  { id: "above-5000", label: "Above Rs.5,000", min: 5000, max: Infinity },
];

// Filter Radio Option Component
const FilterRadioOption = ({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg transition-all ${
      selected ? "bg-[#f8f6f3]" : "hover:bg-[#fafafa]"
    }`}
  >
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
      selected ? "border-[#c9a227]" : "border-[#d0d0d0]"
    }`}>
      {selected && (
        <motion.div
          className="w-2 h-2 rounded-full bg-[#c9a227]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.15 }}
        />
      )}
    </div>
    <span className={`text-sm flex-1 text-left transition-colors ${
      selected ? "text-[#1a1a1a] font-medium" : "text-[#555]"
    }`}>
      {label}
    </span>
  </button>
);

// Filter Section Component
const FilterSection = ({
  title,
  children,
  defaultOpen = true
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#eee] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 group"
      >
        <h3 className="font-medium text-[#1a1a1a] text-sm tracking-wide">{title}</h3>
        <motion.svg
          className="w-4 h-4 text-[#999] group-hover:text-[#1a1a1a] transition-colors"
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

export default function SubcategoryContent({ parentGroup, category, subcategory, products }: SubcategoryContentProps) {
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const priceRange = priceRanges.find(r => r.id === selectedPriceRange);
      const priceMatch = priceRange ? p.price >= priceRange.min && p.price <= priceRange.max : true;
      const stockMatch = !inStockOnly || p.inStock;
      return priceMatch && stockMatch;
    });

    switch (sortBy) {
      case "price-low":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "name":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case "rating":
        return [...filtered].sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  }, [products, sortBy, selectedPriceRange, inStockOnly]);

  const activeFiltersCount = (selectedPriceRange !== "all" ? 1 : 0) + (inStockOnly ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedPriceRange("all");
    setInStockOnly(false);
    setSortBy("featured");
  };

  // Filter Content Component
  const FilterContent = () => (
    <div className="bg-white rounded-xl border border-[#eee] overflow-hidden">
      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="px-5 py-4 bg-[#fafafa] border-b border-[#eee]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#888] uppercase tracking-wider">Active Filters</span>
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#c9a227] hover:text-[#b8922a] font-medium transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedPriceRange !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-full text-xs text-[#444]">
                {priceRanges.find(p => p.id === selectedPriceRange)?.label}
                <button onClick={() => setSelectedPriceRange("all")} className="text-[#999] hover:text-[#1a1a1a]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-full text-xs text-[#444]">
                In Stock Only
                <button onClick={() => setInStockOnly(false)} className="text-[#999] hover:text-[#1a1a1a]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="px-5">
        {/* Price Range */}
        <FilterSection title="Price Range" defaultOpen={true}>
          <div className="space-y-0.5">
            {priceRanges.map(range => (
              <FilterRadioOption
                key={range.id}
                selected={selectedPriceRange === range.id}
                onClick={() => setSelectedPriceRange(range.id)}
                label={range.label}
              />
            ))}
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability" defaultOpen={true}>
          <label className="flex items-center gap-3 cursor-pointer group py-2.5 px-3 -mx-3 rounded-lg hover:bg-[#f8f8f8] transition-all">
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
              inStockOnly
                ? "bg-[#1a1a1a] border-[#1a1a1a]"
                : "border-[#d0d0d0] group-hover:border-[#999]"
            }`}>
              <motion.svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={false}
                animate={{ scale: inStockOnly ? 1 : 0, opacity: inStockOnly ? 1 : 0 }}
                transition={{ duration: 0.15 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </motion.svg>
            </div>
            <span className={`text-sm flex-1 transition-colors ${inStockOnly ? "text-[#1a1a1a] font-medium" : "text-[#555] group-hover:text-[#1a1a1a]"}`}>
              In Stock Only
            </span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="sr-only"
            />
          </label>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <>
      <Header variant="solid" />

      {/* Hero Banner */}
      <section className="relative pt-20">
        <div className={`relative h-[280px] md:h-[350px] bg-gradient-to-r ${category.color} overflow-hidden`}>
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="subcategory-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#subcategory-pattern)" className="text-white" />
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
                { label: category.name, href: getCategoryUrl(category) },
                { label: subcategory.name },
              ]}
              className="mb-4 text-white/80"
            />

            <motion.h1
              className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {subcategory.name}
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Browse our collection of authentic {subcategory.name.toLowerCase()}
            </motion.p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 bg-[#faf8f5] min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Bar - Mobile Filter Button & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e0d5]">
            {/* Left - Results Count & Mobile Filter */}
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Button
                variant="secondary"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-[#c9a227] text-white text-xs flex items-center justify-center rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              <p className="text-[#666] text-sm">
                Showing <span className="font-medium text-[#1a1a1a]">{filteredAndSortedProducts.length}</span> of {products.length} products
              </p>
            </div>

            {/* Right - Sort & View Toggle */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
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

          {/* Content Grid */}
          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-28">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1a1a1a]">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <span className="px-2.5 py-1 bg-[#1a1a1a] text-white text-xs font-medium rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {filteredAndSortedProducts.length > 0 ? (
                <motion.div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                  layout
                >
                  <AnimatePresence>
                    {filteredAndSortedProducts.map(product => (
                      <ProductCard key={product.id} product={product} variant={viewMode} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <EmptyState
                  type="search"
                  title="No products found"
                  description="Try adjusting your filters to find what you're looking for"
                  actionLabel="CLEAR ALL FILTERS"
                  onAction={clearAllFilters}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[90%] max-w-md bg-[#fafafa] z-50 lg:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 bg-white border-b border-[#eee] px-6 py-5 flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#1a1a1a]">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <span className="px-2.5 py-1 bg-[#1a1a1a] text-white text-xs font-medium rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f5f5f5] rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-5">
                <FilterContent />
              </div>

              {/* Drawer Footer */}
              <div className="sticky bottom-0 bg-white border-t border-[#eee] px-5 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  SHOW {filteredAndSortedProducts.length} PRODUCTS
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
