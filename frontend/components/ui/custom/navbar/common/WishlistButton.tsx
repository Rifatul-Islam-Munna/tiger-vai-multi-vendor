"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({
  productId,
  className = "",
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    console.log("Wishlist:", productId);

    // TODO: Add your wishlist API call here
    // addToWishlist(productId);
  };

  return (
    <button
      onClick={handleWishlist}
      className={`w-8 h-8 sm:w-9 sm:h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110 z-10 ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-all duration-300 ${
          isWishlisted
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-500"
        }`}
      />
    </button>
  );
}
