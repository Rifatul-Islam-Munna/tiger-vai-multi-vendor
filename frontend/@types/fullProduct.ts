export interface ProductImage {
  url: string;
  key: string;
  id: string;
}

export interface ProductCategory {
  main: string;
  subMain?: string;
  semiSub?: string;
  category: string;
}

export interface Feature {
  name: string;
  description?: string;
}

export interface BrandInfo {
  id: string;
  name: string;
}

export interface ProductVariant {
  size: string;
  color: string;
  price: number;
  stock?: number;
  discountPrice?: number;
  image?: ProductImage;
  sku?: string;
  isAvailable?: boolean;
}

export interface CreateProduct {
  name: string;
  description?: string;
  price: number;
  stock: number;

  variants?: ProductVariant[];

  features: Feature[];

  thumbnail: ProductImage;
  images: ProductImage[];

  category: ProductCategory;
  brand: BrandInfo;

  main?: string;
  subMain?: string;
  semiSub?: string;

  isActive?: boolean;
  isDeleted?: boolean;

  height?: number;
  width?: number;
  weight?: string;
  size?: string;

  colors?: string[];

  warrantyPeriod?: string;
  returnPolicy?: string;

  isDigital?: boolean;
  hasOffer?: boolean;

  offerPrice?: number;
  offerExpiresAt?: Date;

  specifications?: Record<string, string>;

  shippingTime?: string;
  shippingCost?: number;
  freeShipping?: boolean;

  certifications?: string[];

  isAdminCreated: boolean;
}

export interface Product extends CreateProduct {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}