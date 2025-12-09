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
  PriceCompact,
  Breadcrumb,
  EmptyState,
  Footer,
} from "@/components/ui";

// ============================================
// DATA
// ============================================

const categories = [
  { id: "all", name: "All Products", count: 856 },
  { id: "textiles", name: "Textiles & Weaves", count: 156 },
  { id: "metal", name: "Metal Crafts", count: 89 },
  { id: "paintings", name: "Paintings", count: 124 },
  { id: "wood", name: "Wood Crafts & Toys", count: 203 },
  { id: "natural-fibres", name: "Natural Fibres", count: 67 },
  { id: "jewelry", name: "Jewelry", count: 78 },
  { id: "spiritual", name: "Spiritual & Pooja", count: 94 },
  { id: "tribal", name: "Tribal Products", count: 45 },
];

const priceRanges = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-500", label: "Under Rs.500", min: 0, max: 500 },
  { id: "500-1000", label: "Rs.500 - Rs.1,000", min: 500, max: 1000 },
  { id: "1000-2500", label: "Rs.1,000 - Rs.2,500", min: 1000, max: 2500 },
  { id: "2500-5000", label: "Rs.2,500 - Rs.5,000", min: 2500, max: 5000 },
  { id: "above-5000", label: "Above Rs.5,000", min: 5000, max: Infinity },
];

const craftTypes = [
  { id: "kalamkari", name: "Kalamkari" },
  { id: "kondapalli", name: "Kondapalli Toys" },
  { id: "etikoppaka", name: "Etikoppaka Lacquerware" },
  { id: "pembarthi", name: "Pembarthi Brass" },
  { id: "bidriware", name: "Bidriware" },
  { id: "tanjore", name: "Tanjore Paintings" },
  { id: "dharmavaram", name: "Dharmavaram Silk" },
];

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest First" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
  { id: "bestselling", label: "Bestselling" },
];

// Sample products data
const allProducts = [
  { id: 1, name: "Srikalahasti Kalamkari Saree", price: 15500, originalPrice: 18000, tag: "Bestseller", category: "Textiles", craft: "Kalamkari", rating: 4.9, reviews: 156, image: "/products/saree-1.jpg" },
  { id: 2, name: "Hand-painted Kalamkari Dupatta", price: 4990, originalPrice: null, tag: "New", category: "Textiles", craft: "Kalamkari", rating: 4.7, reviews: 43, image: "/products/dupatta-1.jpg" },
  { id: 3, name: "Pembarthi Brass Diya Set", price: 6900, originalPrice: null, tag: null, category: "Metal Crafts", craft: "Pembarthi", rating: 4.8, reviews: 89, image: "/products/diya-1.jpg" },
  { id: 4, name: "Tanjore Painting - Lakshmi", price: 12500, originalPrice: 14000, tag: "Premium", category: "Paintings", craft: "Tanjore", rating: 4.9, reviews: 67, image: "/products/tanjore-1.jpg" },
  { id: 5, name: "Kondapalli Dashavatar Set", price: 4500, originalPrice: 5200, tag: "Bestseller", category: "Wood Crafts", craft: "Kondapalli", rating: 4.8, reviews: 124, image: "/products/dashavatar.jpg" },
  { id: 6, name: "Etikoppaka Raja-Rani Set", price: 2400, originalPrice: 2800, tag: null, category: "Wood Crafts", craft: "Etikoppaka", rating: 4.8, reviews: 98, image: "/products/raja-rani.jpg" },
  { id: 7, name: "Balaji Statue Frame", price: 2500, originalPrice: null, tag: null, category: "Spiritual", craft: "Pembarthi", rating: 4.8, reviews: 45, image: "/products/balaji.jpg" },
  { id: 8, name: "Araku Valley Coffee", price: 450, originalPrice: null, tag: "Bestseller", category: "Tribal", craft: null, rating: 4.9, reviews: 234, image: "/products/coffee.jpg" },
  { id: 9, name: "Water Hyacinth Basket", price: 1200, originalPrice: null, tag: "Eco-friendly", category: "Natural Fibres", craft: null, rating: 4.6, reviews: 56, image: "/products/basket.jpg" },
  { id: 10, name: "Temple Jewelry Set", price: 8500, originalPrice: 9500, tag: "Premium", category: "Jewelry", craft: null, rating: 4.9, reviews: 78, image: "/products/jewelry.jpg" },
  { id: 11, name: "Kondapalli Dancing Doll", price: 1200, originalPrice: null, tag: "Popular", category: "Wood Crafts", craft: "Kondapalli", rating: 4.9, reviews: 89, image: "/products/dancing-doll.jpg" },
  { id: 12, name: "Kalamkari Wall Hanging", price: 3500, originalPrice: 4000, tag: null, category: "Textiles", craft: "Kalamkari", rating: 4.7, reviews: 34, image: "/products/wall-hanging.jpg" },
  { id: 13, name: "Brass Urli Bowl", price: 4200, originalPrice: null, tag: null, category: "Metal Crafts", craft: "Pembarthi", rating: 4.8, reviews: 67, image: "/products/urli.jpg" },
  { id: 14, name: "Etikoppaka Kumkum Box", price: 450, originalPrice: null, tag: null, category: "Wood Crafts", craft: "Etikoppaka", rating: 4.7, reviews: 67, image: "/products/kumkum-box.jpg" },
  { id: 15, name: "Tribal Honey (500g)", price: 650, originalPrice: null, tag: "Organic", category: "Tribal", craft: null, rating: 4.8, reviews: 123, image: "/products/honey.jpg" },
  { id: 16, name: "Bidriware Vase", price: 7500, originalPrice: 8500, tag: "Premium", category: "Metal Crafts", craft: "Bidriware", rating: 4.9, reviews: 45, image: "/products/bidri-vase.jpg" },
];

