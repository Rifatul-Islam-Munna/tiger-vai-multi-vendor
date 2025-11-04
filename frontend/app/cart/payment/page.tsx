"use client";
import { Truck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useState } from "react";

export default function PaymentPage() {
  const [selectedPayment, setSelectedPayment] = useState("cod");

  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery",
      desc: "Pay when you receive your order",
      icon: <Truck className="w-6 h-6" />,
    },
    {
      id: "mobile",
      name: "Mobile Banking",
      desc: "Pay with bKash, Nagad, Rocket",
      icon: <Wallet className="w-6 h-6" />,
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      desc: "Pay with Visa, Mastercard, Amex",
      icon: <Wallet className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <span>Shipping</span>
          <span>{">"}</span>
          <span className="text-[#e23636] font-semibold">Payment</span>
          <span>{">"}</span>
          <span>Confirmation</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 rounded-full mb-8">
          <div className="w-2/3 h-full bg-[#e23636] rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Select Payment Method
            </h1>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`border-2 cursor-pointer transition ${
                    selectedPayment === method.id
                      ? "border-[#e23636] bg-red-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedPayment === method.id
                            ? "border-[#e23636]"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPayment === method.id && (
                          <div className="w-3 h-3 bg-[#e23636] rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {method.icon}
                          <h3 className="font-semibold text-gray-900">
                            {method.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">{method.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-2 border-gray-200 sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Your Order Summary
                </h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">৳2,500.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="text-gray-900 font-medium">৳50.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-[#e23636] font-medium">-৳150.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">Total Payable Amount</span>
                  <span className="text-[#e23636] text-2xl font-bold">
                    ৳2,400.00
                  </span>
                </div>

                <Button className="w-full bg-[#e23636] hover:bg-red-700 text-white h-12 font-semibold">
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
