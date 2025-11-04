"use client";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ReviewOrderPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <span>Cart</span>
          <span>{">"}</span>
          <span>Shipping</span>
          <span>{">"}</span>
          <span>Payment</span>
          <span>{">"}</span>
          <span className="text-[#e23636] font-semibold">Review</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Review Your Order
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Shipping Address
                  </h2>
                  <Button variant="link" className="text-[#e23636] p-0">
                    Change
                  </Button>
                </div>

                <div className="space-y-1 text-gray-700">
                  <p className="font-semibold">Anika Tabassum</p>
                  <p>Phone: +8801712345678</p>
                  <p>
                    House 123, Road 4, Block B, Bashundhara R/A, Dhaka - 1229
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Payment Method
                  </h2>
                  <Button variant="link" className="text-[#e23636] p-0">
                    Change
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">
                    Cash on Delivery (COD)
                  </p>
                  <p className="text-gray-600 text-sm">
                    Pay with cash upon delivery of your order.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Shipping Method
                  </h2>
                  <Button variant="link" className="text-[#e23636] p-0">
                    Change
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">
                    Standard Delivery
                  </p>
                  <p className="text-gray-600 text-sm">
                    Estimated delivery: 3-5 business days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-2 border-gray-200 sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        Comfort Running Shoe
                      </p>
                      <p className="text-xs text-gray-600">
                        Size: 42, Color: Red
                      </p>
                      <p className="text-xs text-gray-600">QTY: 1</p>
                      <p className="text-[#e23636] font-bold text-sm mt-1">
                        ৳1,250
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        Wireless Headphones
                      </p>
                      <p className="text-xs text-gray-600">Color: Black</p>
                      <p className="text-xs text-gray-600">QTY: 1</p>
                      <p className="text-[#e23636] font-bold text-sm mt-1">
                        ৳2,500
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">৳3,750</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="text-gray-900">৳60</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[#e23636] text-lg">৳3,810</span>
                  </div>
                </div>

                <Button className="w-full bg-[#e23636] hover:bg-red-700 text-white h-12 font-semibold mt-6">
                  Place Order Now
                </Button>
              </CardContent>
            </Card>

            <Button
              variant="link"
              className="w-full text-[#e23636] mt-4 justify-start p-0"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Payment
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
