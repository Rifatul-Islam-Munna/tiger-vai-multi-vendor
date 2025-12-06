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
  Plus,
  Minus,
  MessageCircle,
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
import ProductTabs from "./ProductTabs";
import { Separator } from "../../separator";

interface ProductVariantCardsProps {
  product: Product;
  user?: BasicUser | null;
}

// Track quantities for each variant
interface VariantQuantity {
  [cartItemId: string]: number;
}

const ProductVariantCards: React.FC<ProductVariantCardsProps> = ({
  product,
  user,
}) => {
  const { addToCart, items, updateQuantity } = useCartStore();
  const [variantQuantities, setVariantQuantities] = useState<VariantQuantity>(
    {}
  );

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

  // Handle adding all items with quantities to cart
  const handleAddAllToCart = () => {
    let addedCount = 0;

    Object.entries(variantQuantities).forEach(([cartItemId, quantity]) => {
      if (quantity > 0) {
        // Parse the cartItemId to get productId, size, color
        const [productId, size, color] = cartItemId.split("-");

        // Find the variant
        const variant = product.variants?.find(
          (v) => v.size === size && v.color === color
        );

        if (variant && variant.stock && variant.stock >= quantity) {
          const cartItem: Omit<CartItem, "quantity"> = {
            _id: cartItemId,
            productId: product._id,
            name: product.name ?? "Product",
            thumbnail: product.thumbnail?.url ?? "",
            brandName: product.brand?.name ?? "Unknown Brand",
            slug: product.slug ?? "",
            variant: {
              size: size,
              color: color,
              price: variant.price,
              discountPrice: variant.discountPrice,
            },
            unitPrice: variant.discountPrice ?? variant.price,
            variantStock: variant.stock ?? 0,
          };

          // Check if already in cart
          const existingItem = items.find((item) => item._id === cartItemId);
          if (existingItem) {
            // Update quantity
            updateQuantity(cartItemId, existingItem.quantity + quantity);
          } else {
            // Add new item with quantity
            addToCart(cartItem);
            // Update the quantity in cart
            updateQuantity(cartItemId, quantity);
          }

          const eventId = uuidv4();
          const extraData = {
            event_id: eventId,
            userId: user?.id,
            userName: user?.name,
            email: user?.email,
            ...cartItem,
            quantity,
          };

          addToCartEvent(extraData);
          addToCartServerEvent(extraData);

          addedCount++;
        }
      }
    });

    if (addedCount > 0) {
      toast.success(`${addedCount} item(s) added to cart!`, {
        position: "bottom-right",
      });
      // Reset quantities
      setVariantQuantities({});
    } else {
      toast.error("Please select quantity for at least one variant");
    }
  };

  const handleOrderNow = () => {
    handleAddAllToCart();
    // Redirect to checkout
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 500);
  };

  const handleChatWithSeller = () => {
    toast.info("Chat feature coming soon!");
  };

  return (
    <div className="space-y-4">
      {/* Variant Cards */}
      {Array.from(variantsBySize.entries()).map(([size, variants]) => (
        <VariantCard
          key={size}
          product={product}
          size={size}
          variants={variants}
          image={getSizeImage(size)}
          colors={getColorsForSize(size)}
          variantQuantities={variantQuantities}
          setVariantQuantities={setVariantQuantities}
        />
      ))}

      {/* Two Buttons at Top - Add to Cart & Order Now */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Add to Cart - Yellow/Golden */}
        <button
          onClick={handleAddAllToCart}
          className="w-full py-3 px-4 rounded-lg font-semibold text-base transition-all bg-[#FFC107] hover:bg-[#FFB300] text-gray-800"
        >
          Add To Cart
        </button>

        {/* Order Now - Coral/Salmon */}
        <button
          onClick={handleOrderNow}
          className="w-full py-3 px-4 rounded-lg font-semibold text-base transition-all bg-[#FF7761] hover:bg-[#FF6550] text-white"
        >
          Order Now <span className="text-sm">(আজই কিনুন)</span>
        </button>
      </div>

      {/* Chat with Seller - Bottom - Full Width */}
      <button
        onClick={handleChatWithSeller}
        className="w-full py-3 px-4 rounded-lg font-semibold text-base transition-all bg-[#2196F3] hover:bg-[#1976D2] text-white flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-5 h-5" />
        Chat with Seller
      </button>
    </div>
  );
};