// ============================================
// COMPONENTS
// ============================================

// Product Card Component - Grid View
const ProductCardGrid = ({ product }: { product: typeof allProducts[0] }) => (
  <motion.div
    className="group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    layout
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
          <div className="absolute top-3 left-3 z-10">
            <Badge variant={getTagVariant(product.tag)}>{product.tag}</Badge>
          </div>
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
        <PriceCompact price={product.price} originalPrice={product.originalPrice} className="pt-1" />
      </div>
    </Link>
  </motion.div>
);

// Product Card Component - List View
const ProductCardList = ({ product }: { product: typeof allProducts[0] }) => {
  const discountPercentage = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className="group bg-white border border-[#e5e0d5] hover:border-[#c9a227] transition-all duration-300 hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
    >
      <Link href={`/products/${product.id}`} className="flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className="sm:w-48 md:w-56 lg:w-64 flex-shrink-0">
          <div className="aspect-[4/3] sm:aspect-square bg-[#f7f5f0] relative overflow-hidden">
            {/* Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f0ebe3] to-[#e5dfd4] flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-[#c9a227]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            </div>

            {/* Tag */}
            {product.tag && (
              <div className="absolute top-3 left-3 z-10">
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
                <p className="text-[#c9a227] text-xs tracking-wider uppercase mb-1">{product.category}</p>
                <h3 className="text-lg font-medium text-[#1a1a1a] group-hover:text-[#c9a227] transition-colors leading-snug">
                  {product.name}
                </h3>
              </div>
              {/* Wishlist */}
              <button className="w-10 h-10 bg-[#f7f5f0] rounded-full flex items-center justify-center hover:bg-[#c9a227] hover:text-white transition-all flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div className="mb-3">
              <StarRating rating={product.rating} reviews={product.reviews} />
            </div>

            {product.craft && (
              <p className="text-sm text-[#666] mb-3">
                Craft: <span className="text-[#1a1a1a]">{product.craft}</span>
              </p>
            )}

            <p className="text-sm text-[#666] line-clamp-2 hidden md:block">
              Authentic handcrafted piece from skilled artisans of Andhra Pradesh. Each product is unique and carries the legacy of traditional craftsmanship.
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e5e0d5]">
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold text-[#1a1a1a]">Rs.{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="line-through text-[#999]">Rs.{product.originalPrice.toLocaleString()}</span>
                  <span className="text-sm text-[#596C45] font-medium">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            <Button variant="gold" size="sm">
              ADD TO CART
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Filter Checkbox Component - Premium Design
const FilterCheckbox = ({
  checked,
  onChange,
  label,
  count
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) => (
  <label onClick={onChange} className="flex items-center gap-3 cursor-pointer group py-2.5 px-3 -mx-3 rounded-lg hover:bg-[#f8f8f8] transition-all">
    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
      checked
        ? "bg-[#1a1a1a] border-[#1a1a1a]"
        : "border-[#d0d0d0] group-hover:border-[#999]"
    }`}>
      <motion.svg
        className="w-3 h-3 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        initial={false}
        animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </motion.svg>
    </div>
    <span className={`text-sm flex-1 transition-colors ${checked ? "text-[#1a1a1a] font-medium" : "text-[#555] group-hover:text-[#1a1a1a]"}`}>
      {label}
    </span>
    {count !== undefined && (
      <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
        checked ? "bg-[#1a1a1a] text-white" : "bg-[#f0f0f0] text-[#888]"
      }`}>
        {count}
      </span>
    )}
  </label>
);

