"use client";
import React, { useEffect, useState } from "react";
import {
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Product, ReviewStats } from "@/@types/fullProduct";
import { useQueryState } from "nuqs";
import { CartItem, useCartStore } from "@/zustan-hook/cart";
import { toast } from "sonner";
import ReviewForm from "./Rating-form";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { Reviews } from "@/@types/review";
import ReviewsList from "./user-review";
import { useWishHook } from "@/zustan-hook/wishListhook";
import { useCommonMutationApi } from "@/api-hook/mutation-common";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ShareProductDialog } from "./share-product-dialog";
import { v4 as uuidv4 } from "uuid";
import { getUserInfo } from "@/actions/auth";
import {
  addToCartEvent,
  initiateCheckoutEvent,
} from "@/lib/google-tag-manager";
import {
  addToCartServerEvent,
  initiateCheckoutServerEvent,
} from "@/actions/metaEvent";
import { User } from "@/@types/auth-response";
import { BasicUser } from "@/@types/userType";

const RatingBreakdown = ({ stats }: { stats: ReviewStats | undefined }) => {
  const getCount = (rating: number): number => {
    switch (rating) {
      case 5:
        return stats?.count5 ?? 0;
      case 4:
        return stats?.count4 ?? 0;
      case 3:
        return stats?.count3 ?? 0;
      case 2:
        return stats?.count2 ?? 0;
      case 1:
        return stats?.count1 ?? 0;
      default:
        return 0;
    }
  };

  const getWidth = (rating: number): string => {
    const count = getCount(rating);
    const total = stats?.totalReviews ?? 0;

    // If no reviews, return 0%
    if (total === 0) return "0%";

    // Calculate percentage
    return `${Math.round((count / total) * 100)}%`;
  };

  return (
    <div className="flex-1">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center gap-3 mb-1">
          <span className="text-sm w-3 text-gray-700 font-medium">
            {rating}
          </span>

          <Star className="w-4 h-4 fill-palette-btn text-palette-btn" />

          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-palette-btn h-full rounded-full transition-all duration-300"
              style={{ width: getWidth(rating) }}
            ></div>
          </div>

          <span className="text-sm text-gray-500 w-10 text-right">
            {getCount(rating)}
          </span>
        </div>
      ))}
    </div>
  );
};

