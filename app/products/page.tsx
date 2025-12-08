"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

// Star Rating Component
const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => (
  <div className="flex items-center gap-1">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= rating ? "text-[#c9a227]" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="text-xs text-[#666]">({reviews})</span>
  </div>
);

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

// Product Card Component - List View
const ProductCardList = ({ product }: { product: typeof allProducts[0] }) => (
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
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <button className="px-6 py-2.5 bg-[#c9a227] text-white text-sm font-medium tracking-wider hover:bg-[#b8922a] transition-colors">
            ADD TO CART
          </button>
        </div>
      </div>
    </Link>
  </motion.div>
);

// Filter Checkbox Component
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
  <label className="flex items-center gap-3 cursor-pointer group py-1.5">
    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
      checked ? "bg-[#c9a227] border-[#c9a227]" : "border-[#d4d0c8] group-hover:border-[#c9a227]"
    }`}>
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <span className="text-sm text-[#444] group-hover:text-[#1a1a1a] flex-1">{label}</span>
    {count !== undefined && (
      <span className="text-xs text-[#999]">({count})</span>
    )}
  </label>
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

  // Filter Sidebar Content
  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-medium text-[#1a1a1a] mb-4 text-sm tracking-wider uppercase">Categories</h3>
        <div className="space-y-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#c9a227]/10 text-[#c9a227] font-medium"
                  : "text-[#444] hover:bg-[#f7f5f0]"
              }`}
            >
              <span className="flex justify-between items-center">
                {cat.name}
                <span className="text-xs text-[#999]">{cat.count}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-[#1a1a1a] mb-4 text-sm tracking-wider uppercase">Price Range</h3>
        <div className="space-y-1">
          {priceRanges.map(range => (
            <button
              key={range.id}
              onClick={() => setSelectedPriceRange(range.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded transition-all ${
                selectedPriceRange === range.id
                  ? "bg-[#c9a227]/10 text-[#c9a227] font-medium"
                  : "text-[#444] hover:bg-[#f7f5f0]"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Craft Types */}
      <div>
        <h3 className="font-medium text-[#1a1a1a] mb-4 text-sm tracking-wider uppercase">Craft Type</h3>
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
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full py-3 border-2 border-[#c9a227] text-[#c9a227] text-sm font-medium tracking-wider hover:bg-[#c9a227] hover:text-white transition-all"
        >
          CLEAR ALL FILTERS ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Header - Same as homepage */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5E8C8]/95 backdrop-blur-md border-b border-[#c9a227]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-5">
              <button className="text-[#1a1a1a] hover:text-[#c9a227] transition-colors p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <button className="text-[#1a1a1a] hover:text-[#c9a227] transition-colors p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <img src="/logo.png" alt="Lepakshi" className="h-12" />
            </Link>
            <div className="flex items-center gap-5">
              <button className="text-[#1a1a1a] hover:text-[#c9a227] transition-colors p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
              <button className="text-[#1a1a1a] hover:text-[#c9a227] transition-colors p-2 relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c9a227] text-white text-[10px] font-semibold flex items-center justify-center rounded-full">2</span>
              </button>
            </div>
          </div>
        </div>
      </header>

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
            <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/" className="hover:text-[#c9a227] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">All Products</span>
            </nav>

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
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e5e0d5] text-sm font-medium hover:border-[#c9a227] transition-colors"
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
              </button>

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
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28">
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1a1a1a] mb-6">Filters</h2>
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
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 bg-[#f7f5f0] rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-[#c9a227]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1a1a1a] mb-2">No products found</h3>
                  <p className="text-[#666] mb-6">Try adjusting your filters to find what you&apos;re looking for</p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-[#c9a227] text-white font-medium tracking-wider hover:bg-[#b8922a] transition-colors"
                  >
                    CLEAR ALL FILTERS
                  </button>
                </div>
              )}

              {/* Load More */}
              {sortedProducts.length > 0 && (
                <div className="text-center mt-12">
                  <button className="px-10 py-4 border-2 border-[#c9a227] text-[#c9a227] font-medium tracking-wider hover:bg-[#c9a227] hover:text-white transition-all">
                    LOAD MORE PRODUCTS
                  </button>
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
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 bg-white border-b border-[#e5e0d5] px-6 py-4 flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#1a1a1a]">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-[#f7f5f0] rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="px-6 py-6">
                <FilterContent />
              </div>

              {/* Drawer Footer */}
              <div className="sticky bottom-0 bg-white border-t border-[#e5e0d5] px-6 py-4">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-4 bg-[#c9a227] text-white font-medium tracking-wider hover:bg-[#b8922a] transition-colors"
                >
                  SHOW {sortedProducts.length} PRODUCTS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#352f29] text-white pt-16 pb-8 px-6">
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
                <h4 className="text-[#E0AE31] font-medium mb-4 text-sm tracking-wider">{col.title}</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="hover:text-[#E0AE31] transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/20 text-center text-white/40 text-sm">
            <p>&copy; 2024 Lepakshi - APHDCL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
