"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

// ============================================
// NAVIGATION DATA
// ============================================

// Navigation item interface with optional location
interface NavItem {
  name: string;
  location?: string;
}

// Helper function to get category URL from navigation ID
// URL structure: /parent/category (e.g., /handicrafts/textiles)
const getCategoryUrlFromId = (categoryId: string): string => {
  // Map navigation category IDs to the new hierarchical URL structure
  const categoryUrlMap: Record<string, string> = {
    // Main handicraft categories - now under /handicrafts/
    "textiles": "/handicrafts/textiles",
    "metal": "/handicrafts/metal",
    "paintings": "/handicrafts/paintings",
    "natural-fibres": "/handicrafts/natural-fibres",
    "wood": "/handicrafts/wood",
    "mineral": "/handicrafts/mineral",
    "carpets": "/handicrafts/carpets",
    "jewelry": "/handicrafts/wood", // Fallback
    // Spiritual category - under /spiritual/
    "spiritual": "/spiritual/spiritual",
    // Bestseller subcategories - link to wood subcategories
    "kondapalli-toys": "/handicrafts/wood/kondapalli",
    "etikoppaka-toys": "/handicrafts/wood/etikoppaka",
    // Parent groupings
    "handicrafts": "/handicrafts",
    "bestsellers": "/handicrafts/wood",
  };

  return categoryUrlMap[categoryId] || "/products";
};

// Helper to get subcategory URL within a category
const getSubcategoryUrl = (subcategoryId: string, parentId: string): string => {
  // For bestsellers, map to the actual wood subcategory pages
  if (parentId === "bestsellers") {
    if (subcategoryId === "kondapalli-toys") return "/handicrafts/wood/kondapalli";
    if (subcategoryId === "etikoppaka-toys") return "/handicrafts/wood/etikoppaka";
  }

  // For handicrafts subcategories (textiles, metal, wood, etc.)
  if (parentId === "handicrafts") {
    return `/handicrafts/${subcategoryId}`;
  }

  // For spiritual - all items link to the spiritual category
  if (parentId === "spiritual") {
    return "/spiritual/spiritual";
  }

  return getCategoryUrlFromId(subcategoryId);
};

