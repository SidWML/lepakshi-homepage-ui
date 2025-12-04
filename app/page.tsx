"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue, useMotionValueEvent } from "framer-motion";

// ============================================
// ANIMATION VARIANTS
// ============================================

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

// Animated Counter Hook
const useCounter = (end: number, duration: number = 2) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return { count, ref };
};

// Section wrapper with scroll animation
const AnimatedSection = ({ children, className = "", delay = 0, id }: { children: React.ReactNode; className?: string; delay?: number; id?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: "easeOut" } }
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// ============================================
// DATA STRUCTURES
// ============================================

const mainCategories = [
  { id: "textiles", name: "Textile & Weaves", tagline: "Heritage Fabrics", color: "from-[#d4a574] to-[#a67c52]", productCount: 156, subcategories: ["Kalamkari Textile Prints", "Crochet Lace", "Applique / Embroidery Work"] },
  { id: "metal", name: "Metal Crafts", tagline: "Timeless Metalwork", color: "from-[#b8860b] to-[#8b6914]", productCount: 89, subcategories: ["Brassware", "Bronze Castings", "Onipenta / Budithi Styles"] },
  { id: "paintings", name: "Paintings", tagline: "Artistic Heritage", color: "from-[#c97b7b] to-[#8f4a4a]", productCount: 124, subcategories: ["Pen Kalamkari", "Savara / Adivasi Tribal", "Tanjore Paintings", "Leather Puppetry"] },
  { id: "natural-fibres", name: "Natural Fibres", tagline: "Eco-Friendly Craft", color: "from-[#7cb69d] to-[#4a8f6d]", productCount: 67, subcategories: ["Palm Leaf Craft", "Walking Sticks", "Bamboo Craft"] },
  { id: "wood", name: "Wood Crafts & Toys", tagline: "Artisan Woodwork", color: "from-[#a0522d] to-[#6b3a1f]", productCount: 203, subcategories: ["Kondapalli Toys", "Etikoppaka Lacquerware", "Bobbili Veena", "Wooden Statues"] },
  { id: "mineral", name: "Natural Minerals", tagline: "Earth's Artistry", color: "from-[#8b9eb3] to-[#5a7186]", productCount: 45, subcategories: ["Stone Carvings - Durgi", "Pottery / Terracotta"] },
  { id: "jewelry", name: "Jewelry", tagline: "Traditional Adornments", color: "from-[#c9a227] to-[#9a7b1a]", productCount: 78, subcategories: ["Imitation Jewellery", "Temple Jewelry"] },
  { id: "carpets", name: "Carpets", tagline: "Woven Excellence", color: "from-[#8b4513] to-[#654321]", productCount: 34, subcategories: ["Hand-Knotted Carpets (Eluru)"] },
];

// All products follow the same structure for consistent card rendering
const spiritualProducts = [
  { name: "Balaji Statue Frame", price: "Rs.2,500", originalPrice: null, tag: null, category: "Spiritual", rating: 4.8, reviews: 45 },
  { name: "Divine Photo Frames", price: "Rs.850", originalPrice: "Rs.1,000", tag: "Sale", category: "Spiritual", rating: 4.6, reviews: 32 },
  { name: "Premium Agarbatti Set", price: "Rs.150", originalPrice: null, tag: null, category: "Spiritual", rating: 4.9, reviews: 156 },
  { name: "Dhoop Sticks Set", price: "Rs.120", originalPrice: null, tag: "Popular", category: "Spiritual", rating: 4.7, reviews: 89 },
  { name: "Temple Perfumes", price: "Rs.450", originalPrice: null, tag: null, category: "Spiritual", rating: 4.5, reviews: 23 },
  { name: "Tulsi Mala", price: "Rs.350", originalPrice: null, tag: null, category: "Spiritual", rating: 4.8, reviews: 67 },
  { name: "Rudraksha Beads", price: "Rs.1,200", originalPrice: "Rs.1,500", tag: "Premium", category: "Spiritual", rating: 4.9, reviews: 78 },
];

