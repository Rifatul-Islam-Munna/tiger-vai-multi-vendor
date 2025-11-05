// components/order/UpdateOrderStatusModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, CheckCircle } from "lucide-react";

interface UpdateOrderStatusModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (newStatus: string) => void;
  nextStatuses: string[];
}

const STATUS_INFO: Record<
  string,
  { icon: string; description: string; color: string }
> = {
  PENDING: {
    icon: "⏳",
    description: "Order placed, awaiting confirmation",
    color: "rgba(239, 68, 68, 0.2)",
  },
  CONFIRMED: {
    icon: "✅",
    description: "Order confirmed by admin",
    color: "rgba(251, 191, 36, 0.2)",
  },
  PROCESSING: {
    icon: "⚙️",
    description: "Order is being prepared for shipment",
    color: "rgba(59, 130, 246, 0.2)",
  },
  SHIPPED: {
    icon: "📦",
    description: "Order has been shipped",
    color: "rgba(147, 51, 234, 0.2)",
  },
  DELIVERED: {
    icon: "🎉",
    description: "Order delivered to customer",
    color: "rgba(34, 197, 94, 0.2)",
  },
  CANCELLED: {
    icon: "❌",
    description: "Order has been cancelled",
    color: "rgba(107, 114, 128, 0.2)",
  },
};

export const UpdateOrderStatusModal: React.FC<UpdateOrderStatusModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
  nextStatuses,
}) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl"
        style={{
          backgroundColor: "var(--palette-bg)",
          borderColor: "var(--palette-accent-3)",
          color: "var(--palette-text)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>Update Order Status</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-500/20 rounded transition"
            >
              <X size={20} />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Current Status */}
          <div>
            <h3
              className="font-semibold mb-3"
              style={{ color: "var(--palette-accent-1)" }}
            >
              Current Status
            </h3>
            <div
              className="p-4 rounded-lg flex items-center gap-3"
              style={{
                backgroundColor: STATUS_INFO[order.orderStatus].color,
                borderColor: "var(--palette-accent-3)",
                border: "1px solid",
              }}
            >
              <span className="text-3xl">
                {STATUS_INFO[order.orderStatus].icon}
              </span>
              <div>
                <p className="font-semibold text-lg">{order.orderStatus}</p>
                <p
                  className="text-sm"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  {STATUS_INFO[order.orderStatus].description}
                </p>
              </div>
            </div>
          </div>

          {/* Next Status Options */}
          {nextStatuses.length > 0 ? (
            <div>
              <h3
                className="font-semibold mb-3"
                style={{ color: "var(--palette-accent-1)" }}
              >
                Update To
              </h3>
              <div className="space-y-2">
                {nextStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusUpdate(status);
                    }}
                    className="w-full p-4 rounded-lg text-left hover:opacity-80 transition flex items-center gap-3"
                    style={{
                      backgroundColor: STATUS_INFO[status].color,
                      borderColor: "var(--palette-accent-3)",
                      border: "1px solid",
                    }}
                  >
                    <span className="text-2xl">{STATUS_INFO[status].icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{status}</p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--palette-accent-3)" }}
                      >
                        {STATUS_INFO[status].description}
                      </p>
                    </div>
                    <CheckCircle
                      size={20}
                      style={{ color: "var(--palette-btn)" }}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="p-4 rounded-lg text-center"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                borderColor: "rgb(34, 197, 94)",
                border: "1px solid",
              }}
            >
              <p className="text-green-400 font-semibold">✓ Order Complete</p>
              <p className="text-sm mt-1">
                No further status updates available
              </p>
            </div>
          )}

          {/* Info */}
          <div
            className="p-4 rounded-lg text-sm"
            style={{
              backgroundColor: "rgba(168, 179, 191, 0.1)",
              borderColor: "var(--palette-accent-3)",
              border: "1px solid",
            }}
          >
            <p style={{ color: "var(--palette-accent-3)" }}>
              💡 Tip: Status updates are sequential. You can only move to the
              next valid status.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            style={{ borderColor: "var(--palette-accent-3)" }}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
