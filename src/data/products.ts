export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  description: string;
  features?: string[];
  caution?: string[];
  image: string;
  images?: string[];
  category: string;
  badge: string | null;
  isNew: boolean;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "vegetable-cutter",
    name: "Multi Functional Vegetable Cutter",
    price: 2490,
    originalPrice: 3599,
    description:
      "A fast, efficient hand powered rotary grater that quickly and easily grates, shreds and slices cheese, vegetables, biscuits, nuts and more. Featuring a wide hopper that allows substantial quantities of food to be grated or sliced in seconds and a food pusher that keeps fingers away from the blades. Three different stainless steel drum blades deliver fine grating, coarse grating/shredding and slicing. Drum blades switch out for easy cleaning. An angled dispenser reduces any clogging and a suction base securely attaches the unit to a clean, dry, non-porous surface. A reliable and durable does-it-all countertop companion.",
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
    badge: "DISCOUNT",
    isNew: true,
    inStock: true,
  },
  {
    id: "stainless-steel-vegetable-cutter",
    name: "Stainless Steel Vegetable Cutter",
    price: 1390,
    originalPrice: 2199,
    description:
      "A durable stainless steel vegetable cutter designed for fast slicing, shredding and grating. It is built for everyday kitchen use and delivers smooth cutting performance with detachable parts for easier cleaning.",
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
    badge: "DISCOUNT",
    isNew: true,
    inStock: true,
  },
];

export const categories = [
  { id: "all", name: "ALL" },
  { id: "kitchen", name: "KITCHEN" },
  { id: "sale", name: "SALE" },
];
