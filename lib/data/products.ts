// Centralized Product Data for Lepakshi E-commerce

// ============================================
// INTERFACES
// ============================================

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  image: string;
  color: string;
  parentSlug: string; // "handicrafts" or "spiritual" - for URL hierarchy
  subcategories: Subcategory[];
}

// Parent category groupings for navigation
export interface CategoryGroup {
  id: string;
  name: string;
  slug: string;
  tagline: string;
}

export const categoryGroups: CategoryGroup[] = [
  { id: "handicrafts", name: "Handicrafts", slug: "handicrafts", tagline: "Traditional Andhra Craftsmanship" },
  { id: "spiritual", name: "Spiritual & Pooja", slug: "spiritual", tagline: "Divine Essentials" },
];

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  tag?: string;
  categoryId: string;
  subcategoryId: string;
  image: string;
  images?: string[];
  description?: string;
  highlights?: string[];
  specifications?: Record<string, string>;
  rating: number;
  reviews: number;
  inStock: boolean;
  sku?: string;
}

// ============================================
// CATEGORIES DATA
// ============================================

export const categories: Category[] = [
  {
    id: "textiles",
    name: "Textile & Weaves",
    slug: "textiles",
    tagline: "Heritage Fabrics",
    image: "/cat/cat-textiles.png",
    color: "bg-gradient-to-br from-[#d4a574] to-[#a67c52]",
    parentSlug: "handicrafts",
    subcategories: [
      { id: "kalamkari-prints", name: "Kalamkari Textile Prints", slug: "kalamkari-prints", categoryId: "textiles" },
      { id: "crochet-lace", name: "Crochet Lace", slug: "crochet-lace", categoryId: "textiles" },
      { id: "embroidery", name: "Applique / Embroidery Work", slug: "embroidery", categoryId: "textiles" },
    ],
  },
  {
    id: "metal",
    name: "Metal Crafts",
    slug: "metal",
    tagline: "Timeless Metalwork",
    image: "/cat/cat-metal.png",
    color: "bg-gradient-to-br from-[#b8860b] to-[#8b6914]",
    parentSlug: "handicrafts",
    subcategories: [
      { id: "brassware", name: "Brassware", slug: "brassware", categoryId: "metal" },
      { id: "bronze-castings", name: "Bronze Castings", slug: "bronze-castings", categoryId: "metal" },
      { id: "budithi-styles", name: "Onipenta / Budithi Styles", slug: "budithi-styles", categoryId: "metal" },
    ],
  },
  {
    id: "paintings",
    name: "Paintings",
    slug: "paintings",
    tagline: "Artistic Heritage",
    image: "/cat/cat-paintings.png",
    color: "bg-gradient-to-br from-[#c97b7b] to-[#8f4a4a]",
    parentSlug: "handicrafts",
    subcategories: [
      { id: "pen-kalamkari", name: "Pen Kalamkari", slug: "pen-kalamkari", categoryId: "paintings" },
      { id: "tribal-art", name: "Savara / Adivasi Tribal", slug: "tribal-art", categoryId: "paintings" },
      { id: "tanjore", name: "Tanjore Paintings", slug: "tanjore", categoryId: "paintings" },
      { id: "leather-puppetry", name: "Leather Puppetry", slug: "leather-puppetry", categoryId: "paintings" },
    ],
  },
  {
    id: "natural-fibres",
    name: "Natural Fibres",
    slug: "natural-fibres",
    tagline: "Eco-Friendly Craft",
    image: "/cat/cat-fibres.png",
    color: "bg-gradient-to-br from-[#7cb69d] to-[#4a8f6d]",
    parentSlug: "handicrafts",
    subcategories: [
      { id: "palm-leaf", name: "Palm Leaf Craft", slug: "palm-leaf", categoryId: "natural-fibres" },
      { id: "walking-sticks", name: "Walking Sticks", slug: "walking-sticks", categoryId: "natural-fibres" },
      { id: "bamboo", name: "Bamboo Craft", slug: "bamboo", categoryId: "natural-fibres" },
    ],
  },
  {
    id: "wood",
    name: "Wood Crafts & Toys",
    slug: "wood",
    tagline: "Artisan Woodwork",
    image: "/cat/cat-wood.png",
    color: "bg-gradient-to-br from-[#a0522d] to-[#6b3a1f]",
    parentSlug: "handicrafts",
    subcategories: [
      { id: "kondapalli", name: "Kondapalli Toys", slug: "kondapalli", categoryId: "wood" },
      { id: "etikoppaka", name: "Etikoppaka Lacquerware", slug: "etikoppaka", categoryId: "wood" },
      { id: "bobbili-veena", name: "Bobbili Veena", slug: "bobbili-veena", categoryId: "wood" },
      { id: "wooden-statues", name: "Wooden Statues", slug: "wooden-statues", categoryId: "wood" },
    ],
  },
  {
    id: "mineral",
    name: "Natural Minerals",
    slug: "mineral",
    tagline: "Earth's Artistry",
    image: "/cat/cat-mineral.png",
    color: "bg-gradient-to-br from-[#8b9eb3] to-[#5a7186]",
    parentSlug: "handicrafts",
    subcategories: [
      { id: "stone-carvings", name: "Stone Carvings - Durgi", slug: "stone-carvings", categoryId: "mineral" },
      { id: "pottery", name: "Pottery / Terracotta", slug: "pottery", categoryId: "mineral" },
    ],
  },
  {
    id: "spiritual",
    name: "Spiritual & Pooja",
    slug: "spiritual",
    tagline: "Divine Essentials",
    image: "/cat/cat-spiritual.png",
    color: "bg-gradient-to-br from-[#c9a227] to-[#9a7b1a]",
    parentSlug: "spiritual",
    subcategories: [
      { id: "agarbatti", name: "Agarbatti", slug: "agarbatti", categoryId: "spiritual" },
      { id: "dhoop", name: "Dhoop", slug: "dhoop", categoryId: "spiritual" },
      { id: "malas", name: "Malas", slug: "malas", categoryId: "spiritual" },
      { id: "pooja-items", name: "Pooja Items", slug: "pooja-items", categoryId: "spiritual" },
    ],
  },
  {
    id: "carpets",
    name: "Carpets",
    slug: "carpets",
    tagline: "Woven Excellence",
    image: "/cat/cat-carpets.png",
    color: "bg-gradient-to-br from-[#8b4513] to-[#654321]",
    parentSlug: "handicrafts",
    subcategories: [
      { id: "hand-knotted", name: "Hand-Knotted Carpets (Eluru)", slug: "hand-knotted", categoryId: "carpets" },
    ],
  },
];