interface VariantCardProps {
  product: Product;
  size: string;
  variants: NonNullable<Product["variants"]>;
  colors: (string | undefined)[];
  image?: string;
  variantQuantities: VariantQuantity;
  setVariantQuantities: React.Dispatch<React.SetStateAction<VariantQuantity>>;
}

const VariantCard: React.FC<VariantCardProps> = ({
  product,
  size,
  variants,
  colors,
  image,
  variantQuantities,
  setVariantQuantities,
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

  // Get cart item ID and current quantity
  const cartItemId = `${product._id}-${size}-${selectedColor}`;
  const currentQuantity = variantQuantities[cartItemId] || 0;

  const handleIncrement = () => {
    if (currentQuantity < stock) {
      setVariantQuantities((prev) => ({
        ...prev,
        [cartItemId]: currentQuantity + 1,
      }));
    } else {
      toast.error("Maximum stock reached");
    }
  };

  const handleDecrement = () => {
    if (currentQuantity > 0) {
      setVariantQuantities((prev) => ({
        ...prev,
        [cartItemId]: Math.max(0, currentQuantity - 1),
      }));
    }
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex flex-row gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Left: Product Image - Smaller on mobile */}
        {image && (
          <div className=" w-20 md:w-24 flex-shrink-0">
            <img
              src={image}
              alt={`${product.name} - ${size}`}
              className="w-full h-auto object-contain rounded"
            />
          </div>
        )}

        {/* Middle: Product Details */}
        <div className="flex-1 space-y-2 min-w-0">
          {/* Recommended Badge */}
          {isRecommended && (
            <div className="inline-block text-orange-700 py-0.5 text-xs font-semibold">
              Recommended: {isRecommended}
            </div>
          )}

          {/* Size */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Size:</span>
            <span className="text-sm font-bold text-gray-800">{size}</span>
          </div>

          {/* Price - Compact */}
          <div className="flex items-baseline gap-2 flex-wrap">
            {originalPrice && (
              <span className="text-xs line-through text-gray-400">
                Tk {originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-gray-800">
              Tk {currentPrice.toLocaleString()}
            </span>
            {discountPercentage > 0 && (
              <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-semibold">
                {discountPercentage}% off
              </span>
            )}
          </div>

          {/* Color Selection - Compact */}
          {colors.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color || "")}
                    className={`px-2 sm:px-2.5 py-1 rounded border text-xs font-medium transition-all ${
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
        </div>

        {/* Right: Stock & Quantity - Compact */}
        <div className="sm:w-20 md:w-28 flex-shrink-0 flex flex-col gap-3 sm:gap-4 justify-center items-start ">
          <div className="text-left sm:text-right">
            <span className="text-gray-800 font-bold text-sm">
              Stock: {stock > 0 ? stock : "Out"}
            </span>
          </div>

          {/* Quantity Controls - Compact */}
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={handleDecrement}
              disabled={currentQuantity === 0}
              className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <span className="w-8 sm:w-10 text-center font-semibold text-sm text-gray-800 border-x border-gray-300">
              {currentQuantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={currentQuantity >= stock || !selectedColor}
              className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
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
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { data, isPending } = useQueryWrapper<Reviews>(
    ["get-review-of-product", params._id, page],
    `/product/get-all-reviews-for-products?id=${params._id}&page=${page}`,
    { enabled: activeTab === "reviews" }
  );

  useEffect(() => {
    getUserInfo().then((user) => {
      setGetUser(user);
    });
  }, []);

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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images Section */}
          <div className="space-y-4 lg:sticky lg:top-4 h-fit">
            {/* Image Section - Responsive Thumbnails */}
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Thumbnails - BOTTOM for mobile, LEFT for desktop */}
              {(params?.images?.length ?? 0) > 1 && (
                <div className="flex flex-row lg:flex-col gap-2 order-2 lg:order-1 w-full lg:w-16 xl:w-20 flex-shrink-0 overflow-x-auto lg:overflow-x-visible">
                  {params?.images?.map((image, index) => (
                    <button
                      key={image?.id ?? index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 sm:w-20 lg:w-full aspect-square flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-palette-btn ring-2 ring-palette-btn/30"
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

              {/* Main Image */}
              <div className="relative flex-1 bg-gray-50 rounded-lg overflow-hidden order-1 lg:order-2">
                <img
                  src={
                    params?.images?.[selectedImageIndex]?.url ??
                    params?.thumbnail?.url ??
                    ""
                  }
                  alt={params?.name ?? "Product image"}
                  className="w-full h-auto object-contain"
                />

                {priceRange?.hasDiscount && (
                  <div className="absolute top-4 left-4 bg-palette-btn text-white px-4 py-2 rounded-full text-sm font-bold">
                    SALE
                  </div>
                )}

                {/* Navigation Arrows for Main Image */}
                {(params?.images?.length ?? 0) > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation("prev")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-palette-text border border-gray-200 shadow-md"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={() => handleImageNavigation("next")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-palette-text border border-gray-200 shadow-md"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Desktop Description - Under Image - Full Width */}
            <div className="hidden lg:block pt-6 w-full">
              <h3 className="text-xl font-bold text-palette-text mb-4">
                Product Description
              </h3>
              <div className="w-full">
                <DescriptionComponent params={params?.description} />
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
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

            {/* Price Range - WITHOUT "Save up to" */}
            {priceRange && (
              <div className="space-y-1   rounded-lg">
                <div className="flex items-baseline gap-3 flex-wrap">
                  {priceRange.hasDiscount && (
                    <span className="text-base text-gray-400 line-through">
                      Tk {priceRange.originalMin.toLocaleString()}
                      {priceRange.originalMin !== priceRange.originalMax &&
                        ` - ${priceRange.originalMax.toLocaleString()}`}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-bold text-palette-text">
                    Tk {priceRange.min.toLocaleString()}
                    {priceRange.min !== priceRange.max &&
                      ` - ${priceRange.max.toLocaleString()}`}
                  </span>
                </div>
                {params?.hasOffer && params?.offerExpiresAt && (
                  <p className="text-xs text-gray-600">
                    ⏰ Offer expires on{" "}
                    <span className="font-semibold">
                      {new Date(params.offerExpiresAt).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Short Description with Line Clamp & See More */}
            <div className="space-y-2">
              {params?.shortDescription && (
                <>
                  <p
                    className={`text-sm text-gray-600 leading-relaxed ${
                      !showFullDescription ? "line-clamp-2" : ""
                    }`}
                  >
                    {params?.shortDescription}
                  </p>
                  {params?.shortDescription.length > 100 && (
                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="text-palette-btn text-sm font-semibold hover:underline"
                    >
                      {showFullDescription ? "See Less" : "See More"}
                    </button>
                  )}
                </>
              )}
              <Separator />
              {params?.special_offer && (
                <div className="bg-green-50/20 px-3 py-2 rounded-lg mt-2">
                  <span className=" text-gray-800 font-bold">
                    Special Offer:
                  </span>
                  <p className="text-sm text-gray-800 font-semibold">
                    {params?.special_offer}
                  </p>
                </div>
              )}
            </div>

            {/* Variant Cards with Updated Button Layout */}
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

        {/* Tabs Section - Full Width */}
        <div className="mt-12 sm:mt-16 w-full">
          {/* Mobile Description - Full Width */}
          <div className="lg:hidden mb-8 w-full">
            <h3 className="text-xl font-bold text-palette-text mb-4">
              Product Description
            </h3>
            <div className="w-full">
              <DescriptionComponent params={params?.description} />
            </div>
          </div>

          <ProductTabs
            params={params}
            activeTab={activeTab}
            renderRating={renderRating}
            setActiveTab={setActiveTab}
            page={page}
            setPage={setPage}
            reviews={data?.data}
            totalPages={data?.totalPage ?? 0}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
