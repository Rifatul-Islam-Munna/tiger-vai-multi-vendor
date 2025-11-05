// app/account/wishlist/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductCard } from "@/components/ui/custom/navbar/common/CommonCard";

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

// Demo wishlist data
const demoWishlistProducts: ShortProduct[] = [
  {
    _id: "1",
    name: "Premium Wireless Bluetooth Headphones",
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    main: "ELECTRONICS",
    category: "Audio",
    price: 299.99,
    offerPrice: 249.99,
    hasOffer: true,
    brandName: "AudioTech Pro",
    slug: "premium-wireless-bluetooth-headphones",
    stock: 25,
    hotDeals: true,
    rating: 4.8,
    reviews: 128,
  },
  {
    _id: "2",
    name: "Smart Watch Pro Max",
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    main: "ELECTRONICS",
    category: "Watches",
    price: 399.99,
    offerPrice: 299.99,
    hasOffer: true,
    brandName: "TechWear",
    slug: "smart-watch-pro-max",
    stock: 15,
    hotOffer: true,
    rating: 4.6,
    reviews: 95,
  },
  {
    _id: "3",
    name: "Professional Running Shoes",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    main: "FASHION",
    category: "Shoes",
    price: 129.99,
    offerPrice: 99.99,
    hasOffer: true,
    brandName: "SportZone",
    slug: "professional-running-shoes",
    stock: 42,
    productOfTheDay: true,
    rating: 4.7,
    reviews: 256,
  },
  {
    _id: "4",
    name: "4K Webcam Ultra HD",
    thumbnail:
      "https://images.unsplash.com/photo-1598657915753-b6b5ed74dba4?w=400&h=400&fit=crop",
    main: "ELECTRONICS",
    category: "Cameras",
    price: 179.99,
    hasOffer: false,
    brandName: "CameraPro",
    slug: "4k-webcam-ultra-hd",
    stock: 8,
    rating: 4.5,
    reviews: 47,
  },
  {
    _id: "5",
    name: "Portable Power Bank 50000mAh",
    thumbnail:
      "https://images.unsplash.com/photo-1609429605320-6d410c47a236?w=400&h=400&fit=crop",
    main: "ELECTRONICS",
    category: "Accessories",
    price: 45.99,
    offerPrice: 34.99,
    hasOffer: true,
    brandName: "PowerTech",
    slug: "portable-power-bank-50000mah",
    stock: 120,
    hotDeals: true,
    rating: 4.9,
    reviews: 312,
  },
  {
    _id: "6",
    name: "Premium Leather Wallet",
    thumbnail:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    main: "FASHION",
    category: "Accessories",
    price: 89.99,
    hasOffer: false,
    brandName: "LuxeStyle",
    slug: "premium-leather-wallet",
    stock: 0,
    rating: 4.4,
    reviews: 73,
  },
  {
    _id: "7",
    name: "Wireless Gaming Mouse",
    thumbnail:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
    main: "ELECTRONICS",
    category: "Gaming",
    price: 79.99,
    offerPrice: 59.99,
    hasOffer: true,
    brandName: "GameGear",
    slug: "wireless-gaming-mouse",
    stock: 33,
    hotOffer: true,
    rating: 4.7,
    reviews: 189,
  },
  {
    _id: "8",
    name: "Cotton T-Shirt Classic",
    thumbnail:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    main: "FASHION",
    category: "Clothing",
    price: 29.99,
    offerPrice: 19.99,
    hasOffer: true,
    brandName: "ComfortWear",
    slug: "cotton-t-shirt-classic",
    stock: 200,
    productOfTheDay: true,
    rating: 4.5,
    reviews: 420,
  },
];

const ITEMS_PER_PAGE = 8;

export default function WishlistPage() {
  const [wishlist, setWishlist] =
    useState<ShortProduct[]>(demoWishlistProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "newest" | "price-low" | "price-high" | "popular"
  >("newest");

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...wishlist];
    switch (sortBy) {
      case "price-low":
        return sorted.sort(
          (a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price)
        );
      case "price-high":
        return sorted.sort(
          (a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price)
        );
      case "popular":
        return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      case "newest":
      default:
        return sorted;
    }
  }, [wishlist, sortBy]);

  // Paginate
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p._id !== productId));
    console.log("Removed from wishlist:", productId);
  };

  const handleAddToCart = (productId: string) => {
    console.log("Add to cart:", productId);
    // Add to cart logic here
  };

  const handleViewDetails = (slug: string) => {
    console.log("View details:", slug);
    // Navigate to product details
  };

  return (
    <div className="w-full space-y-6 container mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-palette-text">My Wishlist</h2>
        <p className="text-palette-text/60 text-sm mt-2">
          {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {wishlist.length === 0 ? (
        // Empty State
        <Card className="border border-gray-200 shadow-none">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl">🛍️</div>
              <h3 className="text-2xl font-bold text-palette-text">
                Your wishlist is empty
              </h3>
              <p className="text-palette-text/60">
                Add items to your wishlist to save them for later
              </p>
              <Button className="bg-palette-btn hover:bg-palette-btn/90 text-white mt-4">
                Start Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filters & Sort */}
          <div className="flex justify-between items-center gap-4">
            <div className="text-sm text-palette-text/60">
              Showing {startIdx + 1} to{" "}
              {Math.min(startIdx + ITEMS_PER_PAGE, sortedProducts.length)} of{" "}
              {sortedProducts.length} items
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-palette-text">
                Sort by:
              </label>
              <Select
                value={sortBy}
                onValueChange={(value: any) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] border border-gray-200">
                  <SelectValue placeholder="Select sort option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedProducts.map((product) => (
              <div key={product._id} className="relative group">
                <ProductCard
                  product={product}
                  variant="default"
                  onAddToCart={() => handleAddToCart(product._id)}
                  onAddToWishlist={() => handleRemoveFromWishlist(product._id)}
                  onViewDetails={() => handleViewDetails(product.slug)}
                />
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="text-sm text-palette-text/60">
              Page {currentPage} of {totalPages}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(idx + 1)}
                      isActive={currentPage === idx + 1}
                      className={
                        currentPage === idx + 1
                          ? "bg-palette-btn text-white hover:bg-palette-btn/90"
                          : ""
                      }
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}
