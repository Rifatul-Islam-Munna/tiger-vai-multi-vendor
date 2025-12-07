"use client";
import { ChevronLeft, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { TbTruckDelivery } from "react-icons/tb";
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
    if (!isShippingValid()) {
      setErrors({ form: "Please fill all required fields" });
      return;
    }

    const orderPayload = {
      products: items.map((item) => ({
        productId: item?.productId,
        slug: item?.slug,
        name: item?.name,
        quantity: item?.quantity,
        unitPrice: item?.unitPrice,
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
        totalPrice: item?.unitPrice * item?.quantity,
        discountApplied: item.variant.discountPrice
          ? (item.variant.price - item.variant.discountPrice) * item.quantity
          : undefined,
      })),
      shipment: {
        name: shipment?.name,
        phone: shipment?.phone,
        house: shipment?.house,
        thana: shipment?.thana,
        district: shipment?.district,
        paymentMethod: shipment?.paymentMethod,
        ...(shipment?.comment?.trim() && { comment: shipment?.comment }),
      },
      orderTotal: finalTotal,
      totalDiscount: totalDiscount || 0,
    };

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

  const isShippingValid = () => {
    return !!(
      shipment?.name?.trim() &&
      shipment?.phone?.trim() &&
      shipment?.house?.trim() &&
      shipment?.thana?.trim() &&
      shipment?.district?.trim()
    );
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

      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
              <div className="w-full sm:w-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 flex items-center gap-2 mb-2">
                  <TbTruckDelivery className="w-5 h-5 sm:w-6 sm:h-6" />
                  Shipping Address
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  আপনার পণ্য ডেলিভারি করার জন্য নিচে তথ্যগুলো দিয়ে সহযোগিতা
                  করবেন
                </p>
              </div>
              <Link
                href="/cart"
                className="text-xs sm:text-sm text-palette-btn hover:text-palette-btn/80 font-medium flex items-center whitespace-nowrap"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Back to Cart
              </Link>
            </div>

            <Card className="border shadow-none border-gray-200">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Full Name */}
                  <div>
                    <Input
                      id="name"
                      value={shipment?.name || ""}
                      onChange={(e) =>
                        updateShipmentField("name", e.target.value)
                      }
                      className="border-gray-300 focus:border-palette-btn h-11 sm:h-12 text-sm sm:text-base"
                      placeholder="Full name* (পূর্ণ নাম লিখুন)"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Input
                      id="phone"
                      type="tel"
                      value={shipment?.phone || ""}
                      onChange={(e) =>
                        updateShipmentField("phone", e.target.value)
                      }
                      className="border-gray-300 focus:border-palette-btn h-11 sm:h-12 text-sm sm:text-base"
                      placeholder="Phone* (ফোন নাম্বার লিখুন)"
                      required
                    />
                  </div>

                  {/* Full Address */}
                  <div>
                    <Textarea
                      id="house"
                      value={shipment?.house || ""}
                      onChange={(e) =>
                        updateShipmentField("house", e.target.value)
                      }
                      className="border-gray-300 focus:border-palette-btn text-sm sm:text-base resize-none"
                      placeholder="Full address* (সম্পূর্ণ ঠিকানা লিখুন)"
                      rows={4}
                      required
                    />
                  </div>

                  {/* Thana */}
                  <div>
                    <Input
                      id="thana"
                      value={shipment?.thana || ""}
                      onChange={(e) =>
                        updateShipmentField("thana", e.target.value)
                      }
                      className="border-gray-300 focus:border-palette-btn h-11 sm:h-12 text-sm sm:text-base"
                      placeholder="police station* (থানার নাম লিখুন)"
                      required
                    />
                  </div>

                  {/* District */}
                  <div>
                    <Input
                      id="district"
                      value={shipment?.district || ""}
                      onChange={(e) =>
                        updateShipmentField("district", e.target.value)
                      }
                      className="border-gray-300 focus:border-palette-btn h-11 sm:h-12 text-sm sm:text-base"
                      placeholder="District* (জেলার নাম লিখুন)"
                      required
                    />
                  </div>

                  {/* Order Notes */}
                  <div>
                    <Textarea
                      id="comment"
                      value={shipment?.comment || ""}
                      onChange={(e) =>
                        updateShipmentField("comment", e.target.value)
                      }
                      className="border-gray-300 focus:border-palette-btn text-sm sm:text-base resize-none"
                      placeholder="Order notes (optional) (অর্ডার সংক্রান্ত বিশেষ নির্দেশনা দিতে পারেন)"
                      rows={3}
                    />
                  </div>

                  {errors.form && (
                    <p className="text-red-500 text-xs sm:text-sm">
                      {errors.form}
                    </p>
                  )}

                  {/* Place Order Button */}
                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white h-11 sm:h-12 font-semibold rounded-md transition text-sm sm:text-base"
                    disabled={!isShippingValid() || isPending}
                  >
                    {isPending && <Spinner className="mr-2" />}
                    Place Order / অর্ডার সম্পন্ন করুন
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            {/*  <div className="mt-4">
              <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-palette-btn mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-palette-text text-sm sm:text-base mb-1">
                    Estimated Delivery
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Your order will be delivered within 3-5 business days
                  </p>
                </div>
              </div>
            </div> */}
          </div>

          {/* Order Summary - appears below form on mobile */}
          <div className="lg:order-2">
            <Card className="border border-gray-200 shadow-none lg:sticky lg:top-8">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-palette-text mb-4 sm:mb-6">
                  Order Summary
                </h2>

                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 max-h-40 sm:max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-start gap-2 text-xs sm:text-sm py-1.5 sm:py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-gray-800 truncate">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-gray-600 text-xs truncate">
                          {item.variant.size}-{item.variant.color}
                        </span>
                      </div>
                      <span className="text-palette-text font-medium whitespace-nowrap text-xs sm:text-sm">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-palette-text font-medium">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600 font-medium">
                        -${totalDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-600 text-[10px] sm:text-xs">
                      Calculated at payment
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-200">
                    <span className="text-palette-text font-semibold text-sm sm:text-base">
                      Estimated Total
                    </span>
                    <span className="text-palette-btn text-xl sm:text-2xl font-bold">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
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

        <div className="mt-4 sm:mt-6 lg:mt-8">
          <PathaoChargeTable />
        </div>
      </main>
    </div>
  );
}
