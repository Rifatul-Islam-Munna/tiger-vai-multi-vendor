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

// Product Variant Cards Component
interface ProductVariantCardsProps {
  product: Product;
  user?: BasicUser | null;
}

const ProductVariantCards: React.FC<ProductVariantCardsProps> = ({
  product,
  user,
}) => {
  console.log("product", product);
  const { addToCart } = useCartStore();

  // Group variants by size
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

  // Get unique colors for a size
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
  console.log("image", image);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "");

  // Get current variant based on selected color
  const currentVariant = variants.find((v) => v.color === selectedColor);

  // Calculate prices
  const currentPrice =
    currentVariant?.discountPrice || currentVariant?.price || 0;
  const originalPrice = currentVariant?.discountPrice
    ? currentVariant?.price
    : null;
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Get stock
  const stock = currentVariant?.stock || 0;

  // Check if this VARIANT is recommended (from variant.recommended field)
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
    <div className="relative bg-white border border-gray-200 rounded-lg p-4  ">
      {/* Recommended Badge - Shows when current selected variant is recommended */}
      {isRecommended && (
        <div className="    py-1  text-xs font-semibold ">
          Recommended: {isRecommended}
        </div>
      )}
      <div className=" flex justify-between items-center gap-6">
        {image ? (
          <img src={image} className=" w-full h-full max-w-[200px] h-full" />
        ) : null}
        <div className="space-y-3 mt-2 flex-1">
          {/* Size Display */}
          <div>
            <span className="text-sm text-gray-600">Size: </span>
            <span className="font-semibold text-palette-text">{size}</span>
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-3 flex-wrap">
            {originalPrice ? (
              <>
                <span className="text-lg line-through text-gray-400">
                  ৳{originalPrice.toFixed(2)}
                </span>
                <span className="text-2xl font-bold text-palette-text">
                  ৳{currentPrice.toFixed(2)}
                </span>
                {discountPercentage > 0 && (
                  <span className="bg-palette-btn/10 text-palette-btn px-2 py-1 rounded text-sm font-bold">
                    {discountPercentage}% off
                  </span>
                )}
              </>
            ) : (
              <span className="text-2xl font-bold text-palette-text">
                ৳{currentPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Color Selection - User can select color */}
          {colors.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-palette-text">
                Select Color:{" "}
                <span className="text-palette-btn">
                  {selectedColor || "None"}
                </span>
              </span>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color || "")}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedColor === color
                        ? "border-palette-btn bg-palette-btn text-white shadow-md"
                        : "border-gray-300 bg-white text-gray-700 hover:border-palette-btn hover:bg-palette-btn/5"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <div
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {stock > 0 ? `Stock: ${stock}` : "Out of Stock"}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={stock === 0 || !selectedColor}
            className="w-full bg-palette-btn text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-palette-btn/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {stock === 0
              ? "Out of Stock"
              : !selectedColor
              ? "Select Color First"
              : "Add to Cart"}
          </button>
        </div>{" "}
      </div>
    </div>
  );
};

