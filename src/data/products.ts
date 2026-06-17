export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  description: string;
  features?: string[];
  caution?: string[];
  keywords?: string[];
  image: string;
  images?: string[];
  category: string;
  badge: string | null;
  isNew: boolean;
  inStock: boolean;
  hasTieredDiscount?: boolean;
}

export const products: Product[] = [
  {
    id: "vegetable-cutter",
    name: "3 in  1 Multi Functional Vegetable Cutter",
    price: 2490,
    originalPrice: 3599,
    description: "3-in-1 multi-functional cutter for grating, shredding, and slicing. Suction base; easy to clean.",
    keywords: [
      "vegetable slicer",
      "veg cutter",
      "grater",
      "shredder",
      "kitchen cutter",
      "manual cutter",
      "salad cutter",
    ],
    features: [
      "3 interchangeable stainless steel drum blades",
      "Easy-to-use hand-crank mechanism",
      "Angled dispenser reduces clogging",
      "Powerful suction base adheres to smooth non-porous work surfaces",
      "All pieces are detachable for cleaning",
    ],
    caution: [
      "Grater incorporates sharp blades. Use extreme caution when handling.",
      "Keep out of reach of children.",
    ],
    image: "/products/vegetable-cutter-1.jpeg",
    images: [
      "/products/vegetable-cutter-1.jpeg",
      "/products/vegetable-cutter-2.jpeg",
      "/products/vegetable-cutter-3.jpeg",
      "/products/vegetable-cutter-4.jpeg",
      "/products/vegetable-cutter-5.jpeg",
      "/products/vegetable-cutter-6.jpeg",
      "/products/vegetable-cutter-7.jpeg",
      "/products/vegetable-cutter-8.jpeg",
    ],
    category: "kitchen",
    badge: "31%",
    isNew: true,
    inStock: true,
  },
  {
    id: "stainless-steel-vegetable-cutter",
    name: "5 in 1 Stainless Steel Vegetable Cutter",
    price: 1390,
    originalPrice: 2199,
    description:
      "A durable 5 in 1 stainless steel vegetable cutter designed for fast slicing, shredding and grating. It is built for everyday kitchen use and delivers smooth cutting performance with detachable parts for easier cleaning.",
    keywords: [
      "vegetable slicer",
      "veg cutter",
      "stainless cutter",
      "grater",
      "shredder",
      "kitchen cutter",
      "manual cutter",
    ],
    features: [
      "Stainless steel cutting blades",
      "Fast slicing and shredding performance",
      "Easy to clean detachable parts",
      "Compact and practical kitchen design",
    ],
    caution: [
      "Blades are sharp. Handle with care.",
      "Keep out of reach of children.",
    ],
    image: "/products/stainless-steel-cutter-1.jpeg",
    images: [
      "/products/stainless-steel-cutter-1.jpeg",
      "/products/stainless-steel-cutter-2.jpeg",
      "/products/stainless-steel-cutter-3.jpeg",
      "/products/stainless-steel-cutter-4.jpeg",
      "/products/stainless-steel-cutter-5.jpeg",
      "/products/stainless-steel-cutter-6.jpeg",
      "/products/stainless-steel-cutter-7.jpeg",
      "/products/stainless-steel-cutter-8.jpeg",
    ],
    category: "kitchen",
    badge: "37%",
    isNew: true,
    inStock: true,
  },
  {
    id: "health-healer-night-cream",
    name: "The Health Healer Night Cream: Renew and Refresh Your Skin",
    price: 799,
    originalPrice: 1598,
    description:
      "Overnight renewal night cream that deeply hydrates, brightens dull skin, and helps reduce fine lines while you sleep. Lightweight, non-greasy formula suitable for daily use.",
    keywords: [
      "night cream",
      "skin renewal",
      "anti aging cream",
      "face cream Pakistan",
      "hydrating night cream",
      "Health Healer",
    ],
    features: [
      "Deep overnight hydration for softer, smoother skin",
      "Helps reduce the appearance of fine lines and dullness",
      "Lightweight, non-greasy formula absorbs quickly",
      "Suitable for nightly use on all skin types",
      "Dermatologically tested ingredients",
    ],
    caution: [
      "For external use only. Avoid contact with eyes.",
      "Patch test before first use if you have sensitive skin.",
    ],
    image: "/products/cream1.jpeg",
    images: [
      "/products/cream1.jpeg",
      "/products/cream2.jpeg",
      "/products/cream3.jpeg",
      "/products/cream4.jpeg",
      "/products/cream5.jpeg",
      "/products/cream6.png",
      "/products/cream7.png",
      "/products/cream8.png",
    ],
    category: "beauty",
    badge: "50%",
    isNew: true,
    inStock: true,
    hasTieredDiscount: true,
  },
  {
    id: "bare-anatomy-rosemary-spray",
    name: "Bare Anatomy Rosemary Water Spray for Hair Growth & Hair Fall Control - With Rice Water & 100% Natural Extracts - 200ml",
    price: 899,
    originalPrice: 1798,
    description:
      "Rosemary water hair spray enriched with rice water and 100% natural extracts to support hair growth, reduce hair fall, and refresh the scalp. 200ml bottle for daily use.",
    keywords: [
      "rosemary water spray",
      "hair growth spray",
      "hair fall control",
      "rice water hair spray",
      "Bare Anatomy",
      "natural hair care Pakistan",
    ],
    features: [
      "Rosemary water with rice water and natural extracts",
      "Supports hair growth and helps control hair fall",
      "Refreshes scalp and adds natural shine",
      "200ml spray bottle for easy daily application",
      "Free from harsh chemicals",
    ],
    caution: [
      "Avoid contact with eyes. Discontinue use if irritation occurs.",
      "Store in a cool, dry place away from direct sunlight.",
    ],
    image: "/products/rose1.jpg",
    images: [
      "/products/rose1.jpg",
      "/products/rose2.jpg",
      "/products/rose3.jpg",
      "/products/rose4.jpg",
      "/products/rose5.jpg",
      "/products/rose6.jpg",
      "/products/rose7.jpg",
      "/products/rose8.jpg",
    ],
    category: "beauty",
    badge: "48%",
    isNew: true,
    inStock: true,
    hasTieredDiscount: true,
  },
  {
    id: "feg-plus-hair-spray",
    name: "FEG Plus Hair Growth Spray",
    price: 799,
    originalPrice: 1598,
    description:
      "FEG Plus hair growth spray formulated to nourish follicles, strengthen roots, and promote thicker-looking hair. Easy spray application for targeted scalp care.",
    keywords: [
      "FEG Plus",
      "hair growth spray",
      "hair serum spray",
      "hair regrowth",
      "scalp treatment",
      "hair care Pakistan",
    ],
    features: [
      "Nourishes hair follicles for stronger roots",
      "Promotes thicker, fuller-looking hair",
      "Easy spray-on application for daily use",
      "Lightweight formula that doesn't weigh hair down",
      "Suitable for men and women",
    ],
    caution: [
      "For external use only. Keep out of reach of children.",
      "Consult a professional if you have a scalp condition.",
    ],
    image: "/products/serum1.jpeg",
    images: [
      "/products/serum1.jpeg",
      "/products/serum2.jpeg",
      "/products/serum3.jpeg",
      "/products/serum4.jpeg",
      "/products/serum5.jpeg",
      "/products/serum6.jpeg",
    ],
    category: "beauty",
    badge: "50%",
    isNew: true,
    inStock: true,
    hasTieredDiscount: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.id === slug);
}

export const categories = [
  { id: "all", name: "ALL" },
  { id: "kitchen", name: "KITCHEN" },
  { id: "beauty", name: "BEAUTY" },
  { id: "sale", name: "SALE" },
];
