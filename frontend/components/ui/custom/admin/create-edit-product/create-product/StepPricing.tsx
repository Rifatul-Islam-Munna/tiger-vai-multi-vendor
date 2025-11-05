// components/product/add-steps/StepPricing.tsx
"use client";

import React from "react";

import { AlertCircle } from "lucide-react";
import { useAddProductStore } from "@/zustan-hook/addProductStore";
import {
  calculateAverageOfferPrice,
  calculateAveragePrice,
  calculateTotalStock,
} from "@/lib/calculation-helper";

export default function StepPricing() {
  const { formData } = useAddProductStore();
  const variants = (formData.variants as any[]) || [];

  const avgPrice = variants.length > 0 ? calculateAveragePrice(variants) : 0;
  const avgOfferPrice =
    variants.length > 0 ? calculateAverageOfferPrice(variants) : null;
  const totalStock = variants.length > 0 ? calculateTotalStock(variants) : 0;

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <div
        className="p-4 rounded-lg flex gap-3"
        style={{
          backgroundColor: "rgba(168, 179, 191, 0.1)",
          borderColor: "var(--palette-accent-3)",
          border: "1px solid",
        }}
      >
        <AlertCircle size={20} style={{ color: "var(--palette-accent-3)" }} />
        <div className="text-sm">
          <p className="font-semibold">Prices are Auto-Calculated</p>
          <p style={{ color: "var(--palette-accent-3)" }}>
            Regular Price and Offer Price will be automatically calculated from
            the variants you added. You cannot edit them directly.
          </p>
        </div>
      </div>

      {/* Regular Price (Auto) */}
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          borderColor: "var(--palette-accent-3)",
          border: "1px solid",
        }}
      >
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Average Regular Price (৳)
        </label>
        <div
          className="text-3xl font-bold p-3 rounded"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "var(--palette-text)",
          }}
        >
          {variants.length > 0 ? avgPrice : "—"}
        </div>
        <p
          className="text-xs mt-2"
          style={{ color: "var(--palette-accent-3)" }}
        >
          {variants.length > 0
            ? `Calculated from ${variants.length} variant(s): (${variants
                .map((v) => v.price)
                .join(" + ")}) / ${variants.length}`
            : "Add variants to see the auto-calculated price"}
        </p>
      </div>

      {/* Total Stock (Auto) */}
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          borderColor: "var(--palette-accent-3)",
          border: "1px solid",
        }}
      >
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Total Stock (৳)
        </label>
        <div
          className="text-3xl font-bold p-3 rounded"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "var(--palette-text)",
          }}
        >
          {variants.length > 0 ? totalStock : "—"}
        </div>
        <p
          className="text-xs mt-2"
          style={{ color: "var(--palette-accent-3)" }}
        >
          {variants.length > 0
            ? `Sum of all variants: ${variants.map((v) => v.stock).join(" + ")}`
            : "Add variants to see the total stock"}
        </p>
      </div>

      {/* Offer Price (Auto) - Only if variants have discounts */}
      {variants.some((v) => v.discountPrice) && (
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "rgba(240, 212, 168, 0.1)",
            borderColor: "var(--palette-accent-1)",
            border: "1px solid",
          }}
        >
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Average Offer Price (৳)
          </label>
          <div
            className="text-3xl font-bold p-3 rounded"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "var(--palette-btn)",
            }}
          >
            {avgOfferPrice}
          </div>
          <p
            className="text-xs mt-2"
            style={{ color: "var(--palette-accent-3)" }}
          >
            Calculated from {variants.filter((v) => v.discountPrice).length}{" "}
            variant(s) with discount
          </p>
        </div>
      )}

      {/* Shipping Settings */}
      <div className="space-y-4">
        <h3
          className="font-semibold"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Shipping Settings
        </h3>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--palette-accent-3)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--palette-text)" }}>
            Shipping settings are optional and will be configured in the next
            steps.
          </p>
        </div>
      </div>
    </div>
  );
}