const ProductPage = ({ params }: { params: Product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("specifications");
  const [page, setPage] = useState(1);
  const [getUser, setGetUser] = useState<BasicUser | null>(null);

  console.log("params-stats", params.stats);

  const { data, isPending } = useQueryWrapper<Reviews>(
    ["get-review-of-product", params._id, page],
    `/product/get-all-reviews-for-products?id=${params._id}&page=${page}`,
    { enabled: activeTab === "reviews" }
  );

  // Calculate price range from variants
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

  return (
    <div className="min-h-screen bg-palette-bg px-4 lg:px-2 xl:px-0">
      <div className="container mx-auto px-4 md:px-0 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
          {/* Product Images Section */}
          <div className="space-y-4 sticky h-fit  top-0">
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={
                  params?.images?.[selectedImageIndex]?.url ??
                  params?.thumbnail?.url ??
                  ""
                }
                alt={params?.name ?? "Product image"}
                className="w-full h-full object-contain"
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
              {priceRange?.hasDiscount && (
                <div className="absolute top-4 left-4 bg-palette-btn text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  Sale
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {(params?.images?.length ?? 0) > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {params?.images?.map((image, index) => (
                  <button
                    key={image?.id ?? index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
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

            {params?.company_details ? (
              <div className=" hidden lg:block">
                <h1 className=" text-lg lg:text-xl font-bold  text-palette-text">
                  Company Details:
                </h1>
                <p className=" text-sm lg:text-lg font-semibold text-palette-text">
                  {params?.company_details}
                </p>
              </div>
            ) : null}
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

            <div className=" flex flex-col ">
              {params?.shortDescription && (
                <p className="md:text-lg text-gray-600 text-sm">
                  {params?.shortDescription}
                </p>
              )}
              {params?.special_offer && (
                <p className="md:text-lg  bg-green-100 px-2.5 py-1 rounded-md text-green-900  w-fit text-sm">
                  Special Offer: {params?.special_offer}
                </p>
              )}
            </div>

            {/* Price Range Display */}
            {priceRange && (
              <div className="space-y-2">
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Original Price Range (Left) */}
                  {priceRange.hasDiscount && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 line-through text-lg">
                        ৳{priceRange.originalMin.toFixed(2)}
                        {priceRange.originalMin !== priceRange.originalMax &&
                          ` - ৳${priceRange.originalMax.toFixed(2)}`}
                      </span>
                    </div>
                  )}

                  {/* Discounted Price Range (Right) */}
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-palette-text">
                      ৳{priceRange.min.toFixed(2)}
                      {priceRange.min !== priceRange.max &&
                        ` - ৳${priceRange.max.toFixed(2)}`}
                    </span>
                  </div>

                  {/* Discount Badge */}
                  {priceRange.hasDiscount && (
                    <span className="bg-palette-btn/10 text-palette-btn px-2 py-1 rounded text-sm font-bold">
                      Up to{" "}
                      {Math.round(
                        ((priceRange.originalMax - priceRange.min) /
                          priceRange.originalMax) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
                </div>
                {params?.hasOffer && params?.offerExpiresAt && (
                  <p className="text-sm text-gray-500">
                    Offer expires on{" "}
                    {new Date(params.offerExpiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {/* Variant Cards Section */}
            {params?.variants && params.variants.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-palette-text text-lg">
                  Available Options
                </h4>
                <ProductVariantCards product={params} user={getUser} />
              </div>
            )}

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
                      ? `Shipping: ৳${params.shippingCost}`
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

        {/* Tabs Section */}
        <div className="mt-16 w-full">
          <div className=" block lg:hidden ">
            <h1 className=" text-lg lg:text-xl font-bold  text-palette-text">
              Company Details :
            </h1>
            <p className=" text-sm lg:text-lg font-semibold text-palette-text">
              {params?.company_details}
            </p>
          </div>

          <div className=" mt-11 w-full">
            <div className=" w-full">
              <h3 className="text-xl font-bold text-palette-text mb-4">
                Product Description
              </h3>

              <DescriptionComponent params={params?.description} />
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
                  <h4 className="font-medium text-palette-text mb-2">Weight</h4>
                  <p className="text-gray-600">{params.weight}</p>
                </div>
              )}
              {params?.brand?.name && (
                <div className="text-center">
                  <h4 className="font-medium text-palette-text mb-2">Brand</h4>
                  <p className="text-gray-600">{params.brand.name}</p>
                </div>
              )}
            </div>
          </div>
          <div className="border-b-2 border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth -webkit-overflow-scrolling-touch">
              {["specifications", "reviews", "shipping"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors whitespace-nowrap snap-start flex-shrink-0 ${
                    activeTab === tab
                      ? "border-palette-btn text-palette-btn"
                      : "border-transparent text-gray-500 hover:text-palette-text"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-palette-text mb-4">
                    Product Description
                  </h3>

                  <DescriptionComponent params={params?.description} />
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
                            : `৳${params?.shippingCost ?? 0}`}
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
                    <li>Print the prepaid return label we will email you</li>
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
