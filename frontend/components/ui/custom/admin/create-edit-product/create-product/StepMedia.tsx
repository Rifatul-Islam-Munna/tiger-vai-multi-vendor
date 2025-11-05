// components/product/add-steps/StepMedia.tsx
"use client";

import React from "react";

import { ImageUploadField } from "../ImageUploadField";
import { useAddProductStore } from "@/zustan-hook/addProductStore";

export default function StepMedia() {
  const { formData, updateField } = useAddProductStore();

  const handleThumbnailSelected = (
    images: Array<{ url: string; key: string; id: string }>
  ) => {
    if (images.length > 0) {
      updateField("thumbnail", images[0]);
    }
  };

  const handleImagesSelected = (
    images: Array<{ url: string; key: string; id: string }>
  ) => {
    updateField("images", images);
  };

  return (
    <div className="space-y-6">
      {/* Thumbnail */}
      <ImageUploadField
        label="Product Thumbnail *"
        isThumbnail={true}
        maxFiles={1}
        onImagesSelected={handleThumbnailSelected}
      />

      {formData.thumbnail && (
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: "var(--palette-btn)/20",
            borderColor: "var(--palette-btn)",
            border: "1px solid",
          }}
        >
          <p className="text-sm font-medium mb-2">Thumbnail Selected ✓</p>
          <img
            src={formData.thumbnail?.url || ""}
            alt="Thumbnail"
            className="w-24 h-24 object-cover rounded"
          />
        </div>
      )}

      {/* Product Images */}
      <ImageUploadField
        label="Product Images"
        isThumbnail={false}
        maxFiles={10}
        onImagesSelected={handleImagesSelected}
      />

      {formData.images && (formData.images as any[]).length > 0 && (
        <div>
          <p
            className="text-sm font-medium mb-3"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Uploaded Images ({(formData.images as any[]).length})
          </p>
          <div className="grid grid-cols-4 gap-3">
            {(formData.images as any[]).map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Product ${index}`}
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