// ============================================
// PRODUCTS DATA
// ============================================

export const products: Product[] = [
  // Kondapalli Products
  {
    id: 1,
    name: "Kondapalli Dashavatar Set",
    slug: "kondapalli-dashavatar-set",
    price: 4500,
    originalPrice: 5200,
    tag: "Bestseller",
    categoryId: "wood",
    subcategoryId: "kondapalli",
    image: "/products/kondapalli-dashavatar-box.png",
    images: ["/products/kondapalli-dashavatar-box.png"],
    description: "A beautifully crafted set depicting the ten avatars of Lord Vishnu, handmade by skilled Kondapalli artisans using traditional techniques.",
    highlights: [
      "Handcrafted by master artisans",
      "Made from soft Tella Poniki wood",
      "Natural vegetable dyes used",
      "Set of 10 figurines",
      "Perfect for home decor or gifting"
    ],
    specifications: {
      "Material": "Tella Poniki Wood",
      "Finish": "Natural vegetable dyes",
      "Set Contains": "10 figurines",
      "Origin": "Kondapalli, Andhra Pradesh",
      "Care": "Dust with soft cloth"
    },
    rating: 4.8,
    reviews: 124,
    inStock: true,
    sku: "KDP-001"
  },
  {
    id: 2,
    name: "Kondapalli Ambari Elephant",
    slug: "kondapalli-ambari-elephant",
    price: 5200,
    originalPrice: 6000,
    tag: "Premium",
    categoryId: "wood",
    subcategoryId: "kondapalli",
    image: "/products/kondapalli-ambari-elephant.png",
    images: ["/products/kondapalli-ambari-elephant.png"],
    description: "Majestic elephant with howdah, a signature Kondapalli piece symbolizing royalty and prosperity.",
    rating: 4.9,
    reviews: 78,
    inStock: true,
    sku: "KDP-002"
  },
  {
    id: 3,
    name: "Kondapalli Bullock Cart",
    slug: "kondapalli-bullock-cart",
    price: 2800,
    originalPrice: 3200,
    tag: undefined,
    categoryId: "wood",
    subcategoryId: "kondapalli",
    image: "/products/kondapalli-bullock-cart.png",
    images: ["/products/kondapalli-bullock-cart.png"],
    description: "Traditional bullock cart depicting rural Indian life, a classic Kondapalli collectible.",
    rating: 4.7,
    reviews: 56,
    inStock: true,
    sku: "KDP-003"
  },
  {
    id: 4,
    name: "Kondapalli Rama Set",
    slug: "kondapalli-rama-set",
    price: 3500,
    tag: "New",
    categoryId: "wood",
    subcategoryId: "kondapalli",
    image: "/products/kondapalli-rama-set.png",
    images: ["/products/kondapalli-rama-set.png"],
    description: "Beautiful depiction of Lord Rama, Sita, Lakshmana and Hanuman in traditional Kondapalli style.",
    rating: 4.6,
    reviews: 34,
    inStock: true,
    sku: "KDP-004"
  },
  {
    id: 5,
    name: "Kondapalli Fridge Magnets Set",
    slug: "kondapalli-fridge-magnets",
    price: 350,
    tag: "Popular",
    categoryId: "wood",
    subcategoryId: "kondapalli",
    image: "/products/kondapalli-fridge-magnets.png",
    images: ["/products/kondapalli-fridge-magnets.png"],
    description: "Set of colorful Kondapalli-style fridge magnets, perfect souvenirs and gifts.",
    rating: 4.5,
    reviews: 145,
    inStock: true,
    sku: "KDP-005"
  },

  // Etikoppaka Products
  {
    id: 6,
    name: "Etikoppaka Bridal Set",
    slug: "etikoppaka-bridal-set",
    price: 3200,
    originalPrice: 3800,
    tag: "Bestseller",
    categoryId: "wood",
    subcategoryId: "etikoppaka",
    image: "/products/etikoppaka-bridal-set.png",
    images: ["/products/etikoppaka-bridal-set.png"],
    description: "Colorful bridal couple set crafted with traditional Etikoppaka lacquerware techniques using natural dyes.",
    highlights: [
      "Made from Ankudu wood",
      "100% natural lac dyes",
      "Traditional lacquerware technique",
      "Perfect wedding gift",
      "GI tagged craft"
    ],
    rating: 4.8,
    reviews: 98,
    inStock: true,
    sku: "ETK-001"
  },
  {
    id: 7,
    name: "Etikoppaka Buttabomma",
    slug: "etikoppaka-buttabomma",
    price: 1200,
    tag: "Popular",
    categoryId: "wood",
    subcategoryId: "etikoppaka",
    image: "/products/etikoppaka-buttabomma.png",
    images: ["/products/etikoppaka-buttabomma.png"],
    description: "Traditional Buttabomma dancing doll, a signature Etikoppaka toy loved by children.",
    rating: 4.6,
    reviews: 234,
    inStock: true,
    sku: "ETK-002"
  },
  {
    id: 8,
    name: "Etikoppaka Counting Dolls",
    slug: "etikoppaka-counting-dolls",
    price: 850,
    tag: undefined,
    categoryId: "wood",
    subcategoryId: "etikoppaka",
    image: "/products/etikoppaka-counting-dolls.png",
    images: ["/products/etikoppaka-counting-dolls.png"],
    description: "Educational counting dolls for children, made with safe natural dyes.",
    rating: 4.7,
    reviews: 67,
    inStock: true,
    sku: "ETK-003"
  },
  {
    id: 9,
    name: "Etikoppaka Marriage Mandapam",
    slug: "etikoppaka-marriage-mandapam",
    price: 4500,
    originalPrice: 5200,
    tag: "Premium",
    categoryId: "wood",
    subcategoryId: "etikoppaka",
    image: "/products/etikoppaka-marriage-mandapam.png",
    images: ["/products/etikoppaka-marriage-mandapam.png"],
    description: "Elaborate marriage scene mandapam, a masterpiece of Etikoppaka craftsmanship.",
    rating: 4.9,
    reviews: 45,
    inStock: true,
    sku: "ETK-004"
  },
  {
    id: 10,
    name: "Etikoppaka Venna Krishna",
    slug: "etikoppaka-venna-krishna",
    price: 1800,
    tag: "New",
    categoryId: "wood",
    subcategoryId: "etikoppaka",
    image: "/products/etikoppaka-venna-krishna.png",
    images: ["/products/etikoppaka-venna-krishna.png"],
    description: "Baby Krishna with butter pot, a charming depiction in vibrant Etikoppaka colors.",
    rating: 4.8,
    reviews: 89,
    inStock: true,
    sku: "ETK-005"
  },

  // Spiritual Products
  {
    id: 11,
    name: "Premium Agarbatti 10-in-1",
    slug: "premium-agarbatti-10in1",
    price: 150,
    tag: "Bestseller",
    categoryId: "spiritual",
    subcategoryId: "agarbatti",
    image: "/spiritual/spiritual-agarbatti.png",
    images: ["/spiritual/spiritual-agarbatti.png"],
    description: "Premium collection of 10 different fragrances for your daily pooja and meditation.",
    rating: 4.9,
    reviews: 156,
    inStock: true,
    sku: "SPR-001"
  },
  {
    id: 12,
    name: "Rudraksha Mala",
    slug: "rudraksha-mala",
    price: 1200,
    originalPrice: 1500,
    tag: "Premium",
    categoryId: "spiritual",
    subcategoryId: "malas",
    image: "/spiritual/spiritual-rudraksha.png",
    images: ["/spiritual/spiritual-rudraksha.png"],
    description: "Authentic 5-mukhi Rudraksha mala with 108 beads for meditation and spiritual practice.",
    rating: 4.9,
    reviews: 78,
    inStock: true,
    sku: "SPR-002"
  },
  {
    id: 13,
    name: "Bronze Singing Bowl",
    slug: "bronze-singing-bowl",
    price: 2500,
    tag: undefined,
    categoryId: "spiritual",
    subcategoryId: "pooja-items",
    image: "/spiritual/spiritual-singing-bowl.png",
    images: ["/spiritual/spiritual-singing-bowl.png"],
    description: "Handcrafted bronze singing bowl for meditation, healing, and spiritual practices.",
    rating: 4.8,
    reviews: 45,
    inStock: true,
    sku: "SPR-003"
  },
  {
    id: 14,
    name: "Pure Sandal Powder",
    slug: "pure-sandal-powder",
    price: 450,
    tag: "Popular",
    categoryId: "spiritual",
    subcategoryId: "pooja-items",
    image: "/spiritual/spiritual-sandal.png",
    images: ["/spiritual/spiritual-sandal.png"],
    description: "100% pure sandalwood powder for tilak and religious ceremonies.",
    rating: 4.7,
    reviews: 89,
    inStock: true,
    sku: "SPR-004"
  },
  {
    id: 15,
    name: "Tulsi Mala",
    slug: "tulsi-mala",
    price: 350,
    tag: undefined,
    categoryId: "spiritual",
    subcategoryId: "malas",
    image: "/spiritual/spiritual-tulsi.png",
    images: ["/spiritual/spiritual-tulsi.png"],
    description: "Sacred Tulsi wood mala with 108 beads, ideal for chanting and meditation.",
    rating: 4.8,
    reviews: 67,
    inStock: true,
    sku: "SPR-005"
  },

  // Featured Products (from other categories)
  {
    id: 16,
    name: "Srikalahasti Kalamkari Saree",
    slug: "srikalahasti-kalamkari-saree",
    price: 15500,
    originalPrice: 18000,
    tag: "Bestseller",
    categoryId: "textiles",
    subcategoryId: "kalamkari-prints",
    image: "/feat/feat-kalamkari-saree.png",
    images: ["/feat/feat-kalamkari-saree.png"],
    description: "Authentic hand-painted Kalamkari saree from Srikalahasti with mythological motifs using natural dyes.",
    highlights: [
      "Hand-painted by master artisans",
      "100% natural vegetable dyes",
      "Pure cotton fabric",
      "Mythological narrative design",
      "GI tagged Srikalahasti Kalamkari"
    ],
    specifications: {
      "Material": "Pure Cotton",
      "Length": "6.3 meters with blouse",
      "Technique": "Pen Kalamkari",
      "Origin": "Srikalahasti, Andhra Pradesh",
      "Care": "Dry clean recommended"
    },
    rating: 4.9,
    reviews: 156,
    inStock: true,
    sku: "TXT-001"
  },
  {
    id: 17,
    name: "Pembarthi Brass Natya Ganapathi",
    slug: "pembarthi-brass-ganapathi",
    price: 6900,
    tag: "Popular",
    categoryId: "metal",
    subcategoryId: "brassware",
    image: "/feat/feat-brass-ganapathi.png",
    images: ["/feat/feat-brass-ganapathi.png"],
    description: "Exquisite dancing Ganesha sculpture in traditional Pembarthi brass sheet work.",
    rating: 4.8,
    reviews: 89,
    inStock: true,
    sku: "MTL-001"
  },
  {
    id: 18,
    name: "Tanjore Painting - Radha Krishna",
    slug: "tanjore-radha-krishna",
    price: 12500,
    originalPrice: 14000,
    tag: "Premium",
    categoryId: "paintings",
    subcategoryId: "tanjore",
    image: "/feat/feat-tanjore-painting.png",
    images: ["/feat/feat-tanjore-painting.png"],
    description: "Traditional Tanjore painting of Radha Krishna with gold foil work and semi-precious stones.",
    rating: 4.9,
    reviews: 67,
    inStock: true,
    sku: "PNT-001"
  },

  // New Kondapalli and Etikoppaka Products
  {
    id: 19,
    name: "Kondapalli Dasavatara Wooden Set",
    slug: "kondapalli-dasavatara-wooden-set",
    price: 2520,
    tag: "New",
    categoryId: "wood",
    subcategoryId: "kondapalli",
    image: "/products/kondapalli-dashavatar-box.png",
    images: ["/products/kondapalli-dashavatar-box.png"],
    description: "This handcrafted Kondapalli Dasavatara wooden set is created by skilled artisans of Andhra Pradesh using traditional techniques and Aale wood. Each figurine—depicting one of the ten avatars of Lord Vishnu—is individually carved and painted with natural, non-toxic colors. Compact, vibrant, and culturally rich, this set is perfect for home décor or gifting on festivals, housewarming ceremonies, and other spiritual occasions. A beautiful collectible that reflects India's timeless craftsmanship.",
    highlights: [
      "Handcrafted Kondapalli wooden set representing the ten avatars of Lord Vishnu",
      "Made from premium Aale wood and painted with natural, non-toxic colors",
      "Ideal for enhancing living rooms, showcases, pooja spaces, or office décor",
      "A meaningful gift option for festivals, housewarming events, and spiritual occasions",
      "Each compact figurine measuring 1.5 x 1.5 x 4 inches, easy to place anywhere",
      "An authentic Lepakshi Handicrafts product supporting artisan communities"
    ],
    specifications: {
      "Material": "Aale Wood",
      "Color": "Multicolor",
      "Theme": "Dasavatara",
      "Dimensions (per doll)": "1.5 x 1.5 x 4 inches",
      "Special Feature": "Handcrafted",
      "Uses": "Festivals, housewarming events, spiritual occasions"
    },
    rating: 4.8,
    reviews: 42,
    inStock: true,
    sku: "KDP-019"
  },
  {
    id: 20,
    name: "Kondapalli Maharaja Ambari Wooden Toy",
    slug: "kondapalli-maharaja-ambari-wooden-toy",
    price: 735,
    tag: "Popular",
    categoryId: "wood",
    subcategoryId: "kondapalli",
    image: "/products/kondapalli-ambari-elephant.png",
    images: ["/products/kondapalli-ambari-elephant.png"],
    description: "This handcrafted Kondapalli Maharaja Ambari Wooden Toy reflects the grandeur of India's royal traditions. Made using Aale wood and painted with natural, non-toxic colors, it showcases the artistry of Kondapalli Bommalu. The figurine captures the elegance of a royal Ambari procession with fine detailing and vibrant craftsmanship. Ideal for pooja rooms, showcases, or living spaces, this decorative piece brings cultural richness to your home. It also makes a meaningful gift for festivals, housewarming events, and birthdays. With its compact size of 5.5 x 2.5 x 8 inches, the toy is lightweight, durable, and easy to maintain.",
    highlights: [
      "Handcrafted Maharaja Ambari wooden toy representing a traditional royal procession",
      "Made from premium Aale wood and painted with eco-friendly, non-toxic natural colors",
      "Adds a cultural and elegant touch to showcases, pooja rooms, living rooms, or office décor",
      "A thoughtful gift for housewarming ceremonies, birthdays, and festive occasions",
      "Compact and lightweight design measuring 5.5 x 2.5 x 8 inches, easy to display anywhere",
      "Authentic Lepakshi Handicrafts piece supporting traditional Kondapalli artisans"
    ],
    specifications: {
      "Craft Name": "Kondapalli Toy Craft",
      "Material": "Aale Wood",
      "Color": "Multicolor",
      "Theme": "Royal Procession",
      "Dimensions": "5.5L x 2.5W x 8H inches",
      "Style": "Traditional",
      "Special Feature": "Eco-friendly, Non-toxic",
      "Specific Uses": "Decorative, Gifting, Showcase"
    },
    rating: 4.7,
    reviews: 38,
    inStock: true,
    sku: "KDP-020"
  },
  {
    id: 21,
    name: "Etikoppaka Bridal Couple Set",
    slug: "etikoppaka-bridal-couple-set",
    price: 1155,
    tag: "New",
    categoryId: "wood",
    subcategoryId: "etikoppaka",
    image: "/products/etikoppaka-bridal-set.png",
    images: ["/products/etikoppaka-bridal-set.png"],
    description: "This handcrafted Etikoppaka Bridal Couple Set beautifully captures the charm of a traditional Indian wedding couple. Made by artisans from Etikoppaka village—famous for its eco-friendly toy craft—this set is carved from local wood and painted using natural dyes extracted from seeds, bark, and leaves. Its vibrant finish and traditional detailing make it perfect for pooja rooms, showcases, wedding décor, or gifting on special occasions. Lightweight and easy to maintain, the set measures 6.5 x 2 x 8 inches, making it a stylish and culturally rich decorative piece for any home. A timeless collectible representing Andhra Pradesh's Etikoppaka craft heritage.",
    highlights: [
      "Handcrafted Etikoppaka bridal couple set showcasing traditional Indian wedding artistry",
      "Made from locally sourced wood and painted with natural, non-toxic, eco-friendly dyes",
      "A meaningful décor piece for showcases, pooja rooms, wedding décor, or cultural displays",
      "Ideal as a gift for weddings, anniversaries, housewarming events, and festive celebrations",
      "Compact and elegant design with figurines measuring 6.5 x 2 x 8 inches",
      "Authentic Lepakshi Handicrafts product supporting the artisans of Etikoppaka village"
    ],
    specifications: {
      "Craft Name": "Etikoppaka Toys",
      "Material": "Wood",
      "Color": "Multicolor",
      "Theme": "Bridal Couple",
      "Dimensions": "6.5L x 2W x 8H inches",
      "Finish Type": "Painted",
      "Special Feature": "Non-toxic, Eco-friendly",
      "Specific Uses": "Decorative, Wedding Gift"
    },
    rating: 4.8,
    reviews: 56,
    inStock: true,
    sku: "ETK-021"
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.categoryId === categoryId);
}

