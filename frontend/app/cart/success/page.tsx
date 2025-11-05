"use client";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-palette-bg">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Success Message */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-palette-btn/10">
              <CheckCircle className="w-12 h-12 text-palette-btn" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-palette-text mb-2">
            Order Placed Successfully!
          </h1>

          <p className="text-sm text-gray-600 mb-4 max-w-md leading-relaxed">
            Thank you for your purchase. A confirmation email and SMS have been
            sent to your registered email and phone number.
          </p>
        </div>

        {/* Order Details */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-left md:text-center md:border-r md:border-gray-200">
                <p className="text-gray-600 text-sm mb-2 font-medium">
                  Order Number
                </p>
                <p className="text-palette-btn text-xl md:text-2xl font-bold">
                  #ORD-123456789
                </p>
              </div>
              <div className="text-left md:text-center">
                <p className="text-gray-600 text-sm mb-2 font-medium">
                  Estimated Delivery
                </p>
                <p className="text-palette-text text-lg md:text-xl font-semibold">
                  25 Aug - 28 Aug, 2024
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Steps */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { step: "1", label: "Order Confirmed", active: true },
            { step: "2", label: "Packed", active: false },
            { step: "3", label: "Shipped", active: false },
            { step: "4", label: "Delivered", active: false },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition ${
                  item.active
                    ? "bg-palette-btn text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {item.step}
              </div>
              <p
                className={`text-xs text-center ${
                  item.active
                    ? "text-palette-btn font-semibold"
                    : "text-gray-600"
                }`}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button className="bg-palette-btn hover:bg-palette-btn/90 text-white px-8 py-3 h-auto font-semibold rounded-lg transition shadow-md hover:shadow-lg">
            Track Your Order
          </Button>
          <Button
            variant="outline"
            className="border-2 border-gray-200 text-palette-text px-8 py-3 h-auto font-semibold bg-white hover:border-palette-btn hover:bg-palette-bg/50 transition"
          >
            Continue Shopping
          </Button>
        </div>

        {/* Info Box */}
        <Card className="border-0 bg-palette-btn/5 shadow-none mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-palette-text mb-3">
              What's Next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-palette-btn font-bold">•</span>
                <span>
                  You'll receive a tracking link via email and SMS within the
                  next 2 hours
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-palette-btn font-bold">•</span>
                <span>
                  Your order will be picked and packed by the vendor within 24
                  hours
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-palette-btn font-bold">•</span>
                <span>
                  Standard delivery takes 3-5 business days from dispatch
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-gray-600 text-sm">
        <p>© 2025 MarketHub. All rights reserved.</p>
        <div className="mt-3 space-x-4">
          <a href="#" className="hover:text-palette-btn transition font-medium">
            Contact Support
          </a>
          <span>|</span>
          <a href="#" className="hover:text-palette-btn transition font-medium">
            FAQ
          </a>
        </div>
      </footer>
    </div>
  );
}