const navigationCategories = [
  {
    id: "handicrafts",
    name: "Handicrafts",
    featured: true,
    subcategories: [
      {
        id: "textiles",
        name: "Textile & Weaves",
        items: [
          { name: "Kalamkari Textile Prints", location: "Machilipatnam, Pedana" },
          { name: "Crochet Lace", location: "Narasapur" },
          { name: "Applique / Embroidery Work", location: "Madanapalli" }
        ]
      },
      {
        id: "metal",
        name: "Metal Crafts",
        items: [
          { name: "Brassware", location: "Budithi" },
          { name: "Bronze Castings", location: "Tirupati" },
          { name: "Brassware (Onipenta / Budithi styles)", location: "Onipenta" }
        ]
      },
      {
        id: "paintings",
        name: "Paintings",
        items: [
          { name: "Pen Kalamkari & Kalamkari Block Prints", location: "Srikalahasti, Banaganapalli" },
          { name: "Savara / Adivasi Tribal Paintings", location: "Seethampeta" },
          { name: "Tanjore Paintings" },
          { name: "Lampshades (Hand-painted)" },
          { name: "Leather Puppetry (Tholu Bommalata)", location: "Nimmalakunta, Dharmavaram" }
        ]
      },
      {
        id: "natural-fibres",
        name: "Natural Fibres",
        items: [
          { name: "Palm Leaf Craft", location: "Tuni, Rampachodavaram, Gokavaram, Devipatnam" },
          { name: "Walking Sticks", location: "Rajahmundry" },
          { name: "Bamboo Craft", location: "Rampachodavaram" }
        ]
      },
      {
        id: "wood",
        name: "Wood Crafts & Toys",
        items: [
          { name: "Kondapalli Painted Toys", location: "Kondapalli" },
          { name: "Etikoppaka Lacquerware Toys", location: "Etikoppaka" },
          { name: "White Wood Birds", location: "Rajahmundry" },
          { name: "Wooden Statues", location: "Tirupati / Settigunta" },
          { name: "Wall Panels", location: "Tirupati" },
          { name: "Bobbili Veena", location: "Bobbili" },
          { name: "Udayagiri Wooden Cutlery", location: "Udayagiri" },
          { name: "Red Sander Crafts", location: "Lakshmigari palli" }
        ]
      },
      {
        id: "mineral",
        name: "Natural Mineral Crafts",
        items: [
          { name: "Stone Carvings", location: "Durgi" },
          { name: "Pottery / Terracotta", location: "Madnapalle, Palamaneru" }
        ]
      },
      {
        id: "jewelry",
        name: "Jewelry",
        items: [
          { name: "Imitation Jewellery", location: "Machilipatnam" }
        ]
      },
      {
        id: "carpets",
        name: "Carpets",
        items: [
          { name: "Hand-Knotted Carpets", location: "Eluru" }
        ]
      }
    ]
  },
  {
    id: "spiritual",
    name: "Spiritual & Pooja",
    featured: false,
    items: ["Photo Frames", "Balaji Statue Frames / Idols", "Agarbatti", "Dhoop Sticks", "Perfumes", "Tulsi Mala", "Rudraksha"]
  },
  {
    id: "bestsellers",
    name: "Bestsellers",
    featured: false,
    subcategories: [
      {
        id: "kondapalli-toys",
        name: "Kondapalli Toys",
        items: [
          { name: "Dashavatar Set", location: "Kondapalli" },
          { name: "Dancing Doll", location: "Kondapalli" },
          { name: "Bullock Cart", location: "Kondapalli" },
          { name: "Rama Set", location: "Kondapalli" },
          { name: "Ambari Elephant", location: "Kondapalli" },
          { name: "Fridge Magnets", location: "Kondapalli" }
        ]
      },
      {
        id: "etikoppaka-toys",
        name: "Etikoppaka Toys",
        items: [
          { name: "Keychain Doll Model", location: "Etikoppaka" },
          { name: "Raja-Rani Set", location: "Etikoppaka" },
          { name: "Kumkum Box", location: "Etikoppaka" },
          { name: "Birds (Special Series)", location: "Etikoppaka" },
          { name: "Marriage Couple Set", location: "Etikoppaka" },
          { name: "Kalyana Balaji", location: "Etikoppaka" },
          { name: "Tirupati Wood Carving", location: "Tirupati" }
        ]
      }
    ]
  }
];

// ============================================
// HEADER COMPONENT
// ============================================

interface HeaderProps {
  variant?: "transparent" | "solid";
}