const ProductPage = ({ params }: { params: Product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  /*   const [selectedSize, setSelectedSize] = useQueryState("size");
  const [selectedColor, setSelectedColor] = useQueryState("color"); */
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [page, setPage] = useState(1);
  const [getUser, setGetUser] = useState<BasicUser | null>(null);

  /*   useEffect(() => {
    const getUSer = async () => {
      const user = await getUserInfo();
      setGetUser(user);
    };
    getUSer();
  }, []); */

  console.log("params-stats", params.stats);

  const { data, isPending } = useQueryWrapper<Reviews>(
    ["get-review-of-product", params._id, page],
    `/product/get-all-reviews-for-products?id=${params._id}&page=${page}`,
    { enabled: activeTab === "reviews" }
  );
  // Extract unique colors and sizes from variants
  const colors =
    (params?.variants?.length ?? 0) > 0
      ? [
          ...new Set(
            (params.variants ?? []).map((v) => v?.color).filter(Boolean)
          ),
        ]
      : [];

  const sizes =
    (params?.variants?.length ?? 0) > 0
      ? [
          ...new Set(
            (params.variants ?? []).map((v) => v?.size).filter(Boolean)
          ),
        ]
      : [];

  // Get current variant based on selection
  const currentVariant = params?.variants?.find(
    (v) => v?.color === selectedColor && v?.size === selectedSize
  );

  // Calculate price based on variant or default
  const getCurrentPrice = () => {
    // If variants exist, only show price when valid variant is selected
    if ((params?.variants?.length ?? 0) > 0) {
      if (currentVariant?.discountPrice) {
        return currentVariant.discountPrice;
      }
      if (currentVariant?.price) {
        return currentVariant.price;
      }
      // No valid variant selected, return null to show "Select options" message
      return null;
    }

    // No variants, use base product pricing
    if (params?.hasOffer && params?.offerPrice) {
      return params.offerPrice;
    }
    return params?.price ?? 0;
  };

  const getOriginalPrice = () => {
    // If variants exist, only show original price when valid variant is selected
    if ((params?.variants?.length ?? 0) > 0) {
      if (currentVariant?.price && currentVariant?.discountPrice) {
        return currentVariant.price;
      }
      return null;
    }

    // No variants, use base product pricing
    if (params?.hasOffer && params?.offerPrice) {
      return params.price;
    }
    return null;
  };

  const currentPrice = getCurrentPrice();
  const originalPrice = getOriginalPrice();
  const totalPrice = currentPrice ? (currentPrice * quantity).toFixed(2) : null;

  // Get stock based on variant or default
  const currentStock = currentVariant?.stock ?? params?.stock ?? 0;

  // Check if Add to Cart button should be disabled
  const hasVariants = (params?.variants?.length ?? 0) > 0;
  const needsColorSelection =
    hasVariants && colors.length > 0 && !selectedColor;
  const needsSizeSelection = hasVariants && sizes.length > 0 && !selectedSize;
  const isAddToCartDisabled =
    currentStock === 0 ||
    needsColorSelection ||
    needsSizeSelection ||
    !currentVariant;

  const handleImageNavigation = (direction: "prev" | "next") => {
    const imagesLength = params?.images?.length ?? 0;
    if (direction === "next") {
      setSelectedImageIndex((prev) => (prev + 1) % imagesLength);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + imagesLength) % imagesLength);
    }
  };

  const renderRating = (rating = 4.5, totalRviews: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-palette-btn text-palette-btn"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">
          ({totalRviews} reviews)
        </span>
      </div>
    );
  };
  const router = useRouter();
  const { addToCart } = useCartStore();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Validate that color and size are selected
    if (!selectedColor || !selectedSize) {
      // You can add a toast notification here
      toast.error("Please select both color and size");
      return;
    }

    // Validate that a valid variant exists
    if (!currentVariant) {
      toast.error("This combination is not available");
      return;
    }

    // Check stock availability
    if (currentStock === 0) {
      toast.error("This item is out of stock");
      return;
    }

    // Check if requested quantity exceeds stock
    if (quantity > currentStock) {
      toast.error(`Only ${currentStock} items available`);
      return;
    }
    const eventId = uuidv4();

    // Create unique cart item ID
    const cartItemId = `${params._id}-${selectedSize}-${selectedColor}`;

    // Prepare cart item data
    const cartItem: Omit<CartItem, "quantity"> = {
      _id: cartItemId,
      productId: params._id,
      name: params.name ?? "Product",
      thumbnail: params.thumbnail?.url ?? "",
      brandName: params.brand?.name ?? "Unknown Brand",
      slug: params.slug ?? "",

      // Variant information
      variant: {
        size: selectedSize,
        color: selectedColor,
        price: currentVariant.price,
        discountPrice: currentVariant.discountPrice,
      },

      // Unit price (use discount price if available)
      unitPrice: currentVariant.discountPrice ?? currentVariant.price,

      // Variant stock
      variantStock: currentVariant.stock ?? 0,
    };
    const extraData = {
      event_id: eventId,
      userId: getUser?.id,
      userName: getUser?.name,
      email: getUser?.email,
      ...cartItem,
    };

    // Add to cart
    addToCart(cartItem);
    addToCartEvent(extraData);
    addToCartServerEvent(extraData);

    // Optional: Show success message
    toast.success(`Added ${quantity} item(s) to cart!`, {
      position: "bottom-right",
    });
  };

  const buyNow = () => {
    if (!selectedColor || !selectedSize) {
      // You can add a toast notification here
      toast.error("Please select both color and size");
      return;
    }

    // Validate that a valid variant exists
    if (!currentVariant) {
      toast.error("This combination is not available");
      return;
    }

    // Check stock availability
    if (currentStock === 0) {
      toast.error("This item is out of stock");
      return;
    }

    // Check if requested quantity exceeds stock
    if (quantity > currentStock) {
      toast.error(`Only ${currentStock} items available`);
      return;
    }

    // Create unique cart item ID
    const cartItemId = `${params._id}-${selectedSize}-${selectedColor}`;

    // Prepare cart item data
    const cartItem: Omit<CartItem, "quantity"> = {
      _id: cartItemId,
      productId: params._id,
      name: params.name ?? "Product",
      thumbnail: params.thumbnail?.url ?? "",
      brandName: params.brand?.name ?? "Unknown Brand",
      slug: params.slug ?? "",

      // Variant information
      variant: {
        size: selectedSize,
        color: selectedColor,
        price: currentVariant.price,
        discountPrice: currentVariant.discountPrice,
      },

      // Unit price (use discount price if available)
      unitPrice: currentVariant.discountPrice ?? currentVariant.price,

      // Variant stock
      variantStock: currentVariant.stock ?? 0,
    };
    const eventId = uuidv4();

    const extraData = {
      event_id: eventId,
      userId: getUser?.id,
      userName: getUser?.name,
      email: getUser?.email,
      ...cartItem,
    };

    // Add to cart
    addToCart(cartItem);
    addToCartEvent(extraData);
    const extraDatas = {
      userId: getUser?.id,
      userName: getUser?.name,
      email: getUser?.email,
      event_id: eventId,
      items: [{ ...cartItem, quantity: quantity }],
    };
    initiateCheckoutEvent(extraDatas);

    addToCartServerEvent(cartItem);
    initiateCheckoutServerEvent(extraDatas);

    // Optional: Show success message
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-palette-bg px-4 lg:px-2 xl:px-0">
      <div className="container mx-auto px-4 md:px-0 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={
                  params?.images?.[selectedImageIndex]?.url ??
                  params?.thumbnail?.url ??
                  ""
                }
                alt={params?.name ?? "Product image"}
                className=" aspect-square "
              />

              {/* Navigation Arrows */}
              {(params?.images?.length ?? 0) > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation("prev")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md text-palette-text"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation("next")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md text-palette-text"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Offer Badge */}
              {currentPrice && originalPrice && (
                <div className="absolute top-4 left-4 bg-palette-btn text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  Save ${(originalPrice - currentPrice).toFixed(2)}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {(params?.images?.length ?? 0) > 1 && (
              <div className="flex gap-3">
                {params?.images?.map((image, index) => (
                  <button
                    key={image?._id ?? index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-palette-btn"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image?.url ?? ""}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500">
              <span>{params?.category?.main ?? "Category"}</span>
              {params?.category?.subMain && (
                <>
                  {" / "}
                  <span>{params.category.subMain}</span>
                </>
              )}
              {params?.category?.semiSub && (
                <>
                  {" / "}
                  <span>{params.category.semiSub}</span>
                </>
              )}
              {params?.category?.category && (
                <>
                  {" / "}
                  <span>{params.category.category}</span>
                </>
              )}
            </div>

            {/* Product Title & Brand */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-palette-text">
                {params?.name ?? "Product Name"}
              </h1>
              {params?.brand?.name && (
                <p className="text-lg text-gray-600">by {params.brand.name}</p>
              )}
              {renderRating(
                params?.stats?.averageRating ?? 0,
                params?.stats?.totalReviews ?? 0
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              {currentPrice !== null ? (
                <div className="flex items-center gap-4">
                  {originalPrice ? (
                    <>
                      <span className="text-3xl font-bold text-palette-text">
                        ${currentPrice.toFixed(2)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                      <span className="bg-palette-btn/10 text-palette-btn px-2 py-1 rounded text-sm font-bold">
                        {Math.round(
                          ((originalPrice - currentPrice) / originalPrice) * 100
                        )}
                        % OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-palette-text">
                      ${currentPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xl text-gray-500">
                  Select options to see price
                </div>
              )}
              {params?.hasOffer && params?.offerExpiresAt && (
                <p className="text-sm text-gray-500">
                  Offer expires on{" "}
                  {new Date(params.offerExpiresAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Stock Status */}
            {currentVariant || !hasVariants ? (
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  currentStock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-palette-btn/10 text-palette-btn"
                }`}
              >
                {currentStock > 0
                  ? `In Stock (${currentStock} available)`
                  : "Out of Stock"}
              </div>
            ) : (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                Select variant to check stock
              </div>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-palette-text">
                  Color{" "}
                  {needsColorSelection && (
                    <span className="text-palette-btn">*</span>
                  )}
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => {
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedColor === color
                            ? "border-palette-btn bg-palette-btn/5 text-palette-btn font-medium"
                            : "border-gray-200 hover:border-gray-300 text-palette-text cursor-pointer"
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-palette-text">
                  Size{" "}
                  {needsSizeSelection && (
                    <span className="text-palette-btn">*</span>
                  )}
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => {
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedSize === size
                            ? "border-palette-btn bg-palette-btn/5 text-palette-btn font-medium"
                            : "border-gray-200 hover:border-gray-300 text-palette-text cursor-pointer"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <h4 className="font-medium text-palette-text">Quantity</h4>
              <div className="flex items-center border-2 border-gray-200 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-palette-text hover:bg-palette-bg transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 border-x-2 border-gray-200 text-palette-text font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(currentStock, quantity + 1))
                  }
                  disabled={!currentStock}
                  className="px-4 py-2 text-palette-text hover:bg-palette-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={isAddToCartDisabled}
                className="w-full bg-palette-btn text-white py-3 px-6 rounded-lg font-semibold hover:bg-palette-btn/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                onClick={handleAddToCart}
              >
                {currentStock === 0
                  ? "Out of Stock"
                  : isAddToCartDisabled
                  ? "Select Color & Size"
                  : totalPrice
                  ? `Add to Cart - $${totalPrice}`
                  : "Add to Cart"}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={buyNow}
                  disabled={isAddToCartDisabled}
                  className="flex-1 border-2 border-palette-btn text-palette-btn py-3 px-6 rounded-lg font-semibold hover:bg-palette-btn hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                >
                  Buy Now
                </button>

                <ShareProductDialog />
              </div>
            </div>

            {/* Key Features */}
            {(params?.features?.length ?? 0) > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-palette-text">Key Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {params?.features?.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-palette-btn/5 rounded-lg border border-palette-btn/10"
                    >
                      <Award className="w-5 h-5 text-palette-btn mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-palette-text">
                          {feature?.name ?? "Feature"}
                        </h5>
                        {feature?.description && (
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Features */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Truck className="w-5 h-5 text-palette-btn" />
                <div>
                  <p className="font-medium text-palette-text">
                    {params?.freeShipping
                      ? "Free Shipping"
                      : params?.shippingCost
                      ? `Shipping: $${params.shippingCost}`
                      : "Shipping Available"}
                  </p>
                  {params?.shippingTime && (
                    <p className="text-sm">Delivery in {params.shippingTime}</p>
                  )}
                </div>
              </div>

              {params?.returnPolicy && (
                <div className="flex items-center gap-3 text-gray-600">
                  <RotateCcw className="w-5 h-5 text-palette-btn" />
                  <div>
                    <p className="font-medium text-palette-text">
                      Easy Returns
                    </p>
                    <p className="text-sm">{params.returnPolicy}</p>
                  </div>
                </div>
              )}

              {params?.warrantyPeriod && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="w-5 h-5 text-palette-btn" />
                  <div>
                    <p className="font-medium text-palette-text">Warranty</p>
                    <p className="text-sm">
                      {params.warrantyPeriod} manufacturer warranty
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rest of the tabs section remains the same... */}
        <div className="mt-16">
          <div className="border-b-2 border-gray-200">
            <nav className="flex space-x-8">
              {["description", "specifications", "reviews", "shipping"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? "border-palette-btn text-palette-btn"
                        : "border-transparent text-gray-500 hover:text-palette-text"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-palette-text mb-4">
                    Product Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {params?.description ?? "No description available."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 p-6 bg-palette-btn/5 rounded-lg">
                  {(params?.height || params?.width) && (
                    <div className="text-center">
                      <h4 className="font-medium text-palette-text mb-2">
                        Dimensions
                      </h4>
                      <p className="text-gray-600">
                        {params?.height ?? 0}cm × {params?.width ?? 0}cm
                      </p>
                    </div>
                  )}
                  {params?.weight && (
                    <div className="text-center border-x border-gray-200">
                      <h4 className="font-medium text-palette-text mb-2">
                        Weight
                      </h4>
                      <p className="text-gray-600">{params.weight}</p>
                    </div>
                  )}
                  {params?.brand?.name && (
                    <div className="text-center">
                      <h4 className="font-medium text-palette-text mb-2">
                        Brand
                      </h4>
                      <p className="text-gray-600">{params.brand.name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-xl font-bold text-palette-text mb-6">
                  Technical Specifications
                </h3>
                {params?.specifications &&
                  Object.keys(params.specifications).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(params.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center py-3 border-b border-gray-200"
                          >
                            <span className="font-medium text-palette-text">
                              {key}
                            </span>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                {(params?.certifications?.length ?? 0) > 0 && (
                  <div className="mt-8">
                    <h4 className="font-medium text-palette-text mb-4">
                      Certifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {params?.certifications?.map((cert, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="text-xl font-bold text-palette-text mb-6">
                  Customer Reviews
                </h3>
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="flex items-center gap-6 p-6 bg-palette-btn/5 rounded-lg border border-palette-btn/10">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-palette-text">
                        {params?.stats?.averageRating ?? 0}
                      </div>
                      <div className="flex justify-center mt-1">
                        {renderRating(
                          params?.stats?.averageRating ?? 0,
                          params?.stats?.totalReviews ?? 0
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Based on {params?.stats?.totalReviews ?? 0} reviews
                      </div>
                    </div>
                    <RatingBreakdown stats={params?.stats} />
                  </div>
                  <ReviewForm productId={params?._id} />
                  {/* Sample Reviews */}
                  <ReviewsList
                    currentPage={page}
                    onPageChange={setPage}
                    reviews={data?.data}
                    totalPages={data?.totalPage ?? 0}
                    isLoading={isPending}
                  />
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div>
                <h3 className="text-xl font-bold text-palette-text mb-6">
                  Shipping & Returns
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-palette-text mb-4">
                      Shipping Information
                    </h4>
                    <div className="space-y-3">
                      {params?.shippingTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Time</span>
                          <span className="font-medium text-palette-text">
                            {params.shippingTime}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping Cost</span>
                        <span className="font-medium text-palette-text">
                          {params?.freeShipping
                            ? "Free"
                            : `$${params?.shippingCost ?? 0}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Express Delivery</span>
                        <span className="font-medium text-palette-text">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-palette-text mb-4">
                      Return Policy
                    </h4>
                    <div className="space-y-3">
                      {params?.returnPolicy && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Return Period</span>
                          <span className="font-medium text-palette-text">
                            {params.returnPolicy}
                          </span>
                        </div>
                      )}
                      {params?.warrantyPeriod && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Warranty</span>
                          <span className="font-medium text-palette-text">
                            {params.warrantyPeriod}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Return Shipping</span>
                        <span className="font-medium text-palette-text">
                          Free
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-palette-btn/5 border-2 border-palette-btn/20 rounded-lg">
                  <h4 className="font-medium text-palette-text mb-4">
                    Return Process
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Contact our support team to initiate a return</li>
                    <li>Pack the item in its original packaging</li>
                    <li>Print the prepaid return label we'll email you</li>
                    <li>Drop off at any courier location or schedule pickup</li>
                    <li>Refund will be processed within 3-5 business days</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
