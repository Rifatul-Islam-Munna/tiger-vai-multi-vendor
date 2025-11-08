"use client";

import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discount = product?.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  const rating = product?.rating || 4.5;
  const reviews = product?.reviews || 0;

  // Handle actions with console logs
  const handleAddToCart = () => {
    console.log("Add to cart:", product?._id);
    // Add your cart logic here
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log("Wishlist:", product?._id);
    // Add your wishlist logic here
  };

  const handleViewDetails = () => {
    console.log("View details:", product?.slug);
    router.push(`/product-details/${product?.slug}`);
  };

  // Default variant
  if (variant === "default") {
    return (
      <Card className="border-0  hover:shadow-sm transition-all pt-0 duration-300 group overflow-hidden h-full flex flex-col shadow-none">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 z-10 flex gap-2 flex-wrap">
            {product?.hotDeals && (
              <Badge className="bg-palette-btn text-white border-0 text-xs font-bold">
                🔥 Hot Deal
              </Badge>
            )}
            {product?.hotOffer && (
              <Badge className="bg-palette-btn text-white border-0 text-xs font-bold">
                ⚡ Offer
              </Badge>
            )}
            {product?.productOfTheDay && (
              <Badge className="bg-palette-btn text-white border-0 text-xs font-bold">
                ⭐ Featured
              </Badge>
            )}
            {product?.hasOffer && discount > 0 && (
              <Badge className="bg-palette-btn text-white border-0 text-xs font-bold">
                {discount}% OFF
              </Badge>
            )}
          </div>

          {/* Image */}
          <img
            src={
              imageError
                ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
                : product?.thumbnail
            }
            onError={() => setImageError(true)}
            alt={product?.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 aspect-square"
          />

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isWishlisted
                  ? "fill-palette-btn text-palette-btn"
                  : "text-gray-400 hover:text-palette-btn"
              }`}
            />
          </button>

          {/* Stock Badge */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p
              className={`text-xs font-semibold ${
                product?.stock > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {product?.stock > 0
                ? `${product?.stock} in stock`
                : "Out of Stock"}
            </p>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Category */}
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
            {product?.category}
          </p>

          {/* Brand */}
          <p className="text-xs text-palette-text font-bold mb-2">
            {product?.brandName}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-palette-text text-sm mb-3 line-clamp-2 group-hover:text-palette-btn transition-colors">
            {product?.name}
          </h3>

          {/* Rating */}
          {reviews > 0 && (
            <div className="flex sm:hidden items-center gap-1 mb-3 ">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(rating)
                        ? "fill-palette-btn text-palette-btn"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({reviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-lg font-bold text-palette-btn">
              ৳
              {product?.offerPrice
                ? product?.offerPrice?.toLocaleString()
                : product?.price?.toLocaleString()}
            </span>
            {product.hasOffer && product.offerPrice && (
              <span className="text-sm text-gray-500 line-through">
                ৳{product?.price?.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0 gap-2">
          <Button
            onClick={handleViewDetails}
            disabled={product?.stock === 0}
            className="flex-1 bg-palette-btn hover:bg-palette-btn/90 text-white h-9 text-sm font-semibold rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={product?.stock === 0}
            size="icon"
            className="h-9 w-9 bg-palette-btn hover:bg-palette-btn/90 text-white rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <Card
        onClick={handleViewDetails}
        className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
      >
        <CardContent className="p-3">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
            <img
              src={
                imageError
                  ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
                  : product?.thumbnail
              }
              onError={() => setImageError(true)}
              alt={product?.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {product?.hasOffer && discount > 0 && (
              <div className="absolute top-2 left-2 bg-palette-btn text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}%
              </div>
            )}
          </div>

          <h4 className="font-semibold text-palette-text text-xs line-clamp-2 mb-1 group-hover:text-palette-btn transition-colors">
            {product?.name}
          </h4>

          <p className="text-palette-btn font-bold text-sm">
            ৳
            {product?.offerPrice
              ? product?.offerPrice?.toLocaleString()
              : product?.price?.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Featured variant
  if (variant === "featured") {
    return (
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden lg:col-span-2">
        <div className="grid grid-cols-3 gap-0 h-64">
          <div className="col-span-2 bg-gray-100 overflow-hidden relative">
            <img
              src={
                imageError
                  ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"
                  : product?.thumbnail
              }
              onError={() => setImageError(true)}
              alt={product?.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {product?.productOfTheDay && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-palette-btn text-white border-0 font-bold">
                  ⭐ Featured
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="col-span-1 p-6 flex flex-col justify-between bg-palette-bg">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase mb-2">
                {product?.category}
              </p>
              <h3 className="font-bold text-palette-text text-lg mb-3 line-clamp-3 group-hover:text-palette-btn transition-colors">
                {product?.name}
              </h3>

              {reviews > 0 && (
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rating)
                          ? "fill-palette-btn text-palette-btn"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}

              <div className="space-y-1">
                <p className="text-2xl font-bold text-palette-btn">
                  ৳
                  {product?.offerPrice
                    ? product?.offerPrice?.toLocaleString()
                    : product?.price?.toLocaleString()}
                </p>
                {product?.hasOffer && product?.offerPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    ৳{product?.price?.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product?.stock === 0}
              className="w-full bg-palette-btn hover:bg-palette-btn/90 text-white font-semibold rounded transition-all disabled:opacity-50"
            >
              Add to Cart
            </Button>
          </CardContent>
        </div>
      </Card>
    );
  }

  return null;
}
