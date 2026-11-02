export type Size = string;

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: "tees" | "outerwear" | "accessories";
  sizes: Size[];
  description: string;
  details: string[];
  images: { src: string; alt: string }[];
  baagUrl?: string;
  featured?: boolean;
};

export function slugifyProductName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-") || "piece";
}

export function normalizeProductDetails(details: string[]) {
  return Array.from(new Set(details.map((d) => d.trim()).filter(Boolean))).slice(0, 6);
}

export const PRODUCTS: Product[] = [
  {
    slug: "3-lip-combo-tee",
    name: "3 Lip Combo Tee",
    price: 4800,
    category: "tees",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    description:
      "Oversized white tee. Single lip print on the chest. Three stacked xerox mouths down the back. Fallen angel mark at the collar.",
    details: [
      "240gsm heavyweight cotton",
      "Boxy oversized cut",
      "Screen print, front and back",
      "Sizes S–XL",
    ],
    images: [
      { src: "/products/3-lip-combo.jpg", alt: "3 Lip Combo tee front and back mockup" },
      { src: "/products/3-lip-combo-back.jpg", alt: "3 Lip Combo tee back print" },
    ],
  },
  {
    slug: "fallen-angel-tee",
    name: "Fallen Angel Tee",
    price: 4800,
    category: "tees",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    description:
      "The house mark, large. Black oval with the falling figure, printed on white heavyweight cotton.",
    details: [
      "240gsm heavyweight cotton",
      "Boxy oversized cut",
      "Chest print",
      "Sizes S–XL",
    ],
    images: [{ src: "/products/fallen-angel-tee.jpg", alt: "Fallen Angel oval print tee" }],
  },
  {
    slug: "lip-longsleeve",
    name: "Lip Longsleeve",
    price: 5800,
    category: "tees",
    sizes: ["S", "M", "L", "XL"],
    description:
      "White long sleeve. One grainy lip print on the left chest. Quiet from a distance, loud up close.",
    details: [
      "220gsm cotton jersey",
      "Rib cuffs",
      "Left-chest print",
      "Sizes S–XL",
    ],
    images: [{ src: "/products/lip-longsleeve.jpg", alt: "White longsleeve with lip print" }],
  },
  {
    slug: "veil-hoodie",
    name: "Veil Hoodie",
    price: 8800,
    category: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    description:
      "Heavyweight pullover. Small fallen-angel mark on the chest. Black cords. Built to last a season and then another.",
    details: [
      "460gsm fleece",
      "Kangaroo pocket",
      "Embroidered chest mark",
      "Sizes S–XL",
    ],
    images: [{ src: "/products/veil-hoodie.jpg", alt: "Cream hoodie with oval logo" }],
  },
  {
    slug: "oval-cap",
    name: "Oval Cap",
    price: 3200,
    category: "accessories",
    sizes: ["M"],
    description:
      "Black five-panel. White embroidered oval and falling figure. One size, structured brim.",
    details: ["Cotton twill", "Adjustable strap", "Embroidered front", "One size (fits M)"],
    images: [{ src: "/products/oval-cap.jpg", alt: "Black cap with white angel oval" }],
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "tees", label: "Tees" },
  { id: "outerwear", label: "Outerwear" },
  { id: "accessories", label: "Accessories" },
] as const;

export const SHIPPING_CENTS = 800;
export const FREE_SHIPPING_AT = 12000;
