"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SearchPage = () => {
  const [selectedBrands, setSelectedBrands] = useState(["Apple", "Samsung"]);
  const [selectedRating, setSelectedRating] = useState("4 & up");
  const [priceRange, setPriceRange] = useState([10000, 70000]);

  const products = [
    {
      id: 1,
      name: "iPhone 14 Pro Max (256GB)",
      price: 145000,
      originalPrice: 170000,
      discount: 15,
      rating: 4.5,
      reviews: 1230,
      image: "📱",
    },
    {
      id: 2,
      name: "Samsung Galaxy S23 Ultra",
      price: 120000,
      originalPrice: 150000,
      discount: 0,
      rating: 4.2,
      reviews: 980,
      image: "📱",
    },
    {
      id: 3,
      name: "Google Pixel 7 Pro (128GB)",
      price: 90000,
      originalPrice: 100000,
      discount: 10,
      rating: 4.0,
      reviews: 854,
      image: "📱",
    },
    {
      id: 4,
      name: "OnePlus 11 5G",
      price: 85000,
      originalPrice: 95000,
      discount: 0,
      rating: 4.3,
      reviews: 789,
      image: "📱",
    },
    {
      id: 5,
      name: "Xiaomi Redmi Note 12 Pro",
      price: 32000,
      originalPrice: 40000,
      discount: 20,
      rating: 4.1,
      reviews: 2510,
      image: "📱",
    },
    {
      id: 6,
      name: "Apple iPhone SE (2022)",
      price: 55000,
      originalPrice: 65000,
      discount: 0,
      rating: 3.9,
      reviews: 450,
      image: "📱",
    },
  ];

  const brands = ["Apple", "Samsung", "Xiaomi", "OnePlus"];
  const ratings = ["4 & up", "3 & up", "2 & up", "1 & up"];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Showing 1-12 of 150 results for{" "}
            <span className="font-semibold">'Smartphones'</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* FILTERS SIDEBAR */}
          <div className="md:col-span-1">
            <div className="bg-white sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button className="text-[#e23636] text-sm font-medium hover:underline">
                  Reset
                </button>
              </div>

              {/* Category Filter */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="smartphones"
                      defaultChecked
                      className="w-4 h-4 accent-[#e23636]"
                    />
                    <label
                      htmlFor="smartphones"
                      className="ml-2 text-[#e23636] font-medium text-sm"
                    >
                      Smartphones
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="laptops"
                      className="w-4 h-4 accent-[#e23636]"
                    />
                    <label
                      htmlFor="laptops"
                      className="ml-2 text-gray-700 text-sm"
                    >
                      Laptops
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="headphones"
                      className="w-4 h-4 accent-[#e23636]"
                    />
                    <label
                      htmlFor="headphones"
                      className="ml-2 text-gray-700 text-sm"
                    >
                      Headphones
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cameras"
                      className="w-4 h-4 accent-[#e23636]"
                    />
                    <label
                      htmlFor="cameras"
                      className="ml-2 text-gray-700 text-sm"
                    >
                      Cameras
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="accessories"
                      className="w-4 h-4 accent-[#e23636]"
                    />
                    <label
                      htmlFor="accessories"
                      className="ml-2 text-gray-700 text-sm"
                    >
                      Accessories
                    </label>
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Price Range
                </h4>
                <div
                  className="w-full h-2 bg-gray-300 rounded-full mb-4"
                  style={{
                    background: `linear-gradient(to right, #e23636 0%, #e23636 100%)`,
                  }}
                ></div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span className="flex items-center text-gray-600">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              {/* Brands Filter */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Brands</h4>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        id={brand}
                        defaultChecked={selectedBrands.includes(brand)}
                        className="w-4 h-4 accent-[#e23636]"
                      />
                      <label
                        htmlFor={brand}
                        className="ml-2 text-gray-700 text-sm"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="pb-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Rating</h4>
                <div className="space-y-3">
                  {ratings.map((rating) => (
                    <div
                      key={rating}
                      className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100"
                      onClick={() => setSelectedRating(rating)}
                    >
                      <input
                        type="radio"
                        name="rating"
                        id={rating}
                        defaultChecked={rating === selectedRating}
                        className="w-4 h-4 accent-[#e23636]"
                      />
                      <label
                        htmlFor={rating}
                        className="text-sm text-gray-700 flex-1 cursor-pointer"
                      >
                        {rating}
                      </label>
                      <span className="text-[#e23636] text-xs font-medium bg-red-50 px-2 py-1 rounded">
                        {rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-[#e23636] hover:bg-red-700 text-white font-semibold py-2 h-auto">
                Apply Filters
              </Button>
            </div>
          </div>

          {/* PRODUCTS SECTION */}
          <div className="md:col-span-3">
            {/* Sorting Options */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <Badge className="bg-[#e23636] border-0 text-white cursor-pointer">
                Popularity
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Price: Low to High
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Price: High to Low
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Newest
              </Badge>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:border-[#e23636] transition border-2 border-gray-200 flex flex-col"
                >
                  <div className="relative">
                    {product.discount > 0 && (
                      <Badge className="absolute top-2 right-2 bg-[#e23636] border-0 z-10">
                        {product.discount}% OFF
                      </Badge>
                    )}
                    <div className="bg-gray-100 aspect-square flex items-center justify-center text-6xl">
                      {product.image}
                    </div>
                  </div>
                  <CardContent className="p-4 flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-600">
                        ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#e23636]">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-[#e23636] hover:bg-red-700 text-white">
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                ←
              </button>
              <button className="px-3 py-2 bg-[#e23636] text-white rounded font-medium">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                3
              </button>
              <span className="px-2">...</span>
              <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                8
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
