"use client";
import { ChevronLeft, Package, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/zustan-hook/cart";
import { useCheckoutStore } from "@/zustan-hook/checkoutStore";
import { useState } from "react";
import PageBanner from "@/components/ui/custom/common/PageBanner";
import { useApiMutation } from "@/api-hook/react-query-wrapper";
import { postNewSell } from "@/actions/sells";
import { getUserInfo } from "@/actions/auth";
import { purchaseEvent } from "@/lib/google-tag-manager";
import { purchaseServerEvent } from "@/actions/metaEvent";
import { v4 as uuidv4 } from "uuid";
import { Spinner } from "@/components/ui/spinner";
import PathaoChargeTable from "@/components/ui/custom/common/PathaoChargeTable";
import Image from "next/image";
export default function ShipmentPage() {
  const router = useRouter();
  const { items, totalPrice, totalDiscount } = useCartStore();
  const { shipment, updateShipmentField } = useCheckoutStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const finalTotal = totalPrice - totalDiscount;

  const onCompleteOrder = () => {
    router.push("/cart/success");
  };
  const { mutate, isPending } = useApiMutation(
    postNewSell,
    undefined,
    "sell-product-item",
    onCompleteOrder
  );
  const handlePlaceOrder = async () => {
    const orderPayload = {
      // ✅ CORRECT: Map to 'products' array (not 'items')
      products: items.map((item) => ({
        // Basic product info
        productId: item?.productId,
        slug: item?.slug,
        name: item?.name,
        quantity: item?.quantity,
        unitPrice: item?.unitPrice,

        // ✅ REQUIRED: Variant object with all fields
        variant: {
          size: item?.variant?.size,
          color: item?.variant?.color,
          sku: item?.variant?.sku || undefined,
          ...(item?.variant?.sku && { sku: item?.variant?.sku }),
          price: item?.variant?.price,
          ...(item?.variant?.discountPrice && {
            discountPrice: item.variant.discountPrice,
          }),
        },

        // Optional fields
        totalPrice: item?.unitPrice * item?.quantity,
        discountApplied: item.variant.discountPrice
          ? (item.variant.price - item.variant.discountPrice) * item.quantity
          : undefined,
      })),

      // ✅ REQUIRED: Shipment details
      shipment: {
        name: shipment?.name,
        phone: shipment?.phone,
        house: shipment?.house,
        paymentMethod: shipment?.paymentMethod,
        ...(shipment?.comment?.trim() && { comment: shipment?.comment }),
      },

      // ✅ REQUIRED: Order totals
      orderTotal: finalTotal,
      totalDiscount: totalDiscount || 0,
    };
    console.log("Order payload:", orderPayload);
    mutate(orderPayload);
    const eventId = uuidv4();
    const getUser = await getUserInfo();
    const extraData = {
      userId: getUser?.id,
      userName: getUser?.name,
      email: getUser?.email,
      event_id: eventId,
      ...orderPayload,
    };
    purchaseEvent(extraData);
    await purchaseServerEvent(extraData);
  };

  // ✅ FIXED: Validate only shipping fields, not payment method
  const isShippingValid = () => {
    return !!(
      shipment?.name?.trim() &&
      shipment?.phone?.trim() &&
      shipment?.house?.trim()
    );
  };

  const handleContinue = () => {
    if (!isShippingValid()) {
      setErrors({ form: "Please fill all required fields" });
      return;
    }
    router.push("/cart/payment");
  };
  const route = [
    {
      title: "Checkout",
      link: "/cart/shipment",
    },
  ];

  return (
    <div className="min-h-screen bg-palette-bg">
      <PageBanner title="Checkout" routes={route} />
      <main className=" container mx-auto px-3 md:px-1  py-8 md:py-12">
        {/* Breadcrumb */}

        {/* Progress Bar */}
        {/* <div className="w-full h-1 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div className="w-1/4 h-full bg-palette-btn rounded-full transition-all duration-300"></div>
        </div> */}

        <div className="grid lg:grid-cols-3 gap-8 mt-6">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-palette-text">
                Shipping Details
              </h1>
              <Link
                href="/cart"
                className="text-sm text-palette-btn hover:text-palette-btn/80 font-medium"
              >
                <ChevronLeft className="w-4 h-4 inline mr-1" />
                Back to Cart
              </Link>
            </div>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-palette-text mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-palette-btn" />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-palette-text">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={shipment?.name || ""}
                          onChange={(e) =>
                            updateShipmentField("name", e.target.value)
                          }
                          className="mt-1.5 border-gray-200 focus:border-palette-btn"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-palette-text">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative mt-1.5">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            value={shipment?.phone || ""}
                            onChange={(e) =>
                              updateShipmentField("phone", e.target.value)
                            }
                            className="pl-10 border-gray-200 focus:border-palette-btn"
                            placeholder="+880 1234-567890"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-palette-text mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-palette-btn" />
                      Shipping Address
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="house" className="text-palette-text">
                          Complete Address{" "}
                          <span className="text-red-500">*</span>
                          <span className=" text-xs  text-palette-accent-3">
                            (Must include Thana)
                          </span>
                        </Label>
                        <Textarea
                          id="house"
                          value={shipment?.house || ""}
                          onChange={(e) =>
                            updateShipmentField("house", e.target.value)
                          }
                          className="mt-1.5 border-gray-200 focus:border-palette-btn"
                          placeholder="House/Flat, Street, Area, City, Postal Code"
                          rows={4}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                          Include all details for accurate delivery
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="comment" className="text-palette-text">
                          Delivery Instructions (Optional)
                        </Label>
                        <Textarea
                          id="comment"
                          value={shipment?.comment || ""}
                          onChange={(e) =>
                            updateShipmentField("comment", e.target.value)
                          }
                          className="mt-1.5 border-gray-200 focus:border-palette-btn"
                          placeholder="Any special instructions for delivery..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <Package className="w-5 h-5 text-palette-btn mt-0.5" />
                      <div>
                        <h4 className="font-medium text-palette-text mb-1">
                          Estimated Delivery
                        </h4>
                        <p className="text-sm text-gray-600">
                          Your order will be delivered within 3-5 business days
                        </p>
                      </div>
                    </div>
                  </div>

                  {errors.form && (
                    <p className="text-red-500 text-sm">{errors.form}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border border-gray-200 sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-palette-text mb-6">
                  Order Summary
                </h2>

                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                    >
                      {/* <Image
                        src={item.thumbnail}
                        width={50}
                        height={50}
                        alt="product image"
                      /> */}
                      <div className=" flex flex-col">
                        <span className="text-gray-800 truncate pr-2">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-gray-600 truncate pr-2">
                          {item.variant.size}-{item.variant.color}
                        </span>
                      </div>

                      <span className="text-palette-text font-medium whitespace-nowrap">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-palette-text font-medium">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600 font-medium">
                        -${totalDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-600 text-xs">
                      Calculated at payment
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-palette-text font-semibold">
                      Estimated Total
                    </span>
                    <span className="text-palette-btn text-2xl font-bold">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 bg-palette-btn hover:bg-palette-btn/90 text-white h-12 font-semibold rounded-lg transition"
                  disabled={!isShippingValid() || isPending}
                >
                  {isPending && <Spinner className="mr-2" />} Place Order
                </Button>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong className="text-palette-text">
                      Secure Checkout:
                    </strong>{" "}
                    Your information is protected and encrypted
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className=" mt-4">
          <PathaoChargeTable />
        </div>
      </main>
    </div>
  );
}
