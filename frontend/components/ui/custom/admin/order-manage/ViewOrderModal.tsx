// components/order/ViewOrderModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Package, Truck, DollarSign, User } from "lucide-react";

interface ViewOrderModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "rgba(239, 68, 68, 0.2)", text: "text-red-400" },
  CONFIRMED: { bg: "rgba(251, 191, 36, 0.2)", text: "text-yellow-400" },
  PROCESSING: { bg: "rgba(59, 130, 246, 0.2)", text: "text-blue-400" },
  SHIPPED: { bg: "rgba(147, 51, 234, 0.2)", text: "text-purple-400" },
  DELIVERED: { bg: "rgba(34, 197, 94, 0.2)", text: "text-green-400" },
  CANCELLED: { bg: "rgba(107, 114, 128, 0.2)", text: "text-gray-400" },
};

export const ViewOrderModal: React.FC<ViewOrderModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--palette-bg)",
          borderColor: "var(--palette-accent-3)",
          color: "var(--palette-text)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>Order {order._id}</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-500/20 rounded transition"
            >
              <X size={20} />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Order Status & Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                borderColor: "var(--palette-accent-3)",
                border: "1px solid",
              }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--palette-accent-3)" }}
              >
                Status
              </p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium inline-block mt-2 ${
                  STATUS_COLORS[order.orderStatus]?.text || ""
                }`}
                style={{
                  backgroundColor: STATUS_COLORS[order.orderStatus]?.bg,
                }}
              >
                {order.orderStatus}
              </span>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                borderColor: "var(--palette-accent-3)",
                border: "1px solid",
              }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--palette-accent-3)" }}
              >
                Order Total
              </p>
              <p className="text-xl font-bold mt-2">৳{order.orderTotal}</p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                borderColor: "var(--palette-accent-3)",
                border: "1px solid",
              }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--palette-accent-3)" }}
              >
                Items
              </p>
              <p className="text-xl font-bold mt-2">{order.products.length}</p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                borderColor: "var(--palette-accent-3)",
                border: "1px solid",
              }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--palette-accent-3)" }}
              >
                Ordered
              </p>
              <p className="text-sm font-medium mt-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderColor: "var(--palette-accent-3)",
              border: "1px solid",
            }}
          >
            <h3
              className="font-semibold mb-3 flex items-center gap-2"
              style={{ color: "var(--palette-accent-1)" }}
            >
              <User size={18} />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span style={{ color: "var(--palette-accent-3)" }}>Name:</span>
                <p className="font-medium">{order.shipment.name}</p>
              </div>
              <div>
                <span style={{ color: "var(--palette-accent-3)" }}>Phone:</span>
                <p className="font-medium">{order.shipment.phone}</p>
              </div>
              <div className="col-span-2">
                <span style={{ color: "var(--palette-accent-3)" }}>
                  Address:
                </span>
                <p className="font-medium">{order.shipment.house}</p>
              </div>
              <div>
                <span style={{ color: "var(--palette-accent-3)" }}>
                  Payment:
                </span>
                <p className="font-medium">{order.shipment.paymentMethod}</p>
              </div>
              {order.shipment.comment && (
                <div className="col-span-2">
                  <span style={{ color: "var(--palette-accent-3)" }}>
                    Notes:
                  </span>
                  <p className="font-medium italic">{order.shipment.comment}</p>
                </div>
              )}
            </div>
          </div>

          {/* Products */}
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderColor: "var(--palette-accent-3)",
              border: "1px solid",
            }}
          >
            <h3
              className="font-semibold mb-3 flex items-center gap-2"
              style={{ color: "var(--palette-accent-1)" }}
            >
              <Package size={18} />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.products.map((product: any, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderColor: "var(--palette-accent-3)",
                    border: "1px solid",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--palette-accent-3)" }}
                      >
                        {product.variant.size} - {product.variant.color} ×{" "}
                        {product.quantity}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--palette-accent-3)" }}
                      >
                        {product.brandName} | By: {product.vendorId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">৳{product.totalPrice}</p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--palette-accent-3)" }}
                      >
                        ৳{product.unitPrice} each
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderColor: "var(--palette-accent-3)",
              border: "1px solid",
            }}
          >
            <h3
              className="font-semibold mb-3 flex items-center gap-2"
              style={{ color: "var(--palette-accent-1)" }}
            >
              <DollarSign size={18} />
              Payment Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--palette-accent-3)" }}>
                  Subtotal:
                </span>
                <span>৳{order.orderTotal + order.totalDiscount}</span>
              </div>
              {order.totalDiscount > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--palette-accent-3)" }}>
                    Discount:
                  </span>
                  <span style={{ color: "var(--palette-btn)" }}>
                    -৳{order.totalDiscount}
                  </span>
                </div>
              )}
              <div
                className="flex justify-between border-t pt-2 font-semibold"
                style={{ borderColor: "var(--palette-accent-3)" }}
              >
                <span>Total:</span>
                <span>৳{order.orderTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