export function getProductsBySubcategory(subcategoryId: string): Product[] {
  return products.filter(p => p.subcategoryId === subcategoryId);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getCategoryGroupBySlug(slug: string): CategoryGroup | undefined {
  return categoryGroups.find(g => g.slug === slug);
}

export function getCategoriesByParent(parentSlug: string): Category[] {
  return categories.filter(c => c.parentSlug === parentSlug);
}

export function getSubcategoryById(id: string): Subcategory | undefined {
  for (const category of categories) {
    const subcategory = category.subcategories.find(s => s.id === id);
    if (subcategory) return subcategory;
  }
  return undefined;
}

export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): Subcategory | undefined {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;
  return category.subcategories.find(s => s.slug === subcategorySlug);
}

// Get full URL for a product: /parent/category/subcategory/product
export function getProductUrl(product: Product): string {
  const category = getCategoryById(product.categoryId);
  const subcategory = getSubcategoryById(product.subcategoryId);
  if (!category || !subcategory) return `/products/${product.id}`;
  return `/${category.parentSlug}/${category.slug}/${subcategory.slug}/${product.slug}`;
}

// Get URL for a category: /parent/category
export function getCategoryUrl(category: Category): string {
  return `/${category.parentSlug}/${category.slug}`;
}

// Get URL for a subcategory: /parent/category/subcategory
export function getSubcategoryUrl(category: Category, subcategory: Subcategory): string {
  return `/${category.parentSlug}/${category.slug}/${subcategory.slug}`;
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.tag === "Bestseller" || p.tag === "Premium").slice(0, 5);
}

export function getRelatedProducts(product: Product, limit: number = 4): Product[] {
  return products
    .filter(p => p.subcategoryId === product.subcategoryId && p.id !== product.id)
    .slice(0, limit);
}
