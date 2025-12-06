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
import DescriptionComponent from "./RenderDesription";

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
    if (total === 0) return "0%";
    return `${Math.round((count / total) * 100)}%`;
  };

  return (
    <div className="flex-1">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center gap-3 mb-2">
          <span className="text-sm w-3 text-gray-700 font-medium">
            {rating}
          </span>
          <Star className="w-4 h-4 fill-palette-btn text-palette-btn flex-shrink-0" />
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden min-w-0">
            <div
              className="bg-palette-btn h-full rounded-full transition-all duration-300"
              style={{ width: getWidth(rating) }}
            ></div>
          </div>
          <span className="text-sm text-gray-500 w-10 text-right flex-shrink-0">
            {getCount(rating)}
          </span>
        </div>
      ))}
    </div>
  );
};

interface ProductVariantCardsProps {
  product: Product;
  user?: BasicUser | null;
}

const ProductVariantCards: React.FC<ProductVariantCardsProps> = ({
  product,
  user,
}) => {
  const { addToCart, items } = useCartStore();

  const variantsBySize = React.useMemo(() => {
    const grouped = new Map<string, typeof product.variants>();
    product.variants?.forEach((variant) => {
      const size = variant.size || "Default";
      if (!grouped.has(size)) {
        grouped.set(size, []);
      }
      grouped.get(size)?.push(variant);
    });
    return grouped;
  }, [product.variants]);

  const getColorsForSize = (size: string) => {
    const variants = variantsBySize.get(size) || [];
    return variants.map((v) => v.color).filter(Boolean);
  };

  const getSizeImage = (size: string) => {
    const variants = variantsBySize.get(size) || [];
    const firstVariantWithImage = variants.find((v) => v.image?.url);
    return (
      firstVariantWithImage?.image?.url ||
      product.images?.[0]?.url ||
      "/placeholder-image.jpg"
    );
  };

  return (
    <div className="space-y-4">
      {Array.from(variantsBySize.entries()).map(([size, variants]) => (
        <VariantCard
          key={size}
          product={product}
          size={size}
          variants={variants}
          image={getSizeImage(size)}
          colors={getColorsForSize(size)}
          user={user}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
};

interface VariantCardProps {
  product: Product;
  size: string;
  variants: NonNullable<Product["variants"]>;
  colors: (string | undefined)[];
  user?: BasicUser | null;
  image?: string;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
}

const VariantCard: React.FC<VariantCardProps> = ({
  product,
  size,
  variants,
  colors,
  user,
  addToCart,
  image,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "");

  const currentVariant = variants.find((v) => v.color === selectedColor);

  const currentPrice =
    currentVariant?.discountPrice || currentVariant?.price || 0;
  const originalPrice = currentVariant?.discountPrice
    ? currentVariant?.price
    : null;
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const stock = currentVariant?.stock || 0;
  const isRecommended = currentVariant?.recommended;

  const handleAddToCart = () => {
    if (!selectedColor || !currentVariant) {
      toast.error("Please select a color");
      return;
    }

    if (stock === 0) {
      toast.error("This item is out of stock");
      return;
    }

    const eventId = uuidv4();
    const cartItemId = `${product._id}-${size}-${selectedColor}`;

    const cartItem: Omit<CartItem, "quantity"> = {
      _id: cartItemId,
      productId: product._id,
      name: product.name ?? "Product",
      thumbnail: product.thumbnail?.url ?? "",
      brandName: product.brand?.name ?? "Unknown Brand",
      slug: product.slug ?? "",
      variant: {
        size: size,
        color: selectedColor,
        price: currentVariant.price,
        discountPrice: currentVariant.discountPrice,
      },
      unitPrice: currentVariant.discountPrice ?? currentVariant.price,
      variantStock: currentVariant.stock ?? 0,
    };

    const extraData = {
      event_id: eventId,
      userId: user?.id,
      userName: user?.name,
      email: user?.email,
      ...cartItem,
    };

    addToCart(cartItem);
    addToCartEvent(extraData);
    addToCartServerEvent(extraData);

    toast.success("Added to cart!", { position: "bottom-right" });
  };

  return (
    <div className="relative bg-white border  border-gray-200 rounded-lg p-4 sm:p-6">
      {isRecommended && (
        <div className=" w-fit  text-gray-600  fo px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold">
          Recommended: {isRecommended}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6">
        {image && (
          <div className="w-full sm:w-48 flex-shrink-0">
            <img
              src={image}
              alt={`${product.name} - ${size}`}
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Size:</span>
            <span className="text-base font-bold text-palette-text">
              {size}
            </span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            {originalPrice && (
              <span className="text-base line-through text-gray-400">
                ৳{originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-2xl font-bold text-palette-text">
              ৳{currentPrice.toFixed(2)}
            </span>
            {discountPercentage > 0 && (
              <span className="bg-palette-btn/10 text-palette-btn px-2.5 py-1 rounded text-sm font-bold">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {colors.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm text-palette-text">
                Color:{" "}
                <span className="font-bold text-palette-btn">
                  {selectedColor || "Select"}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color || "")}
                    className={`min-h-[44px] px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      selectedColor === color
                        ? "border-palette-btn bg-palette-btn text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-palette-btn"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold ${
                stock > 0
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {stock > 0 ? `In Stock: ${stock}` : "Out of Stock"}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={stock === 0 || !selectedColor}
            className="w-full min-h-[48px] bg-palette-btn text-white py-3 px-6 rounded-lg font-semibold text-base hover:bg-palette-btn/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {stock === 0
              ? "Out of Stock"
              : !selectedColor
              ? "Select Color First"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductPage = ({ params }: { params: Product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Details");
  const [page, setPage] = useState(1);
  const [getUser, setGetUser] = useState<BasicUser | null>(null);

  const { data, isPending } = useQueryWrapper<Reviews>(
    ["get-review-of-product", params._id, page],
    `/product/get-all-reviews-for-products?id=${params._id}&page=${page}`,
    { enabled: activeTab === "reviews" }
  );

  const getPriceRange = () => {
    if (!params?.variants || params.variants.length === 0) {
      return null;
    }

    const prices = params.variants.map((v) =>
      v.discountPrice ? v.discountPrice : v.price
    );
    const originalPrices = params.variants.map((v) => v.price);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minOriginalPrice = Math.min(...originalPrices);
    const maxOriginalPrice = Math.max(...originalPrices);

    return {
      min: minPrice,
      max: maxPrice,
      originalMin: minOriginalPrice,
      originalMax: maxOriginalPrice,
      hasDiscount: prices.some((price, i) => price < originalPrices[i]),
    };
  };

  const priceRange = getPriceRange();

  const handleImageNavigation = (direction: "prev" | "next") => {
    const imagesLength = params?.images?.length ?? 0;
    if (direction === "next") {
      setSelectedImageIndex((prev) => (prev + 1) % imagesLength);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + imagesLength) % imagesLength);
    }
  };

  const renderRating = (rating = 4.5, totalReviews: number) => {
    return (
      <div className="flex items-center gap-2">
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
        <span className="text-sm text-gray-600 ml-1">({totalReviews})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white container mx-auto">
      <div className="w-full max-w-full mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images Section */}
          <div className="space-y-4 lg:sticky lg:top-4 h-fit">
            {/* Main Image */}
            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={
                  params?.images?.[selectedImageIndex]?.url ??
                  params?.thumbnail?.url ??
                  ""
                }
                alt={params?.name ?? "Product image"}
                className="w-full h-auto object-contain"
              />

              {(params?.images?.length ?? 0) > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation("prev")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-palette-text border border-gray-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation("next")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-palette-text border border-gray-200"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}

              {priceRange?.hasDiscount && (
                <div className="absolute top-4 left-4 bg-palette-btn text-white px-4 py-2 rounded-full text-sm font-bold">
                  SALE
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {(params?.images?.length ?? 0) > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto">
                {params?.images?.map((image, index) => (
                  <button
                    key={image?.id ?? index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
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

            {/* Desktop Description - Under Image */}
            <div className="hidden lg:block pt-6">
              <h3 className="text-xl font-bold text-palette-text mb-4">
                Product Description
              </h3>
              <DescriptionComponent params={params?.description} />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 hidden overflow-x-auto whitespace-nowrap">
              <span>{params?.category?.main ?? "Category"}</span>
              {params?.category?.subMain && (
                <>
                  <span className="mx-2">/</span>
                  <span>{params.category.subMain}</span>
                </>
              )}
              {params?.category?.semiSub && (
                <>
                  <span className="mx-2">/</span>
                  <span>{params.category.semiSub}</span>
                </>
              )}
              {params?.category?.category && (
                <>
                  <span className="mx-2">/</span>
                  <span>{params.category.category}</span>
                </>
              )}
            </div>

            {/* Product Title & Brand */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-palette-text">
                {params?.name ?? "Product Name"}
              </h1>

              {renderRating(
                params?.stats?.averageRating ?? 0,
                params?.stats?.totalReviews ?? 0
              )}
            </div>

            {/* Price Range */}
            {priceRange && (
              <div className="space-y-2 bg-gray-50 p-4 sm:p-6 rounded-lg  ">
                <div className="flex items-baseline gap-3 flex-wrap">
                  {priceRange.hasDiscount && (
                    <span className="text-lg sm:text-xl text-gray-400 line-through">
                      ৳{priceRange.originalMin.toFixed(2)}
                      {priceRange.originalMin !== priceRange.originalMax &&
                        ` - ৳${priceRange.originalMax.toFixed(2)}`}
                    </span>
                  )}
                  <span className="text-3xl sm:text-4xl font-bold text-palette-text">
                    ৳{priceRange.min.toFixed(2)}
                    {priceRange.min !== priceRange.max &&
                      ` - ৳${priceRange.max.toFixed(2)}`}
                  </span>
                  {priceRange.hasDiscount && (
                    <span className="bg-palette-btn text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                      Save up to{" "}
                      {Math.round(
                        ((priceRange.originalMax - priceRange.min) /
                          priceRange.originalMax) *
                          100
                      )}
                      %
                    </span>
                  )}
                </div>
                {params?.hasOffer && params?.offerExpiresAt && (
                  <p className="text-sm text-gray-600">
                    ⏰ Offer expires on{" "}
                    <span className="font-semibold">
                      {new Date(params.offerExpiresAt).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Short Description & Special Offer */}
            <div className="space-y-3">
              {params?.shortDescription && (
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {params?.shortDescription}
                </p>
              )}
              {params?.special_offer && (
                <div className="bg-green-50/20  px-4 py-2 rounded-lg">
                  <p className="text-sm sm:text-base text-gray-800 font-semibold">
                    {params?.special_offer}
                  </p>
                </div>
              )}
            </div>

            {/* Variant Cards */}
            {params?.variants && params.variants.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-palette-text">
                  Available Options
                </h4>
                <ProductVariantCards product={params} user={getUser} />
              </div>
            )}

            {/* Key Features */}
            {(params?.features?.length ?? 0) > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-palette-text">
                  Key Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {params?.features?.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-palette-btn/5 rounded-lg border border-palette-btn/10"
                    >
                      <Award className="w-5 h-5 text-palette-btn mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <h5 className="font-semibold text-palette-text text-sm sm:text-base">
                          {feature?.name ?? "Feature"}
                        </h5>
                        {feature?.description && (
                          <p className="text-sm text-gray-600 mt-1">
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
              <div className="flex items-start gap-3 p-3 rounded-lg">
                <Truck className="w-5 h-5 text-palette-btn mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-palette-text text-sm sm:text-base">
                    {params?.freeShipping
                      ? "Free Shipping"
                      : params?.shippingCost
                      ? `Shipping: ৳${params.shippingCost}`
                      : "Shipping Available"}
                  </p>
                  {params?.shippingTime && (
                    <p className="text-sm text-gray-600 mt-0.5">
                      Delivery in {params.shippingTime}
                    </p>
                  )}
                </div>
              </div>

              {params?.returnPolicy && (
                <div className="flex items-start gap-3 p-3 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-palette-btn mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-palette-text text-sm sm:text-base">
                      Easy Returns
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {params.returnPolicy}
                    </p>
                  </div>
                </div>
              )}

              {params?.warrantyPeriod && (
                <div className="flex items-start gap-3 p-3 rounded-lg">
                  <Shield className="w-5 h-5 text-palette-btn mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-palette-text text-sm sm:text-base">
                      Warranty
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {params.warrantyPeriod} manufacturer warranty
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 sm:mt-16">
          {/* Mobile Description - In Tabs */}
          <div className="lg:hidden mb-8">
            <h3 className="text-xl font-bold text-palette-text mb-4">
              Product Description
            </h3>
            <DescriptionComponent params={params?.description} />
          </div>

          {/* Tab Navigation */}
          <div className="border-b-2 border-gray-200 overflow-x-auto">
            <nav className="flex gap-2 sm:gap-6">
              {["Details", "specifications", "reviews", "shipping"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 sm:py-4 px-2 sm:px-4 border-b-2 font-semibold text-sm sm:text-base capitalize transition-all whitespace-nowrap min-h-[44px] ${
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

          {/* Tab Content */}
          <div className="py-6 sm:py-8">
            {activeTab === "Details" && (
              <div className="space-y-6">
                {params?.company_details && (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-bold text-palette-text mb-3">
                      Company Details
                    </h4>
                    <p className="text-base text-gray-700">
                      {params?.company_details}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 bg-palette-btn/5 rounded-lg border border-palette-btn/10">
                  <div className="text-center py-3">
                    <h4 className="font-semibold text-palette-text mb-2 text-sm sm:text-base">
                      Dimensions
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      {params?.height || params?.width
                        ? `${params?.height ?? 0}cm × ${params?.width ?? 0}cm`
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-center py-3 border-t sm:border-t-0 sm:border-x border-gray-300">
                    <h4 className="font-semibold text-palette-text mb-2 text-sm sm:text-base">
                      Weight
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      {params?.weight ?? "N/A"}
                    </p>
                  </div>
                  <div className="text-center py-3 border-t sm:border-t-0">
                    <h4 className="font-semibold text-palette-text mb-2 text-sm sm:text-base">
                      Brand
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      {params?.brand?.name ?? "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-palette-text">
                  Technical Specifications
                </h3>
                {params?.specifications &&
                  Object.keys(params.specifications).length > 0 && (
                    <div className="space-y-2">
                      {Object.entries(params.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center py-4 px-4 sm:px-6 border-b border-gray-200"
                          >
                            <span className="font-semibold text-palette-text text-sm sm:text-base">
                              {key}
                            </span>
                            <span className="text-gray-600 text-sm sm:text-base text-right ml-4">
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                {(params?.certifications?.length ?? 0) > 0 && (
                  <div className="mt-8">
                    <h4 className="font-semibold text-palette-text mb-4 text-base sm:text-lg">
                      Certifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {params?.certifications?.map((cert, index) => (
                        <span
                          key={index}
                          className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full text-sm font-semibold"
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
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-palette-text">
                  Customer Reviews
                </h3>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 sm:p-6 bg-palette-btn/5 rounded-lg border border-palette-btn/10">
                  <div className="text-center sm:text-left">
                    <div className="text-4xl sm:text-5xl font-bold text-palette-text">
                      {params?.stats?.averageRating?.toFixed(1) ?? "0.0"}
                    </div>
                    <div className="flex justify-center sm:justify-start mt-2">
                      {renderRating(
                        params?.stats?.averageRating ?? 0,
                        params?.stats?.totalReviews ?? 0
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      {params?.stats?.totalReviews ?? 0} total
                    </div>
                  </div>
                  <RatingBreakdown stats={params?.stats} />
                </div>

                <ReviewForm productId={params?._id} />
                <ReviewsList
                  currentPage={page}
                  onPageChange={setPage}
                  reviews={data?.data}
                  totalPages={data?.totalPage ?? 0}
                  isLoading={isPending}
                />
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-palette-text">
                  Shipping & Returns
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-4 sm:p-6 border border-gray-200 rounded-lg bg-white">
                    <h4 className="font-bold text-palette-text mb-4 text-base sm:text-lg">
                      Shipping Information
                    </h4>
                    <div className="space-y-3">
                      {params?.shippingTime && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm sm:text-base text-gray-600">
                            Delivery Time
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-palette-text">
                            {params.shippingTime}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm sm:text-base text-gray-600">
                          Shipping Cost
                        </span>
                        <span className="text-sm sm:text-base font-semibold text-palette-text">
                          {params?.freeShipping
                            ? "Free"
                            : `৳${params?.shippingCost ?? 0}`}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm sm:text-base text-gray-600">
                          Express Delivery
                        </span>
                        <span className="text-sm sm:text-base font-semibold text-palette-text">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 border border-gray-200 rounded-lg bg-white">
                    <h4 className="font-bold text-palette-text mb-4 text-base sm:text-lg">
                      Return Policy
                    </h4>
                    <div className="space-y-3">
                      {params?.returnPolicy && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm sm:text-base text-gray-600">
                            Return Period
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-palette-text">
                            {params.returnPolicy}
                          </span>
                        </div>
                      )}
                      {params?.warrantyPeriod && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm sm:text-base text-gray-600">
                            Warranty
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-palette-text">
                            {params.warrantyPeriod}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-2">
                        <span className="text-sm sm:text-base text-gray-600">
                          Return Shipping
                        </span>
                        <span className="text-sm sm:text-base font-semibold text-palette-text">
                          Free
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-palette-btn/5 border-2 border-palette-btn/20 rounded-lg">
                  <h4 className="font-bold text-palette-text mb-4 text-base sm:text-lg">
                    Return Process
                  </h4>
                  <ol className="space-y-3 text-sm sm:text-base text-gray-700">
                    <li className="flex gap-3">
                      <span className="font-bold text-palette-btn flex-shrink-0">
                        1.
                      </span>
                      <span>Contact our support team to initiate a return</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-palette-btn flex-shrink-0">
                        2.
                      </span>
                      <span>Pack the item in its original packaging</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-palette-btn flex-shrink-0">
                        3.
                      </span>
                      <span>
                        Print the prepaid return label we will email you
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-palette-btn flex-shrink-0">
                        4.
                      </span>
                      <span>
                        Drop off at any courier location or schedule pickup
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-palette-btn flex-shrink-0">
                        5.
                      </span>
                      <span>
                        Refund will be processed within 3-5 business days
                      </span>
                    </li>
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
