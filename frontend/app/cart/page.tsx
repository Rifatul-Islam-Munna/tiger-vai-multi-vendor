"use client";
import { Trash2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function CartPage() {
  const [quantities, setQuantities] = useState({ 1: 1, 2: 1 });

  const handleQuantityChange = (itemId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, prev[itemId] + change),
    }));
  };

  return (
    <div className="min-h-screen bg-palette-bg">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <span>Home</span>
          <span>/</span>
          <span className="text-palette-btn font-semibold">Cart</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-palette-text mb-8">
          Your Shopping Cart
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {/* Seller 1 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition">
              <CardContent className="p-6">
                <h3 className="font-semibold text-palette-text mb-4">
                  Sold by Aarong
                </h3>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex gap-4 pb-4 border-b border-gray-200">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-palette-text text-sm mb-2">
                        Shapla T-Shirt
                      </h4>
                      <p className="text-palette-btn font-bold text-sm">
                        Price: ৳850
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center border-2 border-gray-200 rounded">
                        <button
                          onClick={() => handleQuantityChange(1, -1)}
                          className="px-3 py-1 text-palette-text hover:bg-palette-bg/50 transition"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 text-palette-text font-medium">
                          {quantities[1]}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(1, 1)}
                          className="px-3 py-1 text-palette-text hover:bg-palette-bg/50 transition"
                        >
                          +
                        </button>
                      </div>
                      <button className="text-palette-btn hover:text-palette-btn/80 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller 2 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition">
              <CardContent className="p-6">
                <h3 className="font-semibold text-palette-text mb-4">
                  Sold by Tangail Weaves
                </h3>

                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-palette-text text-sm mb-2">
                      Jamdani Saree
                    </h4>
                    <p className="text-palette-btn font-bold text-sm">
                      Price: ৳4,500
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center border-2 border-gray-200 rounded">
                      <button
                        onClick={() => handleQuantityChange(2, -1)}
                        className="px-3 py-1 text-palette-text hover:bg-palette-bg/50 transition"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 text-palette-text font-medium">
                        {quantities[2]}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(2, 1)}
                        className="px-3 py-1 text-palette-text hover:bg-palette-bg/50 transition"
                      >
                        +
                      </button>
                    </div>
                    <button className="text-palette-btn hover:text-palette-btn/80 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="link"
              className="text-palette-btn hover:text-palette-btn/80 p-0 justify-start font-medium"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-0 shadow-lg sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-palette-text mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-palette-text font-medium">
                      ৳5,350
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-600">Calculated next</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-gray-600">Calculated next</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-palette-btn text-2xl font-bold">
                    ৳5,350
                  </span>
                </div>

                <Button className="w-full bg-palette-btn hover:bg-palette-btn/90 text-white h-12 font-semibold rounded-lg transition">
                  Proceed to Checkout
                </Button>

                <button className="w-full mt-3 border-2 border-gray-200 h-11 rounded-lg text-palette-text font-medium hover:border-palette-btn hover:bg-palette-bg/50 transition">
                  Continue Shopping
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
