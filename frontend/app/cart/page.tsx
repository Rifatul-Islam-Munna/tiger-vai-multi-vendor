"use client";
import { Trash2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useState } from "react";

export default function CartPage() {
  const [quantities, setQuantities] = useState({ 1: 1, 2: 1 });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <span>Home</span>
          <span>{"/"}</span>
          <span className="text-[#e23636] font-semibold">Cart</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Your Shopping Cart
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {/* Seller 1 */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Sold by Aarong
                </h3>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex gap-4 pb-4 border-b border-gray-200">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">
                        Shapla T-Shirt
                      </h4>
                      <p className="text-[#e23636] font-bold text-sm">
                        Price: ৳850
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button className="px-3 py-1 text-gray-600">-</button>
                        <span className="px-4 py-1">{quantities[1]}</span>
                        <button className="px-3 py-1 text-gray-600">+</button>
                      </div>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller 2 */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Sold by Tangail Weaves
                </h3>

                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">
                      Jamdani Saree
                    </h4>
                    <p className="text-[#e23636] font-bold text-sm">
                      Price: ৳4,500
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button className="px-3 py-1 text-gray-600">-</button>
                      <span className="px-4 py-1">{quantities[2]}</span>
                      <button className="px-3 py-1 text-gray-600">+</button>
                    </div>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="link" className="text-[#e23636] p-0 justify-start">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-2 border-gray-200 sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">৳5,350</span>
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
                  <span className="text-gray-600">Total</span>
                  <span className="text-[#e23636] text-2xl font-bold">
                    ৳5,350
                  </span>
                </div>

                <Button className="w-full bg-[#e23636] hover:bg-red-700 text-white h-12 font-semibold">
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
