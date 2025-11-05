// components/product/add-steps/StepBasicInfo.tsx
"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddProductStore } from "@/zustan-hook/addProductStore";

// Static categories and brands
const CATEGORIES = [
  { main: "MEN", subcategories: ["T-Shirts", "Shoes", "Jeans", "Accessories"] },
  { main: "WOMEN", subcategories: ["Dresses", "Tops", "Shoes", "Accessories"] },
  { main: "KIDS", subcategories: ["T-Shirts", "Shoes", "Pants"] },
];

const BRANDS = [
  { id: "brand1", name: "Nike" },
  { id: "brand2", name: "Adidas" },
  { id: "brand3", name: "Levi's" },
  { id: "brand4", name: "Zara" },
  { id: "brand5", name: "Fossil" },
  { id: "brand6", name: "H&M" },
];

export default function StepBasicInfo() {
  const { formData, updateField } = useAddProductStore();
  const [selectedMainCategory, setSelectedMainCategory] = React.useState(
    formData.category?.main || ""
  );

  const subcategories =
    CATEGORIES.find((cat) => cat.main === selectedMainCategory)
      ?.subcategories || [];

  const handleMainCategoryChange = (value: string) => {
    setSelectedMainCategory(value);
    updateField("category", {
      main: value,
      category: "",
    });
  };

  const handleCategoryChange = (value: string) => {
    updateField("category", {
      ...formData.category,
      category: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-palette-accent-1 ">
          Product Name *
        </label>
        <Input
          placeholder="Enter product name"
          value={formData.name || ""}
          onChange={(e) => updateField("name", e.target.value)}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "var(--palette-accent-3)",
            color: "var(--palette-text)",
          }}
        />
      </div>

      {/* Description */}
      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Description
        </label>
        <Textarea
          placeholder="Enter product description"
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          rows={4}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "var(--palette-accent-3)",
            color: "var(--palette-text)",
          }}
        />
      </div>

      {/* Main Category */}
      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Main Category *
        </label>
        <Select
          value={selectedMainCategory}
          onValueChange={handleMainCategoryChange}
        >
          <SelectTrigger
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "var(--palette-accent-3)",
              color: "var(--palette-text)",
            }}
          >
            <SelectValue placeholder="Select main category" />
          </SelectTrigger>
          <SelectContent
            style={{
              backgroundColor: "var(--palette-bg)",
              color: "var(--palette-text)",
            }}
          >
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.main} value={cat.main}>
                {cat.main}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sub Category */}
      {subcategories.length > 0 && (
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Sub Category *
          </label>
          <Select
            value={formData.category?.category || ""}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            >
              <SelectValue placeholder="Select sub category" />
            </SelectTrigger>
            <SelectContent
              style={{
                backgroundColor: "var(--palette-bg)",
                color: "var(--palette-text)",
              }}
            >
              {subcategories.map((subcat) => (
                <SelectItem key={subcat} value={subcat}>
                  {subcat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Brand */}
      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Brand *
        </label>
        <Select
          value={formData.brand?.id || ""}
          onValueChange={(value) => {
            const brand = BRANDS.find((b) => b.id === value);
            if (brand) {
              updateField("brand", { id: brand.id, name: brand.name });
            }
          }}
        >
          <SelectTrigger
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "var(--palette-accent-3)",
              color: "var(--palette-text)",
            }}
          >
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent
            style={{
              backgroundColor: "var(--palette-bg)",
              color: "var(--palette-text)",
            }}
          >
            {BRANDS.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