const tribalProducts = [
  { name: "Araku Valley Coffee", price: "Rs.450", originalPrice: null, tag: "Bestseller", category: "Tribal", rating: 4.9, reviews: 234 },
  { name: "Herbal Soap Set", price: "Rs.180", originalPrice: null, tag: null, category: "Tribal", rating: 4.7, reviews: 89 },
  { name: "Tribal Wellness Pack", price: "Rs.350", originalPrice: "Rs.450", tag: "Sale", category: "Tribal", rating: 4.6, reviews: 45 },
  { name: "Bamboo Storage Basket", price: "Rs.650", originalPrice: null, tag: "New", category: "Tribal", rating: 4.8, reviews: 34 },
    { name: "Bamboo Storage Basket", price: "Rs.650", originalPrice: null, tag: "New", category: "Tribal", rating: 4.8, reviews: 34 },
      { name: "Bamboo Storage Basket", price: "Rs.650", originalPrice: null, tag: "New", category: "Tribal", rating: 4.8, reviews: 34 },


];

const premiumCollections = [
  { name: "Water Hyacinth", tagline: "Sustainable Luxury", desc: "Handwoven bags, baskets & home decor", itemCount: 45, color: "from-[#4a7c59] to-[#2d5a3a]" },
  { name: "Banana Fibre", tagline: "Eco Innovation", desc: "Unique textiles, accessories & art", itemCount: 32, color: "from-[#c9a227] to-[#8b6914]" },
  { name: "Red Sanders", tagline: "Premium Woodcraft", desc: "Exclusive carved collectibles", itemCount: 28, color: "from-[#8b2500] to-[#5a1800]" },
];

// Category Banner Cards Data
const categoryBanners = [
  { id: "kalamkari", name: "Kalamkari Textiles", tagline: "Ancient Pen Art", image: "/banners/kalamkari.jpg", color: "bg-[#F5E8C8]" },
  { id: "kondapalli", name: "Kondapalli Toys", tagline: "Wooden Wonders", image: "/banners/kondapalli.jpg", color: "bg-[#8B7355]" },
];

// Store Locations Data
const storeLocations = [
  {
    name: "Lepakshi Emporium",
    address: "Gunfoundry, Abids Road, Near GPO, Hyderabad, Telangana 500001",
    hours: "Monday to Saturday - 10:30 am - 7:30 pm",
    phone: "040 2320 1648",
    mapLink: "#"
  },
  {
    name: "Lepakshi Vijayawada",
    address: "Governorpet, Near PWD Grounds, Vijayawada, Andhra Pradesh 520002",
    hours: "Monday to Saturday - 10 am - 8 pm",
    phone: "0866 257 1234",
    mapLink: "#"
  }
];

// Stories/Editorial Data
const editorialStories = [
  {
    id: 1,
    title: "Srikalahasti Kalamkari: Where Stories Come Alive",
    excerpt: "Explore the 3000-year-old art of hand-painting mythological tales on fabric using natural dyes.",
    category: "Heritage Craft",
    readTime: "5 min read",
    image: "/stories/kalamkari.jpg"
  },
  {
    id: 2,
    title: "The Colorful World of Etikoppaka Lacquerware",
    excerpt: "How artisans transform Ankudu wood into vibrant toys using lac extracted from insects.",
    category: "Artisan Spotlight",
    readTime: "4 min read",
    image: "/stories/etikoppaka.jpg"
  },
  {
    id: 3,
    title: "Pembarthi Brass: The Metal of the Gods",
    excerpt: "Centuries of craftsmanship behind the temple art that adorns shrines across India.",
    category: "Craft Legacy",
    readTime: "6 min read",
    image: "/stories/pembarthi.jpg"
  }
];

const kondapalliProducts = [
  { name: "Dashavatar Set", price: "Rs.4,500", originalPrice: "Rs.5,200", tag: "Bestseller", category: "Kondapalli", rating: 4.8, reviews: 124 },
  { name: "Dancing Doll", price: "Rs.1,200", originalPrice: null, tag: "Popular", category: "Kondapalli", rating: 4.9, reviews: 89 },
  { name: "Bullock Cart", price: "Rs.2,800", originalPrice: "Rs.3,200", tag: null, category: "Kondapalli", rating: 4.7, reviews: 56 },
  { name: "Rama Set", price: "Rs.3,500", originalPrice: null, tag: "New", category: "Kondapalli", rating: 4.6, reviews: 34 },
  { name: "Ambari Elephant", price: "Rs.5,200", originalPrice: "Rs.6,000", tag: "Premium", category: "Kondapalli", rating: 4.9, reviews: 78 },
  { name: "Fridge Magnets Set", price: "Rs.350", originalPrice: null, tag: null, category: "Kondapalli", rating: 4.5, reviews: 145 },
];

