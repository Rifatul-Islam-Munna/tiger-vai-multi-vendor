"use client";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>

          <p className="text-sm text-gray-600 mb-4 max-w-md">
            Thank you for your purchase. A confirmation has been sent to your
            email and phone.
          </p>
        </div>

        <Card className="border-2 border-gray-200 mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 text-sm mb-1">Order Number</p>
                <p className="text-[#e23636] text-xl md:text-2xl font-bold">
                  #ORD-123456789
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Estimated Delivery</p>
                <p className="text-gray-900 text-lg md:text-xl font-semibold">
                  25 August - 28 August, 2024
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-[#e23636] hover:bg-red-700 text-white px-8 py-6 h-auto">
            Track Your Order
          </Button>
          <Button
            variant="outline"
            className="border-2 border-gray-300 text-gray-900 px-8 py-6 h-auto bg-transparent"
          >
            Continue Shopping
          </Button>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-8 text-center text-gray-600">
        <p>© 2025 E-commerce BD. All rights reserved.</p>
      </footer>
    </div>
  );
}