// Collapsible Filter Section Component
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

// Radio Button Style Filter Option
const FilterRadioOption = ({
  selected,
  onClick,
  label,
  count,
  showRadio = true
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  showRadio?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg transition-all ${
      selected
        ? "bg-[#f8f6f3]"
        : "hover:bg-[#fafafa]"
    }`}
  >
    {showRadio && (
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
    )}
    <span className={`text-sm flex-1 text-left transition-colors ${
      selected ? "text-[#1a1a1a] font-medium" : "text-[#555]"
    }`}>
      {label}
    </span>
    {count !== undefined && (
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        selected ? "bg-[#c9a227] text-white" : "bg-[#f0f0f0] text-[#888]"
      }`}>
        {count}
      </span>
    )}
  </button>
);

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function ProductsPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedCrafts, setSelectedCrafts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    if (selectedCategory !== "all" && product.category.toLowerCase().replace(/\s+/g, "-") !== selectedCategory) {
      return false;
    }
    const priceRange = priceRanges.find(r => r.id === selectedPriceRange);
    if (priceRange && (product.price < priceRange.min || product.price > priceRange.max)) {
      return false;
    }
    if (selectedCrafts.length > 0 && product.craft && !selectedCrafts.includes(product.craft.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "newest": return b.id - a.id;
      default: return 0;
    }
  });

  const toggleCraft = (craftId: string) => {
    setSelectedCrafts(prev =>
      prev.includes(craftId)
        ? prev.filter(c => c !== craftId)
        : [...prev, craftId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setSelectedCrafts([]);
  };

  const activeFiltersCount = (selectedCategory !== "all" ? 1 : 0) +
                            (selectedPriceRange !== "all" ? 1 : 0) +
                            selectedCrafts.length;

  // Filter Sidebar Content - Premium Design
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
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-full text-xs text-[#444]">
                {categories.find(c => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory("all")} className="text-[#999] hover:text-[#1a1a1a]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
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
            {selectedCrafts.map(craftId => (
              <span key={craftId} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-full text-xs text-[#444]">
                {craftTypes.find(c => c.id === craftId)?.name}
                <button onClick={() => toggleCraft(craftId)} className="text-[#999] hover:text-[#1a1a1a]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="px-5">
        {/* Categories */}
        <FilterSection title="Category" defaultOpen={true}>
          <div className="space-y-0.5">
            {categories.map(cat => (
              <FilterRadioOption
                key={cat.id}
                selected={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                label={cat.name}
                count={cat.count}
              />
            ))}
          </div>
        </FilterSection>

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

        {/* Craft Types */}
        <FilterSection title="Craft Type" defaultOpen={true}>
          <div className="space-y-0.5">
            {craftTypes.map(craft => (
              <FilterCheckbox
                key={craft.id}
                checked={selectedCrafts.includes(craft.id)}
                onChange={() => toggleCraft(craft.id)}
                label={craft.name}
              />
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <>
      <Header variant="solid" />

      {/* Hero Banner */}
      <section className="relative pt-20">
        <div className="relative h-[280px] md:h-[350px] bg-gradient-to-r from-[#2d2a26] to-[#3d3428] overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="products-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#products-pattern)" className="text-[#c9a227]" />
            </svg>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "All Products" },
              ]}
              variant="light"
              className="mb-4"
            />

            <motion.h1
              className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Explore Our <span className="italic text-[#c9a227]">Collection</span>
            </motion.h1>
            <motion.p
              className="text-white/70 text-lg max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Discover authentic handcrafted treasures from Andhra Pradesh&apos;s finest artisans
            </motion.p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#c9a227]/10 rounded-full blur-3xl" />
          <div className="absolute right-20 bottom-0 w-32 h-32 bg-[#c9a227]/20 rounded-full blur-2xl" />
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
              {sortedProducts.length > 0 ? (
                <motion.div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                  layout
                >
                  <AnimatePresence>
                    {sortedProducts.map(product => (
                      viewMode === "grid"
                        ? <ProductCardGrid key={product.id} product={product} />
                        : <ProductCardList key={product.id} product={product} />
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

              {/* Load More */}
              {sortedProducts.length > 0 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    LOAD MORE PRODUCTS
                  </Button>
                </div>
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
                  SHOW {sortedProducts.length} PRODUCTS
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
