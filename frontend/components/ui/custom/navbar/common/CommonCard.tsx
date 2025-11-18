"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Link from "next/link";
import { WishlistButton } from "./WishlistButton";

interface ShortProduct {
  _id: string;
  name: string;
  thumbnail: string;
  main: string;
  category: string;
  price: number;
  offerPrice?: number;
  hasOffer: boolean;
  brandName: string;
  slug: string;
  stock: number;
  hotDeals?: boolean;
  hotOffer?: boolean;
  productOfTheDay?: boolean;
  rating?: number;
  reviews?: number;
}

interface ProductCardProps {
  product: ShortProduct;
  variant?: "default" | "compact" | "featured";
}

export function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const discount = product?.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  const isOutOfStock = product?.stock === 0;

  if (variant === "default") {
    return (
      <Card className="group relative border pt-0 rounded-lg overflow-hidden bg-white transition-all shadow-none duration-300 hover:border-gray-300 flex flex-col">
        <Link
          href={isOutOfStock ? "#" : `/product-details/${product?.slug}`}
          className={isOutOfStock ? "pointer-events-none" : ""}
        >
          {/* Fixed Height Image Container */}
          <div className="relative w-full h-44 sm:h-48 md:h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
            {/* Discount Badge */}
            {product?.hasOffer && discount > 0 && (
              <Badge className="absolute top-2 left-2 z-10 bg-palette-btn/70 text-white border-0 text-[10px] sm:text-xs px-2 py-0.5 font-bold shadow-md">
                {discount}% OFF
              </Badge>
            )}

            {/* Product Image */}
            <img
              src={
                imageError
                  ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
                  : product?.thumbnail
              }
              onError={() => setImageError(true)}
              alt={product?.name}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />

            {/* Wishlist Button - Separate Component */}
            <div className="absolute top-2 right-2">
              <WishlistButton productId={product._id} />
            </div>

            {/* Stock Badge */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 sm:p-3">
              {product?.stock > 0 ? (
                <p className="text-green-400 text-[10px] sm:text-xs font-semibold">
                  {product?.stock} in stock
                </p>
              ) : (
                <p className="text-red-400 text-[10px] sm:text-xs font-semibold">
                  Out of Stock
                </p>
              )}
            </div>

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center z-20">
                <span className="text-white font-bold text-sm bg-red-500 px-4 py-2 rounded-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Card Content */}
          <CardContent className="p-2 flex flex-col flex-grow">
            {/* Brand Name */}
            {product?.brandName && (
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide mb-1 truncate">
                {product?.brandName}
              </p>
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2 group-hover:text-palette-btn transition-colors leading-tight  mb-2">
              {product?.name}
            </h3>

            {/* Price Section */}
            <div className="mt-auto">
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold  text-palette-btn">
                  ৳
                  {product?.offerPrice
                    ? product?.offerPrice?.toLocaleString()
                    : product?.price?.toLocaleString()}
                </span>
                {product.hasOffer && product.offerPrice && (
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    ৳{product?.price?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <Card className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white transition-all duration-300 hover:shadow-md flex flex-col">
        <Link
          href={isOutOfStock ? "#" : `/product-details/${product?.slug}`}
          className={isOutOfStock ? "pointer-events-none opacity-60" : ""}
        >
          <div className="relative w-full h-32 sm:h-40 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
            <img
              src={
                imageError
                  ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
                  : product?.thumbnail
              }
              onError={() => setImageError(true)}
              alt={product?.name}
              className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            />

            {product?.hasOffer && discount > 0 && (
              <Badge className="absolute top-1.5 left-1.5 bg-purple-600 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 font-bold">
                {discount}%
              </Badge>
            )}

            {/* Stock on image */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
              <p
                className={`text-[9px] sm:text-[10px] font-semibold ${
                  product?.stock > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {product?.stock > 0
                  ? `${product?.stock} in stock`
                  : "Out of Stock"}
              </p>
            </div>
          </div>

          <CardContent className="p-2 sm:p-2.5 flex flex-col flex-grow">
            {/* Product Name */}
            <h4 className="font-medium text-gray-900 text-[11px] sm:text-xs md:text-sm line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight h-8 sm:h-9 mb-1.5">
              {product?.name}
            </h4>

            {/* Price */}
            <div className="mt-auto flex items-baseline gap-1.5">
              <p className="text-red-500 font-bold text-xs sm:text-sm md:text-base">
                ৳
                {product?.offerPrice
                  ? product?.offerPrice?.toLocaleString()
                  : product?.price?.toLocaleString()}
              </p>
              {product.hasOffer && product.offerPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  ৳{product?.price?.toLocaleString()}
                </span>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  return null;
}
