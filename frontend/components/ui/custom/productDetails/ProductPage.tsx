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
  ShoppingCart,
  X,
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
  variantQuantities: VariantQuantity;
  setVariantQuantities: React.Dispatch<React.SetStateAction<VariantQuantity>>;
}

// Track quantities for each variant
interface VariantQuantity {
  [cartItemId: string]: number;
}

// Item detail interface for banner
interface CartItemDetail {
  name: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
}

// Enhanced Sticky Bottom Banner with Product Details
const StickyCartBanner: React.FC<{
  totalItems: number;
  totalPrice: number;
  show: boolean;
  items: CartItemDetail[];
}> = ({ totalItems, totalPrice, show, items }) => {
  if (!show) return null;

  console.log("🚨 BANNER RENDER:", { show, totalItems, totalPrice });

  return (
    <div className="fixed top-0 left-0 translate-y-[120px] md:translate-y-[120px] right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-2 lg:flex lg:justify-end">
        <div className="lg:w-[45%] lg:max-w-xl lg:mr-8">
          {/* Selected Header */}
          <div className="text-red-600 font-semibold text-sm mb-1">
            Selected
          </div>

          {/* Compact Items List */}
          <div className="space-y-0.5 text-gray-800 text-sm">
            {items.slice(0, 4).map((item, index) => (
              <div key={index} className="leading-tight">
                {item.name}-{item.size}-{item.color} - {item.size} (qty{" "}
                {item.quantity})
              </div>
            ))}
          </div>

          {/* Total Bar */}
          <div className="text-sm font-semibold text-gray-900 mt-1.5 pt-1.5 border-t border-gray-200">
            Total = {totalItems} item(s), Tk {totalPrice.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductVariantCards: React.FC<ProductVariantCardsProps> = ({
  product,
  user,
  variantQuantities,
  setVariantQuantities,
}) => {
  const { addToCart, items, updateQuantity } = useCartStore();
  const router = useRouter();

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

  // --- HELPER TO PARSE ID SAFELY ---
  const parseCartItemId = (id: string) => {
    // We use '|' now, so split safely
    const parts = id.split("|");
    // Handle cases where data might be missing
    if (parts.length < 3) return null;
    return {
      productId: parts[0],
      size: parts[1],
      color: parts[2],
    };
  };

  const handleAddAllToCart = (isForCheckout?: boolean) => {
    let addedCount = 0;

    Object.entries(variantQuantities).forEach(([cartItemId, quantity]) => {
      if (quantity > 0) {
        // FIXED: Safe parsing using '|' separator
        const parsed = parseCartItemId(cartItemId);
        if (!parsed) return;

        const { size, color } = parsed;

        // Ensure we find the exact variant match
        const variant = product.variants?.find(
          (v) => v.size === size && v.color === color
        );

        if (variant && (variant.stock || 0) >= quantity) {
          const cartItem: Omit<CartItem, "quantity"> = {
            _id: cartItemId, // Keep the ID consistent
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

          const existingItem = items.find((item) => item._id === cartItemId);

          if (existingItem) {
            updateQuantity(cartItemId, existingItem.quantity + quantity);
          } else {
            addToCart(cartItem);
            updateQuantity(cartItemId, quantity);
          }

          // Tracking Events
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

          if (isForCheckout) {
            // Logic for checkout event if needed here
          }
          addedCount++;
        }
      }
    });

    if (addedCount > 0) {
      toast.success(`${addedCount} item(s) added to cart!`, {
        position: "bottom-right",
      });
      setVariantQuantities({});
    } else {
      toast.error("Please select quantity for at least one variant");
    }
  };

  const handleOrderNow = () => {
    let addedCount = 0;

    Object.entries(variantQuantities).forEach(([cartItemId, quantity]) => {
      if (quantity > 0) {
        // FIXED: Safe parsing using '|' separator
        const parsed = parseCartItemId(cartItemId);
        if (!parsed) return;

        const { size, color } = parsed;

        const variant = product.variants?.find(
          (v) => v.size === size && v.color === color
        );

        if (variant && (variant.stock || 0) >= quantity) {
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

          const existingItem = items.find((item) => item._id === cartItemId);
          if (existingItem) {
            updateQuantity(cartItemId, existingItem.quantity + quantity);
          } else {
            addToCart(cartItem);
            updateQuantity(cartItemId, quantity);
          }

          const eventId = uuidv4();
          const payloadForCheckout = {
            event_id: eventId,
            userId: user?.id,
            userName: user?.name,
            email: user?.email,
            items: items, // Note: This might not include the *just added* item if state updates are batched. Consider passing the new item explicitly if critical.
          };

          initiateCheckoutEvent(payloadForCheckout);
          initiateCheckoutServerEvent(payloadForCheckout);

          addedCount++;
        }
      }
    });

    if (addedCount > 0) {
      toast.success(`Processing Order...`);
      setVariantQuantities({});
      router.push("/cart/shipment");
    } else {
      toast.error("Please select quantity for at least one variant");
    }
  };

  const handleChatWithSeller = () => {
    toast.info("Chat feature coming soon!");
  };

  return (
    <section className="relative">
      <div className="space-y-1">
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

        {/* Buttons */}
        <div className="grid  grid-cols-2 gap-1 md:gap-3 pt-1">
          <button
            onClick={() => handleAddAllToCart(false)}
            className="w-full py-3 md:px-4 rounded-full font-semibold text-sm md:text-base transition-all bg-gradient-to-r !from-[#ffbd05] !to-[#ffbd05] text-gray-800"
          >
            Add To Cart
          </button>

          <button
            onClick={handleOrderNow}
            className="w-full py-3 md:px-4 rounded-full font-semibold text-sm md:text-base transition-all bg-gradient-to-b from-[#fe3200] to-[#ff5507] text-white"
          >
            Order Now <span className="text-sm">(অর্ডার করুন)</span>
          </button>
        </div>

        {/* Chat Button */}
        <button
          onClick={handleChatWithSeller}
          className="w-full py-3 px-4 rounded-full font-semibold text-base transition-all bg-[#2E83F2] hover:bg-[#1976D2] text-white flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Chat with Seller
        </button>
      </div>
    </section>
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

  // FIXED: Use '|' separator to prevent splitting issues with IDs/Sizes containing hyphens
  const cartItemId = `${product._id}|${size}|${selectedColor}`;

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
    <div className="relative bg-white border border-gray-100/80 rounded-lg overflow-hidden">
      <div className="flex flex-row gap-3 sm:gap-4 ">
        {/* Left: Product Image */}
        {image && (
          <div className="w-20 md:w-24 flex-shrink-0">
            <img
              src={image}
              alt={`${product.name} - ${size}`}
              className="w-full h-full object-contain  rounded"
            />
          </div>
        )}

        {/* Right side content (full flex-1) */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Top row: Recommended (full width, aligned to right) */}
          {isRecommended && (
            <div className="w-full flex justify-start">
              <div className="inline-block text-[#2E83F2] py-0.5 text-xs font-semibold">
                {isRecommended}
              </div>
            </div>
          )}

          {/* Middle + bottom are responsive columns/rows */}
          <div className="flex flex-row md:items-stretch gap-3">
            {/* Middle: Product Details */}
            <div className="flex-1 space-y-1 min-w-0">
              {/* Size */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Size:</span>
                <span className="text-xs md:text-sm font-bold text-gray-800">
                  {size}
                </span>
              </div>
              {/* Color Selection */}
              {colors.length > 1 && (
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
              <div className=" flex justify-between items-center">
                {/* Price */}
                <div className="flex items-baseline gap-2 flex-wrap">
                  {originalPrice && (
                    <span className="text-xs line-through text-gray-400">
                      Tk {originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-base sm:text-lg font-bold text-gray-800">
                    Tk {currentPrice.toLocaleString()}
                  </span>
                </div>
                {/* Right: Stock & Quantity (desktop/tablet only) */}
                <div className="flex sm:w-20 md:w-28 flex-shrink-0 flex-col   justify-center items-center">
                  <div className="text-left sm:text-right">
                    <span className="text-gray-800 font-bold text-xs">
                      Stock: {stock > 0 ? stock : "Out"}
                    </span>
                  </div>

                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={handleDecrement}
                      disabled={currentQuantity === 0}
                      className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4 " />
                    </button>
                    <span className="w-8 sm:w-10 text-center font-semibold text-sm text-gray-800 border-x border-gray-300">
                      {currentQuantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={currentQuantity >= stock || !selectedColor}
                      className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4 " />
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
  const [isMounted, setIsMounted] = useState(false);
  // Lift variantQuantities state to page level
  const [variantQuantities, setVariantQuantities] = useState<VariantQuantity>(
    {}
  );
  useEffect(() => {
    setIsMounted(true);
  }, []);
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

  // Calculate cart summary at page level with detailed items
  // Calculate cart summary at page level with detailed items
  const cartSummary = React.useMemo(() => {
    let totalItems = 0;
    let totalPrice = 0;
    const items: CartItemDetail[] = [];

    // Reuse the same safe parser from ProductVariantCards
    const parseCartItemId = (id: string) => {
      const parts = id.split("|");
      if (parts.length < 3) return null;
      return { productId: parts[0], size: parts[1], color: parts[2] };
    };

    Object.entries(variantQuantities).forEach(([cartItemId, quantity]) => {
      if (quantity > 0) {
        const parsed = parseCartItemId(cartItemId);
        if (!parsed) return;

        const { size, color } = parsed;
        const variant = params.variants?.find(
          (v) => v.size === size && v.color === color
        );

        if (variant) {
          const unitPrice = variant.discountPrice ?? variant.price;
          totalItems += quantity;
          totalPrice += unitPrice * quantity;

          items.push({
            name: params.name ?? "Product",
            size: size,
            color: color,
            quantity: quantity,
            unitPrice: unitPrice,
          });
        }
      }
    });

    return { totalItems, totalPrice, items };
  }, [variantQuantities, params.variants, params.name]);

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
      {/* Sticky Banner with detailed items */}
      {isMounted && (
        <StickyCartBanner
          totalItems={cartSummary.totalItems}
          totalPrice={cartSummary.totalPrice}
          items={cartSummary.items}
          show={cartSummary.totalItems > 0}
        />
      )}

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="text-sm flex items-center gap-3 text-gray-500 overflow-x-auto whitespace-nowrap mb-6">
          <span>{params?.category?.main ?? "Category"}</span>
          {params?.category?.subMain && (
            <>
              <ChevronRight className=" w-4 h-4  " />

              <span>{params.category.subMain}</span>
            </>
          )}
          {params?.category?.semiSub && (
            <>
              <ChevronRight className=" w-4 h-4  " />
              <span>{params.category.semiSub}</span>
            </>
          )}
          {params?.category?.category && (
            <>
              <ChevronRight className=" w-4 h-4  " />
              <span>{params.category.category}</span>
            </>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-12">
          {/* Product Images Section */}
          <div className="md:space-y-4 lg:sticky lg:top-4 h-fit">
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
                  <div className="absolute top-4 left-4 bg-[#BD1920] text-white px-4 py-2 rounded-full text-sm font-bold">
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
            <div className="hidden lg:block pt-3 w-full">
              <h3 className="text-xl font-bold text-palette-text mb-1.5">
                Product Description
              </h3>
              <div className="w-full">
                <DescriptionComponent params={params?.description} />
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className=" ">
            {/* Product Title & Brand */}
            <div className="space-y-1">
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
              <div className=" rounded-lg py-1.5">
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
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {!showFullDescription &&
                    params?.shortDescription.length > 200
                      ? params?.shortDescription.slice(0, 200) + "... "
                      : params?.shortDescription}
                    {params?.shortDescription.length > 200 && (
                      <button
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                        className="text-palette-btn text-sm font-semibold hover:underline ml-1"
                      >
                        {showFullDescription ? "See Less" : "See More"}
                      </button>
                    )}
                  </p>
                </div>
              )}

              <Separator />
              {params?.special_offer && (
                <div className="bg-green-50/20 px-3 py-2 rounded-lg mt-2">
                  <span className=" text-[#ff5507] font-bold">
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
              <div className="">
                <ProductVariantCards
                  product={params}
                  user={getUser}
                  variantQuantities={variantQuantities}
                  setVariantQuantities={setVariantQuantities}
                />
              </div>
            )}

            {/* Key Features */}
            {(params?.features?.length ?? 0) > 0 && (
              <div className="space-y-2">
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
            <div className="space-y-1 border-t border-gray-200 pt-6">
              <div className="flex items-start gap-3 px-3 py-0.5 rounded-lg">
                <Truck className="w-5 h-5 text-palette-btn mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-palette-text text-sm sm:text-base">
                    {params?.freeShipping
                      ? "Free Shipping"
                      : params?.shippingCost
                      ? `Shipping: ৳${params.shippingCost}/kg`
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
                <div className="flex items-start gap-3 px-2 py-0.5 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-palette-btn mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-palette-text text-sm sm:text-base">
                      Returns Policy
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {params.returnPolicy}
                    </p>
                  </div>
                </div>
              )}

              {params?.warrantyPeriod && (
                <div className="flex items-start gap-3 px-3 py-0.5 rounded-lg">
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
        <div className="mt-1 w-full">
          {/* Mobile Description - Full Width */}
          <div className="lg:hidden mb-1 w-full">
            <h3 className="text-xl font-bold text-palette-text mb-1.5">
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