export default function Header({ variant = "transparent" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  const { scrollY } = useScroll();

  // Track scroll for header background change
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Reset menu state when closing
  const closeMenu = () => {
    setMobileMenuOpen(false);
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  // Get current category data
  const currentCategory = navigationCategories.find(c => c.id === activeCategory);
  const currentSubcategory = currentCategory?.subcategories?.find(s => s.id === activeSubcategory);

  return (
    <>
      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          variant === "solid" || mobileMenuOpen || isScrolled
            ? "bg-[#f3e6c6]  shadow-sm"
            : "bg-transparent border-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Left - Menu & Search */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => mobileMenuOpen ? closeMenu() : setMobileMenuOpen(true)}
                className={`transition-colors duration-300 p-2 flex items-center gap-2 ${
                  variant === "solid" || mobileMenuOpen || isScrolled
                    ? "text-[#1a1a1a] hover:text-[#c9a227]"
                    : "text-white hover:text-[#c9a227]"
                }`}
              >
                <div className="relative w-6 h-6">
                  <motion.span
                    className="absolute left-0 top-[6px] w-6 h-0.5 bg-current"
                    animate={mobileMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="absolute left-0 top-[11px] w-6 h-0.5 bg-current"
                    animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="absolute left-0 top-[16px] w-6 h-0.5 bg-current"
                    animate={mobileMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="hidden sm:inline text-sm font-medium tracking-wide">
                  {mobileMenuOpen ? "CLOSE" : "MENU"}
                </span>
              </button>
              <button className={`transition-colors duration-300 p-2 ${
                variant === "solid" || mobileMenuOpen || isScrolled
                  ? "text-[#1a1a1a] hover:text-[#c9a227]"
                  : "text-white hover:text-[#c9a227]"
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>

            {/* Center - Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <img
                src="/logo.png"
                alt="Lepakshi"
                className={`h-12 transition-all duration-300 ${
                  variant === "solid" || mobileMenuOpen || isScrolled ? "" : "brightness-0 invert"
                }`}
              />
            </Link>

            {/* Right - Actions */}
            <div className="flex items-center gap-3 sm:gap-5">
              <Link href="/wishlist" className={`transition-colors duration-300 p-2 relative ${
                variant === "solid" || mobileMenuOpen || isScrolled
                  ? "text-[#1a1a1a] hover:text-[#c9a227]"
                  : "text-white hover:text-[#c9a227]"
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center rounded-full">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className={`transition-colors duration-300 p-2 relative ${
                variant === "solid" || mobileMenuOpen || isScrolled
                  ? "text-[#1a1a1a] hover:text-[#c9a227]"
                  : "text-white hover:text-[#c9a227]"
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c9a227] text-white text-[10px] font-semibold flex items-center justify-center rounded-full">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sliding Menu Drawer with Multi-Level Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            {/* Sliding Drawer - White Theme */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
              className="fixed top-20 left-0 bottom-0 bg-white z-40 overflow-hidden flex shadow-2xl"
            >
              {/* Golden accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a227] via-[#f7d794] to-[#c9a227]" />

              {/* Main Categories Panel - Fixed Width */}
              <div
                className={`${activeCategory ? 'hidden sm:block' : 'block'} w-full sm:w-[260px] lg:w-[280px] border-r border-[#e5e5e5] flex-shrink-0`}
              >
                <div className="h-full overflow-y-auto py-6">
                  {/* Title */}
                  <div className="px-6 mb-6">
                    <p className="text-[#c9a227] text-[10px] tracking-[0.3em] uppercase mb-1">Explore</p>
                    <h3 className="text-[#1a1a1a] text-xl font-[family-name:var(--font-playfair)]">Categories</h3>
                  </div>

                  {/* Category List */}
                  <div className="space-y-1">
                    {navigationCategories.map((category, idx) => (
                      <motion.button
                        key={category.id}
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setActiveSubcategory(null);
                        }}
                        className={`w-full group flex items-center justify-between px-6 py-4 transition-all duration-300 ${
                          activeCategory === category.id
                            ? 'bg-[#ebe0cc] border-l-3 border-[#c9a227]'
                            : 'hover:bg-[#ebe0cc]/50 border-l-3 border-transparent hover:border-[#c9a227]/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-2 h-2 rounded-full transition-colors ${
                            activeCategory === category.id ? 'bg-[#c9a227]' : 'bg-[#d0d0d0] group-hover:bg-[#c9a227]'
                          }`} />
                          <span className={`text-sm font-medium transition-colors ${
                            activeCategory === category.id ? 'text-[#c9a227]' : 'text-[#3d3428] group-hover:text-[#1a1a1a]'
                          }`}>
                            {category.name}
                          </span>
                        </div>
                        <motion.svg
                          className={`w-4 h-4 transition-colors ${
                            activeCategory === category.id ? 'text-[#c9a227]' : 'text-[#999] group-hover:text-[#c9a227]'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ x: activeCategory === category.id ? 3 : 0 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </motion.button>
                    ))}
                  </div>

                  {/* Quick Links */}
                  <div className="mt-8 pt-6 mx-6 border-t border-[#e5e5e5]">
                    <div className="space-y-3">
                      {[
                        { label: "All Products", href: "/products" },
                        { label: "Our Story", href: "#" },
                        { label: "Contact", href: "#" }
                      ].map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={closeMenu}
                          className="block text-sm text-[#666] hover:text-[#c9a227] transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subcategories Panel - Fixed Width */}
              <AnimatePresence mode="wait">
                {activeCategory && currentCategory && (
                  <motion.div
                    key={activeCategory}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`${activeSubcategory && currentCategory.subcategories ? 'hidden sm:block' : 'block'} w-full sm:w-[240px] lg:w-[260px] bg-white border-r border-[#e5e5e5] flex-shrink-0`}
                  >
                    <div className="h-full overflow-y-auto py-6">
                      {/* Back button (mobile) */}
                      <button
                        onClick={() => setActiveCategory(null)}
                        className="sm:hidden flex items-center gap-2 px-6 mb-4 text-[#666] hover:text-[#c9a227] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm">Back</span>
                      </button>

                      {/* Category Title */}
                      <div className="px-6 mb-6">
                        <p className="text-[#c9a227] text-[10px] tracking-[0.3em] uppercase mb-1">{currentCategory.name}</p>
                        <Link
                          href={getCategoryUrlFromId(currentCategory.id)}
                          onClick={closeMenu}
                          className="text-[#666] text-xs hover:text-[#c9a227] flex items-center gap-1 mt-1"
                        >
                          View all
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>

                      {/* Subcategories or Items */}
                      {currentCategory.subcategories ? (
                        <div className="space-y-1">
                          {currentCategory.subcategories.map((sub, idx) => (
                            <motion.button
                              key={sub.id}
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.2, delay: idx * 0.03 }}
                              onClick={() => setActiveSubcategory(sub.id)}
                              className={`w-full group flex items-center justify-between px-6 py-3 transition-all duration-300 ${
                                activeSubcategory === sub.id
                                  ? 'bg-[#ebe0cc] border-l-2 border-[#c9a227]'
                                  : 'hover:bg-[#ebe0cc]/50 border-l-2 border-transparent hover:border-[#c9a227]/50'
                              }`}
                            >
                              <span className={`text-sm transition-colors ${
                                activeSubcategory === sub.id ? 'text-[#c9a227]' : 'text-[#3d3428] group-hover:text-[#1a1a1a]'
                              }`}>
                                {sub.name}
                              </span>
                              <svg
                                className={`w-3 h-3 transition-colors ${
                                  activeSubcategory === sub.id ? 'text-[#c9a227]' : 'text-[#999] group-hover:text-[#c9a227]'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-6 space-y-2">
                          {currentCategory.items?.map((item, idx) => {
                            const itemName = typeof item === 'string' ? item : (item as any).name;
                            const itemLocation = typeof item === 'object' && (item as any).location ? (item as any).location : null;

                            return (
                              <motion.div
                                key={itemName}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.2, delay: idx * 0.03 }}
                              >
                                <Link
                                  href={getCategoryUrlFromId(currentCategory.id)}
                                  onClick={closeMenu}
                                  className="block py-2 text-sm text-[#3d3428] hover:text-[#c9a227] transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <span>{itemName}</span>
                                    {itemLocation && (
                                      <span className="text-xs text-[#999] flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {itemLocation}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Items Panel (Third Level) - Fixed Width */}
              <AnimatePresence mode="wait">
                {activeSubcategory && currentSubcategory && (
                  <motion.div
                    key={activeSubcategory}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full sm:w-[280px] lg:w-[320px] bg-white flex-shrink-0"
                  >
                    <div className="h-full overflow-y-auto py-6">
                      {/* Back button (mobile) */}
                      <button
                        onClick={() => setActiveSubcategory(null)}
                        className="sm:hidden flex items-center gap-2 px-6 mb-4 text-[#666] hover:text-[#c9a227] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm">Back</span>
                      </button>

                      {/* Subcategory Title */}
                      <div className="px-6 mb-6">
                        <p className="text-[#c9a227] text-[10px] tracking-[0.3em] uppercase mb-1">{currentSubcategory.name}</p>
                        <Link
                          href={getSubcategoryUrl(currentSubcategory.id, activeCategory || "")}
                          onClick={closeMenu}
                          className="text-[#666] text-xs hover:text-[#c9a227] flex items-center gap-1 mt-1"
                        >
                          View all {currentSubcategory.name}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>

                      {/* Items List */}
                      <div className="px-6 space-y-1">
                        {currentSubcategory.items.map((item, idx) => {
                          const itemName = typeof item === 'string' ? item : item.name;
                          const itemLocation = typeof item === 'object' && item.location ? item.location : null;

                          return (
                            <motion.div
                              key={itemName}
                              initial={{ y: 15, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.25, delay: idx * 0.04 }}
                            >
                              <Link
                                href={getSubcategoryUrl(currentSubcategory.id, activeCategory || "")}
                                onClick={closeMenu}
                                className="group flex items-center gap-3 py-3 border-b border-[#e0e0e0] last:border-0"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]/60 group-hover:bg-[#c9a227] transition-colors flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm text-[#3d3428] group-hover:text-[#c9a227] transition-colors block">
                                    {itemName}
                                  </span>
                                  {itemLocation && (
                                    <span className="text-xs text-[#999] flex items-center gap-1 mt-0.5">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      {itemLocation}
                                    </span>
                                  )}
                                </div>
                                <svg className="w-3 h-3 text-[#999] group-hover:text-[#c9a227] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
