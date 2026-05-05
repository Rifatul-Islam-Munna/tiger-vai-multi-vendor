import {
  Car,
  Package,
  Shirt,
  Watch,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type ProductTypeId =
  | "clothing"
  | "tyre"
  | "electronics"
  | "accessories"
  | "general";

export type ProductTypeConfig = {
  id: ProductTypeId;
  name: string;
  icon: LucideIcon;
  description: string;
  bgColor: string;
  iconBg: string;
};

export const PRODUCT_TYPES: ProductTypeConfig[] = [
  {
    id: "clothing",
    name: "Clothing & Apparel",
    icon: Shirt,
    description: "T-shirts, pants, dresses, etc.",
    bgColor: "rgba(238, 74, 35, 0.1)",
    iconBg: "#ee4a23",
  },
  {
    id: "tyre",
    name: "Tyres & Wheels",
    icon: Car,
    description: "Car tyres, bike tyres, wheels",
    bgColor: "rgba(43, 39, 44, 0.1)",
    iconBg: "#342f2c",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: Zap,
    description: "Phones, laptops, accessories",
    bgColor: "rgba(196, 61, 29, 0.1)",
    iconBg: "#c43d1d",
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: Watch,
    description: "Jewelry, bags, watches",
    bgColor: "rgba(255, 133, 102, 0.15)",
    iconBg: "#ff8566",
  },
  {
    id: "general",
    name: "Other Products",
    icon: Package,
    description: "Products not listed above",
    bgColor: "rgba(134, 146, 156, 0.1)",
    iconBg: "#86929c",
  },
];

const PRODUCT_TYPE_IDS = new Set<ProductTypeId>(
  PRODUCT_TYPES.map((type) => type.id),
);

export const isProductTypeId = (value: string | null): value is ProductTypeId =>
  !!value && PRODUCT_TYPE_IDS.has(value as ProductTypeId);

const PRODUCT_TYPE_KEYWORDS: { type: ProductTypeId; keywords: string[] }[] = [
  { type: "tyre", keywords: ["tyre", "tire", "wheel", "rim"] },
  {
    type: "clothing",
    keywords: ["cloth", "apparel", "fashion", "shirt", "pant", "dress", "shoe"],
  },
  {
    type: "electronics",
    keywords: ["electronic", "phone", "laptop", "computer", "camera", "audio"],
  },
  {
    type: "accessories",
    keywords: ["accessory", "accessories", "watch", "bag", "jewelry"],
  },
];

export const inferProductType = (...values: string[]): ProductTypeId => {
  const text = values.filter(Boolean).join(" ").toLowerCase();
  const match = PRODUCT_TYPE_KEYWORDS.find(({ keywords }) =>
    keywords.some((keyword) => text.includes(keyword)),
  );

  return match?.type || "general";
};