const etikoppakaProducts = [
  { name: "Keychain Doll", price: "Rs.250", originalPrice: null, tag: "Popular", category: "Etikoppaka", rating: 4.6, reviews: 234 },
  { name: "Raja-Rani Set", price: "Rs.2,400", originalPrice: "Rs.2,800", tag: "Bestseller", category: "Etikoppaka", rating: 4.8, reviews: 98 },
  { name: "Kumkum Box", price: "Rs.450", originalPrice: null, tag: null, category: "Etikoppaka", rating: 4.7, reviews: 67 },
  { name: "Birds Special Series", price: "Rs.1,800", originalPrice: null, tag: "New", category: "Etikoppaka", rating: 4.9, reviews: 45 },
  { name: "Marriage Couple Set", price: "Rs.3,200", originalPrice: "Rs.3,800", tag: null, category: "Etikoppaka", rating: 4.8, reviews: 89 },
  { name: "Kalyana Balaji", price: "Rs.4,500", originalPrice: null, tag: "Premium", category: "Etikoppaka", rating: 4.9, reviews: 56 },
];

const featuredProducts = [
  { name: "Srikalahasti Kalamkari Saree", price: "Rs.15,500", originalPrice: "Rs.18,000", tag: "Bestseller", category: "Textiles", rating: 4.9, reviews: 156 },
  { name: "Hand-painted Kalamkari Dupatta", price: "Rs.4,990", originalPrice: null, tag: "New", category: "Textiles", rating: 4.7, reviews: 43 },
  { name: "Pembarthi Brass Diya Set", price: "Rs.6,900", originalPrice: null, tag: null, category: "Metal Crafts", rating: 4.8, reviews: 89 },
  { name: "Tanjore Painting - Lakshmi", price: "Rs.12,500", originalPrice: "Rs.14,000", tag: "Premium", category: "Paintings", rating: 4.9, reviews: 67 },
    { name: "Tanjore Painting - Lakshmi", price: "Rs.12,500", originalPrice: "Rs.14,000", tag: "Premium", category: "Paintings", rating: 4.9, reviews: 67 },

];

// ============================================
// REUSABLE COMPONENTS
// ============================================

