"use client";
import React, { useState } from "react";
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

const ProductPage = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Static sample data based on your schema
  const product = {
    name: "Premium Wireless Bluetooth Headphones",
    description:
      "Experience exceptional sound quality with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.",
    price: 299.99,
    offerPrice: 249.99,
    hasOffer: true,
    offerExpiresAt: "2025-12-31",
    stock: 25,
    isActive: true,
    slug: "premium-wireless-bluetooth-headphones",

    // Images
    thumbnail: {
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      alt: "Product thumbnail",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
        alt: "Main product view",
      },
      {
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
        alt: "Side view",
      },
      {
        url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop",
        alt: "Close up view",
      },
      {
        url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop",
        alt: "Usage view",
      },
    ],

    // Category info
    category: { name: "Electronics", slug: "electronics" },
    main: "ELECTRONICS",
    subMain: "Audio",
    semiSub: "Headphones",

    // Physical properties
    height: 20,
    width: 18,
    weight: "290g",
    size: "Standard",
    colors: ["Black", "White", "Navy Blue"],
    colorsImage: [
      {
        name: "Black",
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
        ],
      },
      {
        name: "White",
        images: [
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=100&h=100&fit=crop",
        ],
      },
      {
        name: "Navy Blue",
        images: [
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop",
        ],
      },
    ],

    // Business info
    brand: "AudioTech Pro",
    warrantyPeriod: "2 Years",
    returnPolicy: "30-day hassle-free returns",
    isDigital: false,

    // Shipping
    shippingTime: "2-3 business days",
    shippingCost: 0,
    freeShipping: true,

    // Certifications
    certifications: ["CE Certified", "FCC Approved", "RoHS Compliant"],

    // Specifications
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      "Battery Life": "30 hours",
      "Charging Time": "2 hours",
      "Bluetooth Version": "5.0",
      Weight: "290g",
      "Noise Cancellation": "Active ANC",
      Microphone: "Built-in with CVC",
    },

    // Features (dynamic)
    features: [
      {
        name: "Active Noise Cancellation",
        description: "Advanced ANC technology",
      },
      { name: "30-Hour Battery", description: "All-day listening experience" },
      {
        name: "Fast Charging",
        description: "Quick 15-min charge for 3 hours playback",
      },
      {
        name: "Premium Materials",
        description: "Durable construction with soft padding",
      },
    ],

    // SEO
    metaTitle: "Premium Wireless Bluetooth Headphones - AudioTech Pro",
    metaDescription:
      "Experience superior sound quality with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.",
  };

  const handleImageNavigation = (direction) => {
    if (direction === "next") {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    } else {
      setSelectedImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  const renderRating = (rating = 4.5) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">(128 reviews)</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-0 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImageIndex].url}
              alt={product.images[selectedImageIndex].alt}
              className="w-full h-full object-cover"
            />

            {/* Navigation Arrows */}
            <button
              onClick={() => handleImageNavigation("prev")}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleImageNavigation("next")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Offer Badge */}
            {product.hasOffer && (
              <div className="absolute top-4 left-4 bg-[#e23636] text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                Save ${(product.price - product.offerPrice).toFixed(2)}
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-3">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index
                    ? "border-[#e23636]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Color Variations */}
          {product.colorsImage.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Available Colors</h4>
              <div className="flex gap-3">
                {product.colorsImage.map((colorOption) => (
                  <button
                    key={colorOption.name}
                    onClick={() => setSelectedColor(colorOption.name)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedColor === colorOption.name
                        ? "border-[#e23636]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={colorOption.images[0]}
                      alt={colorOption.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500">
            <span>{product.main}</span> / <span>{product.subMain}</span> /{" "}
            <span>{product.semiSub}</span>
          </div>

          {/* Product Title & Brand */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-600">by {product.brand}</p>
            {renderRating()}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              {product.hasOffer ? (
                <>
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.offerPrice}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.price}
                  </span>
                  <span className="bg-red-100 text-[#e23636] px-2 py-1 rounded text-sm font-medium">
                    {Math.round(
                      ((product.price - product.offerPrice) / product.price) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
              )}
            </div>
            {product.hasOffer && (
              <p className="text-sm text-gray-500">
                Offer expires on{" "}
                {new Date(product.offerExpiresAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 0
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-[#e23636]"
            }`}
          >
            {product.stock > 0
              ? `In Stock (${product.stock} available)`
              : "Out of Stock"}
          </div>

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Color</h4>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedColor === color
                        ? "border-[#e23636] bg-red-50 text-[#e23636]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection (if applicable) */}
          {product.size && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Size</h4>
              <div className="flex gap-2">
                {["XS", "S", "M", "L", "XL", "Standard"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedSize === size
                        ? "border-[#e23636] bg-red-50 text-[#e23636]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Quantity</h4>
            <div className="flex items-center border border-gray-200 rounded-lg w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-gray-200">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              disabled={product.stock === 0}
              className="w-full bg-[#e23636] text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <div className="flex gap-3">
              <button className="flex-1 border border-gray-200 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Add to Wishlist
              </button>
              <button className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Key Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Award className="w-5 h-5 text-[#e23636] mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {feature.name}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Features */}
          <div className="space-y-3 border-t border-gray-200 pt-6">
            <div className="flex items-center gap-3 text-gray-600">
              <Truck className="w-5 h-5 text-[#e23636]" />
              <div>
                <p className="font-medium">
                  {product.freeShipping
                    ? "Free Shipping"
                    : `Shipping: $${product.shippingCost}`}
                </p>
                <p className="text-sm">Delivery in {product.shippingTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <RotateCcw className="w-5 h-5 text-[#e23636]" />
              <div>
                <p className="font-medium">Easy Returns</p>
                <p className="text-sm">{product.returnPolicy}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <Shield className="w-5 h-5 text-[#e23636]" />
              <div>
                <p className="font-medium">Warranty</p>
                <p className="text-sm">
                  {product.warrantyPeriod} manufacturer warranty
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {["description", "specifications", "reviews", "shipping"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-[#e23636] text-[#e23636]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Product Description</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <h4 className="font-medium mb-2">Dimensions</h4>
                  <p className="text-gray-600">
                    {product.height}cm × {product.width}cm
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium mb-2">Weight</h4>
                  <p className="text-gray-600">{product.weight}</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium mb-2">Brand</h4>
                  <p className="text-gray-600">{product.brand}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div>
              <h3 className="text-xl font-bold mb-6">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-3 border-b border-gray-100"
                  >
                    <span className="font-medium text-gray-900">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>

              {product.certifications.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-medium mb-4">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
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
              <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">4.5</div>
                    <div className="flex justify-center mt-1">
                      {renderRating()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Based on 128 reviews
                    </div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div
                        key={rating}
                        className="flex items-center gap-3 mb-1"
                      >
                        <span className="text-sm w-3">{rating}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${
                                rating === 5
                                  ? 60
                                  : rating === 4
                                  ? 25
                                  : rating === 3
                                  ? 10
                                  : 3
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-8">
                          {rating === 5
                            ? 77
                            : rating === 4
                            ? 32
                            : rating === 3
                            ? 13
                            : 4}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[
                    {
                      name: "Sarah Johnson",
                      rating: 5,
                      date: "2024-09-15",
                      review:
                        "Excellent sound quality and comfort. The noise cancellation works perfectly for my daily commute.",
                    },
                    {
                      name: "Mike Chen",
                      rating: 4,
                      date: "2024-09-10",
                      review:
                        "Great headphones overall. Battery life is impressive, though I wish they were slightly lighter.",
                    },
                    {
                      name: "Lisa Rodriguez",
                      rating: 5,
                      date: "2024-09-05",
                      review:
                        "Perfect for work from home. The microphone quality is crystal clear for video calls.",
                    },
                  ].map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{review.name}</h5>
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{review.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div>
              <h3 className="text-xl font-bold mb-6">Shipping & Returns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-4">Shipping Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Delivery Time</span>
                      <span className="font-medium">
                        {product.shippingTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Cost</span>
                      <span className="font-medium">
                        {product.freeShipping
                          ? "Free"
                          : `$${product.shippingCost}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express Delivery</span>
                      <span className="font-medium">Next day (+$15)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Return Policy</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Return Period</span>
                      <span className="font-medium">
                        {product.returnPolicy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Warranty</span>
                      <span className="font-medium">
                        {product.warrantyPeriod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-lg">
                <h4 className="font-medium mb-2 text-[#e23636]">
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
  );
};

export default ProductPage;
