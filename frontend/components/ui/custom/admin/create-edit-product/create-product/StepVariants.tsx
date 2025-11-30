// components/product/add-steps/StepVariants.tsx
"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useAddProductStore } from "@/zustan-hook/addProductStore";

interface Variant {
  size: string;
  color: string;
  price: number;
  stock: number;
  discountPrice?: number;
  sku?: string;
  recommended?: string;
}

export default function StepVariants() {
  const { formData, updateField } = useAddProductStore();
  const [newVariant, setNewVariant] = useState<Variant>({
    size: "",
    color: "",
    price: 0,
    stock: 0,
  });

  const variants = (formData.variants as Variant[]) || [];

  const handleAddVariant = () => {
    if (
      !newVariant.size ||
      !newVariant.color ||
      newVariant.price <= 0 ||
      newVariant.stock < 0
    ) {
      alert("Please fill all required variant fields");
      return;
    }

    updateField("variants", [...variants, newVariant]);
    setNewVariant({ size: "", color: "", price: 0, stock: 0 });
  };

  const handleRemoveVariant = (index: number) => {
    updateField(
      "variants",
      variants.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      {/* Add Variant Form */}
      <div
        className="p-4 rounded-lg border"
        style={{
          borderColor: "var(--palette-accent-3)",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
        }}
      >
        <h3
          className="font-semibold mb-4"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Add New Variant
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Size
            </label>
            <Input
              placeholder="e.g., M, L, 42"
              value={newVariant.size}
              onChange={(e) =>
                setNewVariant({ ...newVariant, size: e.target.value })
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Color
            </label>
            <Input
              placeholder="e.g., Red, Blue"
              value={newVariant.color}
              onChange={(e) =>
                setNewVariant({ ...newVariant, color: e.target.value })
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Price
            </label>
            <Input
              type="number"
              placeholder="1000"
              value={newVariant.price > 0 ? newVariant.price : ""}
              onChange={(e) =>
                setNewVariant({
                  ...newVariant,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Stock
            </label>
            <Input
              type="number"
              placeholder="0"
              value={newVariant.stock > 0 ? newVariant.stock : ""}
              onChange={(e) =>
                setNewVariant({
                  ...newVariant,
                  stock: parseFloat(e.target.value) || 0,
                })
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Discount Price (Optional)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={
                (newVariant.discountPrice ?? 0) > 0
                  ? newVariant.discountPrice
                  : ""
              }
              onChange={(e) =>
                setNewVariant({
                  ...newVariant,
                  discountPrice: parseFloat(e.target.value) || undefined,
                })
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              SKU (Optional)
            </label>
            <Input
              placeholder="e.g., SKU-001"
              value={newVariant.sku || ""}
              onChange={(e) =>
                setNewVariant({ ...newVariant, sku: e.target.value })
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Recommended (Optional)
            </label>
            <Input
              placeholder="e.g., Use this variant"
              value={newVariant.recommended || ""}
              onChange={(e) =>
                setNewVariant({ ...newVariant, recommended: e.target.value })
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>
        </div>

        <Button
          onClick={handleAddVariant}
          className="flex items-center gap-2 text-white"
          style={{ backgroundColor: "var(--palette-btn)" }}
        >
          <Plus size={18} />
          Add Variant
        </Button>
      </div>

      {/* Variants List */}
      {variants.length > 0 && (
        <div>
          <h3
            className="font-semibold mb-3"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Added Variants ({variants.length})
          </h3>
          <div className="space-y-2">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 rounded-lg"
                style={{
                  borderColor: "var(--palette-accent-3)",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid",
                }}
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {variant.size} - {variant.color}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--palette-accent-3)" }}
                  >
                    ৳{variant.price}
                    {variant.discountPrice && ` → ৳${variant.discountPrice}`} |
                    Stock: {variant.stock}
                    {variant.sku && ` | SKU: ${variant.sku}`}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveVariant(index)}
                  className="p-2 hover:bg-red-500/20 rounded transition"
                >
                  <Trash2 size={18} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {variants.length === 0 && (
        <div
          className="text-center p-8 rounded-lg"
          style={{
            borderColor: "var(--palette-accent-3)",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "2px dashed",
          }}
        >
          <p style={{ color: "var(--palette-accent-3)" }}>
            No variants added yet. Add at least one variant for the product.
          </p>
        </div>
      )}
    </div>
  );
}