// Star Rating Component
const StarRating = ({ rating, reviews, dark = false }: { rating: number; reviews: number; dark?: boolean }) => (
  <div className="flex items-center gap-1">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3 h-3 ${star <= rating ? "text-[#c9a227]" : dark ? "text-white/30" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className={`text-xs ${dark ? "text-white/60" : "text-[#666]"}`}>({reviews})</span>
  </div>
);

// Unified Product Card Component - Same for ALL sections
interface Product {
  name: string;
  price: string;
  originalPrice?: string | null;
  tag?: string | null;
  category?: string;
  rating?: number;
  reviews?: number;
}

const ProductCard = ({ product, showCategory = false, dark = false }: { product: Product; showCategory?: boolean; dark?: boolean }) => (
  <motion.a
    href="#"
    className="group block"
    whileHover={{ y: -8 }}
    transition={{ duration: 0.3 }}
  >
    {/* Product Image - Consistent 3:4 aspect ratio */}
    <div className="aspect-[3/4] bg-[#f7f5f0] mb-4 relative overflow-hidden border border-[#e5e0d5] group-hover:border-[#c9a227] transition-all duration-300 group-hover:shadow-xl">
      {/* Placeholder Image Area */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0ebe3] to-[#e5dfd4] flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
          <svg className="w-10 h-10 text-[#c9a227]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      </div>

      {/* Product Tag */}
      {product.tag && (
        <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-medium tracking-wider z-10 ${
          product.tag === "Bestseller" ? "bg-[#c9a227] text-white" :
          product.tag === "Popular" ? "bg-[#7cb69d] text-white" :
          product.tag === "New" ? "bg-[#1a1a1a] text-white" :
          product.tag === "Premium" ? "bg-gradient-to-r from-[#c9a227] to-[#f7d794] text-white" :
          product.tag === "Sale" ? "bg-[#c97b7b] text-white" :
          "bg-white text-[#1a1a1a] border border-[#e5e0d5]"
        }`}>
          {product.tag}
        </span>
      )}

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:bg-[#c9a227] hover:text-white z-10">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Add to Cart Button */}
      <button className="absolute bottom-0 left-0 right-0 py-3 bg-[#c9a227] text-white text-xs font-medium tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-full group-hover:translate-y-0 z-10 hover:bg-[#b8922a]">
        ADD TO CART
      </button>
    </div>

    {/* Product Info */}
    <div className="space-y-1.5">
      {showCategory && product.category && (
        <p className="text-[#c9a227] text-xs tracking-wider uppercase">{product.category}</p>
      )}
      <h3 className={`text-sm font-medium group-hover:text-[#c9a227] transition-colors line-clamp-2 leading-snug ${dark ? "text-white" : "text-[#1a1a1a]"}`}>
        {product.name}
      </h3>
      {product.rating && product.reviews && (
        <StarRating rating={product.rating} reviews={product.reviews} dark={dark} />
      )}
      <div className="flex items-center gap-2 pt-1">
        <span className={`font-semibold ${dark ? "text-white" : "text-[#1a1a1a]"}`}>{product.price}</span>
        {product.originalPrice && (
          <span className={`line-through text-sm ${dark ? "text-white/50" : "text-[#999]"}`}>{product.originalPrice}</span>
        )}
      </div>
    </div>
  </motion.a>
);

// Animated Stat Counter Component
const AnimatedStat = ({ number, label }: { number: string; label: string }) => {
  const numericValue = parseInt(number.replace(/\D/g, ''));
  const suffix = number.replace(/[0-9]/g, '');
  const { count, ref } = useCounter(numericValue, 2);

  return (
    <div ref={ref} className="text-center px-10 md:px-16">
      <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[#1a1a1a]">
        {count}{suffix}
      </p>
      <p className="text-[#666] text-[11px] tracking-[0.15em] uppercase mt-1">{label}</p>
    </div>
  );
};

// Product Carousel Component using Embla
const ProductCarousel = ({
  products,
  showCategory = false,
  darkMode = false
}: {
  products: Product[];
  showCategory?: boolean;
  darkMode?: boolean;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps"
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const buttonClass = darkMode
    ? "bg-white text-[#1a1a1a] hover:bg-[#c9a227] hover:text-white"
    : "bg-[#1a1a1a] text-white hover:bg-[#c9a227]";

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {products.map((product, index) => (
            <div
              key={`${product.name}-${index}`}
              className="flex-none w-[calc(50%-10px)] sm:w-[calc(33.333%-14px)] md:w-[calc(25%-15px)] lg:w-[calc(20%-16px)]"
            >
              <ProductCard product={product} showCategory={showCategory} dark={darkMode} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={`absolute left-0 top-1/3 -translate-y-1/2 -translate-x-4 w-12 h-12 flex items-center justify-center transition-all duration-300 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed z-10 rounded-full ${buttonClass}`}
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={`absolute right-0 top-1/3 -translate-y-1/2 translate-x-4 w-12 h-12 flex items-center justify-center transition-all duration-300 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed z-10 rounded-full ${buttonClass}`}
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function Home() {
  const [activeTab, setActiveTab] = useState("kondapalli");
  const [isScrolled, setIsScrolled] = useState(false);

  // Parallax scroll effects
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  // Track scroll for header background change
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-[#1a1a1a] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        {/* Header */}
        <motion.header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled
              ? "bg-[#F5E8C8]/95 backdrop-blur-md border-b border-[#c9a227]/20 shadow-sm"
              : "bg-transparent border-b border-transparent"
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between h-20">
              {/* Left - Menu & Search */}
              <div className="flex items-center gap-5">
                <button className={`transition-colors duration-300 p-2 ${isScrolled ? "text-[#1a1a1a] hover:text-[#c9a227]" : "text-white hover:text-[#c9a227]"}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
                <button className={`transition-colors duration-300 p-2 ${isScrolled ? "text-[#1a1a1a] hover:text-[#c9a227]" : "text-white hover:text-[#c9a227]"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
              </div>

              {/* Center - Logo */}
              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="Lepakshi"
                    className={`h-12 transition-all duration-300 ${isScrolled ? "" : "brightness-0 invert"}`}
                  />
                </div>
              </Link>

              {/* Right - Actions */}
              <div className="flex items-center gap-5">
                <button className={`transition-colors duration-300 p-2 ${isScrolled ? "text-[#1a1a1a] hover:text-[#c9a227]" : "text-white hover:text-[#c9a227]"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
                <button className={`transition-colors duration-300 p-2 relative ${isScrolled ? "text-[#1a1a1a] hover:text-[#c9a227]" : "text-white hover:text-[#c9a227]"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c9a227] text-white text-[10px] font-semibold flex items-center justify-center rounded-full">2</span>
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[700px] pointer-events-none">
            <svg viewBox="0 0 300 350" className="w-full h-full text-[#c9a227]/20" fill="none" stroke="currentColor" strokeWidth="0.5">
              <path d="M50 350 L50 150 Q50 50 150 30 Q250 50 250 150 L250 350" />
              <path d="M70 350 L70 160 Q70 70 150 50 Q230 70 230 160 L230 350" />
              <circle cx="150" cy="100" r="30" />
              <circle cx="150" cy="100" r="20" />
            </svg>
          </div>
          <motion.p
            className="text-[#c9a227] text-xs tracking-[0.5em] uppercase mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Since 1982
          </motion.p>
          <motion.h1
            className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl lg:text-9xl text-white leading-[0.9] mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="block">Where</span>
            <motion.span
              className="block text-[#c9a227] italic"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Heritage
            </motion.span>
            <span className="block">Lives</span>
          </motion.h1>
          <motion.p
            className="text-white/70 text-lg max-w-md mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Curating Andhra Pradesh&apos;s finest handcrafted treasures from 5,000+ master artisans
          </motion.p>
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.a
              href="#collections"
              className="px-10 py-4 bg-[#c9a227] text-white font-medium tracking-wider hover:bg-[#b8922a] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              EXPLORE COLLECTION
            </motion.a>
            <motion.a
              href="#story"
              className="px-10 py-4 border border-white/40 text-white hover:border-[#c9a227] hover:text-[#c9a227] transition-colors tracking-wider"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              OUR STORY
            </motion.a>
          </motion.div>
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Scroll</span>
            <motion.div
              className="w-[1px] h-16 bg-gradient-to-b from-[#c9a227] to-transparent"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <div className="max-w-4xl mx-auto px-6 py-5">
            <div className="flex items-center justify-center divide-x divide-[#1a1a1a]/10">
              <AnimatedStat number="48+" label="Years of Legacy" />
              <AnimatedStat number="5000+" label="Artisan Partners" />
              <AnimatedStat number="100+" label="Craft Forms" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="bg-[#c9a227] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 text-white text-sm tracking-widest uppercase">
              Free Shipping Above Rs.2,999 | Authentic Handcrafted | Supporting 5000+ Artisans | GI Tagged Products
            </span>
          ))}
        </div>
      </div>

      {/* ========== CATEGORIES SECTION ========== */}
      <AnimatedSection id="collections" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div>
              <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#c9a227] to-[#f7d794] text-white text-xs tracking-[0.3em] uppercase mb-4 shadow-sm">Handcrafted Heritage</span>
              <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#1a1a1a]">Shop by <span className="italic text-[#c9a227]">Craft</span></h2>
            </div>
            <a href="#" className="mt-6 lg:mt-0 text-[#1a1a1a] hover:text-[#c9a227] transition-colors flex items-center gap-2 group">
              View All Categories
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>

          {/* Category Grid - Consistent aspect ratios */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {mainCategories.map((cat, index) => (
              <motion.a
                key={cat.id}
                href={`#${cat.id}`}
                className="group block"
                variants={scaleIn}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Category Image - Consistent 4:5 aspect ratio */}
                <div className={`aspect-[4/5] relative overflow-hidden bg-gradient-to-br ${cat.color}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  {/* Placeholder Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  </div>
                  {/* Category Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-[#f7d794] text-[10px] tracking-[0.3em] uppercase mb-1 block">{cat.tagline}</span>
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl text-white mb-1">{cat.name}</h3>
                    <p className="text-white/60 text-xs">{cat.productCount} Products</p>
                  </div>
                  <div className="absolute inset-0 bg-[#c9a227]/0 group-hover:bg-[#c9a227]/20 transition-colors duration-500" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ========== FEATURED PRODUCTS ========== */}
      <AnimatedSection className="py-24 px-6 bg-[#f7f5f0]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#c9a227] to-[#f7d794] text-white text-xs tracking-[0.3em] uppercase mb-4 shadow-sm">Artisan Picks</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#1a1a1a]">Featured <span className="italic text-[#c9a227]">Treasures</span></h2>
          </motion.div>
          <ProductCarousel products={featuredProducts} showCategory />
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-4 border-2 border-[#c9a227] text-[#c9a227] font-medium tracking-wider hover:bg-[#c9a227] hover:text-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              VIEW ALL PRODUCTS
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.a>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ========== CATEGORY BANNER CARDS ========== */}
      <AnimatedSection className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {categoryBanners.map((banner, index) => (
              <motion.a
                key={banner.id}
                href={`#${banner.id}`}
                className="group relative block overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="aspect-[4/3] md:aspect-[16/10] relative overflow-hidden bg-[#F5E8C8]">
                  {/* Placeholder Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F5E8C8] to-[#e8d9b8]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-white/40 flex items-center justify-center">
                        <svg className="w-16 h-16 text-[#c9a227]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-white mb-3">{banner.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm tracking-wider uppercase group-hover:text-[#E0AE31] transition-colors">
                      <span>Shop Our Edit</span>
                      <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ========== SPIRITUAL PRODUCTS ========== */}
      <AnimatedSection className="py-24 px-6 bg-gradient-to-b from-white to-[#f7f5f0]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#c9a227] to-[#f7d794] text-white text-xs tracking-[0.3em] uppercase mb-6 shadow-sm">Pooja & Devotion</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#1a1a1a]">Spiritual <span className="italic text-[#c9a227]">Essentials</span></h2>
            <p className="text-[#666] mt-4 max-w-xl mx-auto">Traditional temple art and devotional accessories</p>
          </motion.div>
          <ProductCarousel products={spiritualProducts} />
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-4 border-2 border-[#c9a227] text-[#c9a227] font-medium tracking-wider hover:bg-[#c9a227] hover:text-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              VIEW ALL SPIRITUAL PRODUCTS
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.a>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ========== MASTER'S PAVILION ========== */}
      <AnimatedSection className="relative py-0 overflow-hidden">
        <div className="relative min-h-[600px] md:min-h-[700px] bg-gradient-to-b from-[#3d3428] via-[#2a2318] to-[#1a1610]">
          {/* Spotlight Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-[#E0AE31]/20 via-transparent to-transparent blur-3xl" />

          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="pavilion-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="0.5" fill="currentColor" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pavilion-pattern)" className="text-[#E0AE31]" />
            </svg>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[600px] md:min-h-[700px]">
            {/* Content */}
            <motion.div
              className="text-center z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-5 py-2 border border-[#E0AE31]/50 text-[#E0AE31] text-xs tracking-[0.4em] uppercase mb-8">GI Tagged Heritage</span>
              <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl text-white leading-tight mb-6">
                Andhra&apos;s Finest <span className="italic text-[#E0AE31]">Masterpieces</span>
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                Each piece carries centuries of tradition. Museum-quality collectibles handcrafted by National Award-winning artisans.
              </p>
              <motion.a
                href="#"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#E0AE31] via-[#f5d77a] to-[#E0AE31] text-[#1a1a1a] font-medium tracking-wider shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
                }}
              >
                <span className="relative z-10">Explore Premium Collection</span>
                <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </motion.div>

            {/* Product Silhouettes */}
            <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-center gap-8 md:gap-16 px-6">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <motion.div
                  key={item}
                  className="w-16 md:w-24 h-20 md:h-32 bg-gradient-to-t from-[#E0AE31]/10 to-transparent rounded-t-lg"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ========== BESTSELLING TOYS ========== */}
      <AnimatedSection className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#c9a227] to-[#f7d794] text-white text-xs tracking-[0.3em] uppercase mb-4 shadow-sm">Iconic Wooden Toys</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#1a1a1a]">GI Tagged <span className="italic text-[#c9a227]">Collectibles</span></h2>
          </motion.div>
          <motion.div
            className="flex justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={() => setActiveTab("kondapalli")}
              className={`px-8 py-4 text-sm tracking-wider transition-all font-medium ${activeTab === "kondapalli" ? "bg-[#c9a227] text-white shadow-lg" : "bg-[#f7f5f0] text-[#666] hover:bg-[#eae6dd]"}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Kondapalli Toys
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("etikoppaka")}
              className={`px-8 py-4 text-sm tracking-wider transition-all font-medium ${activeTab === "etikoppaka" ? "bg-[#c9a227] text-white shadow-lg" : "bg-[#f7f5f0] text-[#666] hover:bg-[#eae6dd]"}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Etikoppaka Toys
            </motion.button>
          </motion.div>
          <ProductCarousel products={activeTab === "kondapalli" ? kondapalliProducts : etikoppakaProducts} />
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-4 border-2 border-[#c9a227] text-[#c9a227] font-medium tracking-wider hover:bg-[#c9a227] hover:text-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              VIEW ALL {activeTab === "kondapalli" ? "KONDAPALLI" : "ETIKOPPAKA"} PRODUCTS
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.a>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ========== TRIBAL PRODUCTS ========== */}
      <AnimatedSection className="py-24 px-6 bg-[#2d2a26] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="tribal-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#tribal-pattern)" className="text-white" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#c9a227] to-[#f7d794] text-white text-xs tracking-[0.3em] uppercase mb-6 shadow-sm">GIRIJAN Co-operative</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-white">Tribal <span className="italic text-[#7cb69d]">Treasures</span></h2>
            <p className="text-white/60 mt-4 max-w-xl mx-auto">Organic produce and crafts from Andhra&apos;s tribal communities</p>
          </div>
          <ProductCarousel products={tribalProducts} darkMode />
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-4 border-2 border-[#7cb69d] text-[#7cb69d] font-medium tracking-wider hover:bg-[#7cb69d] hover:text-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              VIEW ALL TRIBAL PRODUCTS
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.a>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ========== PREMIUM COLLECTIONS ========== */}
      <AnimatedSection className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#c9a227] to-[#f7d794] text-white text-xs tracking-[0.3em] uppercase mb-6 shadow-sm">Eco-Friendly Crafts</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#1a1a1a]">Natural Fibre <span className="italic text-[#c9a227]">Collections</span></h2>
            <p className="text-[#666] mt-4 max-w-xl mx-auto">Sustainable artistry using locally-sourced natural materials</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {premiumCollections.map((collection) => (
              <motion.a
                key={collection.name}
                href="#"
                className="group block"
                variants={scaleIn}
                whileHover={{ y: -10 }}
              >
                <div className={`aspect-[3/4] relative overflow-hidden bg-gradient-to-br ${collection.color}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}><path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" /></svg>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm">
                    <span className="text-xs font-semibold text-[#1a1a1a] tracking-wider">PREMIUM</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="text-white/60 text-xs tracking-[0.2em] uppercase">{collection.tagline}</span>
                    <h3 className="font-[family-name:var(--font-playfair)] text-3xl text-white mt-2 mb-3">{collection.name}</h3>
                    <p className="text-white/70 text-sm mb-4">{collection.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-sm">{collection.itemCount} Items</span>
                      <span className="text-white group-hover:text-[#f7d794] transition-colors flex items-center gap-2 text-sm font-medium">
                        Discover
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-[#c9a227]/0 group-hover:bg-[#c9a227]/10 transition-colors duration-500" />
                </div>
              </motion.a>
            ))}
          </motion.div>
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-4 border-2 border-[#c9a227] text-[#c9a227] font-medium tracking-wider hover:bg-[#c9a227] hover:text-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              VIEW ALL NATURAL FIBRE COLLECTIONS
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.a>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ========== PROMISE SECTION ========== */}
      <AnimatedSection className="relative py-24 bg-[#f7f5f0] overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#c9a227] to-[#f7d794] text-white text-xs tracking-[0.3em] uppercase mb-6 shadow-sm">APHDCL Assurance</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#1a1a1a] leading-tight">The Lepakshi <span className="italic text-[#c9a227]">Promise</span></h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Authentic Heritage", desc: "Centuries-old techniques" },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "Artisan First", desc: "Fair trade partnerships" },
              { icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", title: "GI Certified", desc: "Geographical Indication" },
              { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Sustainable", desc: "Eco-friendly materials" },
            ].map((item) => (
              <div key={item.title} className="p-8 bg-white border border-[#e5e0d5] hover:border-[#c9a227]/50 transition-all hover:shadow-lg text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#c9a227]/10 flex items-center justify-center group-hover:bg-[#c9a227]/20 transition-colors">
                  <svg className="w-8 h-8 text-[#c9a227]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1a1a1a] mb-2">{item.title}</h3>
                <p className="text-[#666] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ========== VISIT US / STORE LOCATIONS ========== */}
      <AnimatedSection className="py-24 bg-[#F5E8C8]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#596C45] to-[#7a9460] text-white text-xs tracking-[0.3em] uppercase mb-4 shadow-sm">Visit Our Emporiums</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#1a1a1a]">Experience <span className="italic text-[#596C45]">Lepakshi</span></h2>
          </motion.div>

          {/* Store Cards */}
          <div className="grid lg:grid-cols-3 gap-0 overflow-hidden">
            {/* Left Image */}
            <motion.div
              className="aspect-[4/3] lg:aspect-auto relative overflow-hidden bg-[#d4c4a8]"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center">
                  <svg className="w-12 h-12 text-[#596C45]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Center Info Card */}
            <motion.div
              className="relative bg-[#596C45] p-8 md:p-12 flex flex-col justify-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="store-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M10 0L20 10L10 20L0 10Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#store-pattern)" className="text-white" />
                </svg>
              </div>

              <div className="relative z-10">
                <h3 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-white mb-8">{storeLocations[0].name}</h3>

                <div className="space-y-5 text-white/90">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <p className="text-sm leading-relaxed">{storeLocations[0].address}</p>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm">{storeLocations[0].hours}</p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <p className="text-sm">{storeLocations[0].phone}</p>
                  </div>
                </div>

                <a
                  href={storeLocations[0].mapLink}
                  className="inline-flex items-center gap-2 mt-8 text-white/80 text-sm tracking-wider uppercase hover:text-white transition-colors group"
                >
                  <span>View on Google Maps</span>
                  <svg className="w-4 h-4 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              className="aspect-[4/3] lg:aspect-auto relative overflow-hidden bg-[#c9b896]"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center">
                  <svg className="w-12 h-12 text-[#596C45]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ========== STORIES & INSPIRATION ========== */}
      <AnimatedSection className="py-24 px-6 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#c9a227] to-[#f7d794] text-white text-xs tracking-[0.3em] uppercase mb-4 shadow-sm">Craft Chronicles</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#1a1a1a]">Stories Behind the <span className="italic text-[#596C45]">Craft</span></h2>
          </motion.div>

          {/* Story Cards Grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {editorialStories.map((story) => (
              <motion.a
                key={story.id}
                href="#"
                className="group block"
                variants={scaleIn}
                whileHover={{ y: -8 }}
              >
                {/* Story Image */}
                <div className="aspect-[4/3] relative overflow-hidden bg-[#e8e2d9] mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-[#596C45]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  </div>
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[10px] font-medium tracking-wider uppercase text-[#596C45]">
                    {story.category}
                  </span>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#596C45]/0 group-hover:bg-[#596C45]/10 transition-colors duration-300" />
                </div>

                {/* Story Content */}
                <div className="space-y-3">
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1a1a1a] group-hover:text-[#596C45] transition-colors leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed line-clamp-2">
                    {story.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[#999] text-xs">{story.readTime}</span>
                    <span className="text-[#596C45] text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* View All Link */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-4 border-2 border-[#596C45] text-[#596C45] font-medium tracking-wider hover:bg-[#596C45] hover:text-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              EXPLORE ALL CRAFT STORIES
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.a>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ========== NEWSLETTER ========== */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-[#2d2a26] to-[#1a1a1a] overflow-hidden">
        <div className="relative max-w-2xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#c9a227] to-[#f7d794] text-white text-xs tracking-[0.3em] uppercase mb-6 shadow-sm">Join Our Community</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-white mb-6">Stay Connected with <span className="italic text-[#c9a227]">Lepakshi</span></h2>
          <p className="text-white/60 mb-10">Get updates on new arrivals, artisan stories, and exclusive offers.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Your email address" className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[#c9a227]" />
            <button className="px-8 py-4 bg-[#c9a227] text-white font-medium tracking-wider hover:bg-[#b8922a] transition-colors">SUBSCRIBE</button>
          </form>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-[#352f29] text-white pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
            <div className="col-span-2">
              <Link href="/" className=" ">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Lepakshi" className="h-18 mb-2 brightness-0 invert" />
                </div>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed mb-6">Andhra Pradesh Handicrafts Development Corporation Ltd.<br />Preserving heritage, empowering artisans since 1982.</p>
              <div className="flex gap-4">
                {["instagram", "facebook", "youtube", "twitter"].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-[#E0AE31] transition-colors rounded">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /></svg>
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: "CRAFTS", links: ["Kalamkari Textiles", "Kondapalli Toys", "Etikoppaka Lacquer", "Pembarthi Brass", "Bidriware"] },
              { title: "COLLECTIONS", links: ["Spiritual & Pooja", "Tribal Products", "Natural Fibres", "New Arrivals", "Bestsellers"] },
              { title: "ABOUT US", links: ["Our Heritage", "Meet the Artisans", "GI Certifications", "Visit Stores", "Careers"] },
              { title: "SUPPORT", links: ["Contact Us", "FAQs", "Shipping Info", "Returns Policy", "Track Order"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[#E0AE31] font-medium mb-6 text-sm tracking-wider">{col.title}</h4>
                <ul className="space-y-3 text-white/60 text-sm">
                  {col.links.map((link) => (<li key={link}><a href="#" className="hover:text-[#E0AE31] transition-colors">{link}</a></li>))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">&copy; 2024 Lepakshi - APHDCL. All rights reserved.</p>
            <div className="flex gap-6 text-white/40 text-sm">
              <a href="#" className="hover:text-[#E0AE31] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#E0AE31] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
