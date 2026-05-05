// components/product/add-steps/StepBasicInfo.tsx
"use client";

import React, { useState } from "react";

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
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { BrandResponse, CategoryResponse } from "@/@types/category-brand";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import RichTextEditor from "../../../addProduct/Description";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { CreateCategoryModal } from "@/components/ui/custom/admin/category/CreateCategoryModal";
import { EditCategoryModal } from "@/components/ui/custom/admin/category/EditCategoryModal";
import { CreateBrandModal } from "./CreateBrandModal";

interface CategoryItem {
  _id: string;
  name: string;
  logoUrl?: string;
  sub: { SubMain: string; subCategory: string[] }[];
  isTop?: boolean;
}

export default function StepBasicInfo() {
  const { formData, updateField } = useAddProductStore();
  const [selectedMainCategory, setSelectedMainCategory] = React.useState(
    formData.category?.main || ""
  );
  const [isBrandInputMode, setIsBrandInputMode] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateBrandOpen, setIsCreateBrandOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const { data: brandsData, refetch: refetchBrands } = useQueryWrapper<BrandResponse>(
    ["brands"],
    `/brand?page=1&limit=50`
  );

  const { data: categoriesData, refetch: refetchCategories } = useQueryWrapper<CategoryResponse>(
    ["categories"],
    `/category?page=1&limit=50`
  );

  React.useEffect(() => {
    setSelectedMainCategory(formData.category?.main || "");
  }, [formData.category?.main]);

  const handleMainCategoryChange = (value: string) => {
    setSelectedMainCategory(value);
    updateField("category", {
      main: value,
      subMain: "",
      category: "",
    });
  };

  const handleCategoryChange = (value: string) => {
    updateField("category", {
      ...formData.category,
      category: value,
    });
  };
  const handleSubCategoryChange = (value: string) => {
    updateField("category", {
      ...formData.category,
      subMain: value,
      category: "",
    });
  };

  const findOneSub = categoriesData?.data?.find(
    (item) => item?.name === formData.category?.main
  );
  const findOneSubCategory = findOneSub?.sub?.find(
    (item) => item?.SubMain === formData.category?.subMain
  );

  const handleCategorySuccess = () => {
    refetchCategories();
    setEditingCategory(null);
    setIsCreateCategoryOpen(false);
  };

  const handleBrandSuccess = () => {
    refetchBrands();
    setIsCreateBrandOpen(false);
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

      {/* Short Description */}
      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Short Description
        </label>

        <Textarea
          placeholder="Enter product short description"
          value={formData.shortDescription || ""}
          onChange={(e) => updateField("shortDescription", e.target.value)}
          rows={4}
          style={{}}
        />
      </div>

      {/* Special Offer */}
      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Special Offer
        </label>

        <Textarea
          placeholder="Enter special offer "
          value={formData.special_offer || ""}
          onChange={(e) => updateField("special_offer", e.target.value)}
          rows={4}
          style={{}}
        />
      </div>

      {/* Product Details (formerly Description) */}
      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Product Details
        </label>
        <RichTextEditor
          description={formData.description || ""}
          updateField={updateField}
        />
      </div>

      {/* Company Details */}
      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Company Details
        </label>

        <Textarea
          placeholder="Company details"
          value={formData.company_details || ""}
          onChange={(e) => updateField("company_details", e.target.value)}
          rows={4}
          style={{}}
        />
      </div>

      {/* Main Category */}
      <div>
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label
            className="block text-sm font-semibold"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Main Category *
          </label>
          <div className="flex flex-wrap gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => setIsCreateCategoryOpen(true)}
            >
              <Plus size={12} className="mr-1" /> Add
            </Button>
            {selectedMainCategory && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={() => {
                  const cat = categoriesData?.data?.find(c => c.name === selectedMainCategory);
                  if (cat) setEditingCategory(cat as CategoryItem);
                }}
              >
                <Pencil size={12} className="mr-1" /> Edit
              </Button>
            )}
          </div>
        </div>
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
            {categoriesData?.data?.map((cat) => (
              <SelectItem key={cat.name} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sub main */}
      {(findOneSub?.sub.length ?? 0) > 0 && (
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Sub Group *
          </label>
          <Select
            value={formData.category?.subMain || ""}
            onValueChange={handleSubCategoryChange}
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
              {findOneSub?.sub?.map((subcat) => (
                <SelectItem key={subcat.SubMain} value={subcat.SubMain}>
                  {subcat.SubMain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Sub Category */}
      {(findOneSubCategory?.subCategory?.length ?? 0) > 0 && (
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
              {findOneSubCategory?.subCategory?.map((subcat) => (
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
        {/* Toggle Switch */}
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <Switch
              id="brand-mode"
              checked={isBrandInputMode}
              onCheckedChange={setIsBrandInputMode}
            />
            <Label
              htmlFor="brand-mode"
              className="text-sm"
              style={{ color: "var(--palette-text)" }}
            >
              {isBrandInputMode ? "Custom Brand Name" : "Select from Existing"}
            </Label>
          </div>
          {!isBrandInputMode && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-fit text-xs px-2"
              onClick={() => setIsCreateBrandOpen(true)}
            >
              <Plus size={12} className="mr-1" /> Add Brand
            </Button>
          )}
        </div>

        {/* Brand Field Label */}
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Brand *
        </label>

        {/* Conditional Rendering: Dropdown or Input */}
        {!isBrandInputMode ? (
          <Select
            value={formData.brand?.id || ""}
            onValueChange={(value) => {
              const brand = brandsData?.data?.find((b) => b._id === value);
              if (brand) {
                updateField("brand", { id: brand._id, name: brand.name });
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
              {brandsData?.data?.map((brand) => (
                <SelectItem key={brand._id} value={brand._id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="text"
            placeholder="Enter custom brand name"
            value={formData.brand?.name || ""}
            onChange={(e) => {
              updateField("brand", { id: "", name: e.target.value });
            }}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "var(--palette-accent-3)",
              color: "var(--palette-text)",
            }}
            className="w-full"
          />
        )}
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        open={isCreateCategoryOpen}
        onOpenChange={setIsCreateCategoryOpen}
        onSuccess={handleCategorySuccess}
      />

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={() => setEditingCategory(null)}
          onSuccess={handleCategorySuccess}
        />
      )}

      {/* Create Brand Modal */}
      <CreateBrandModal
        open={isCreateBrandOpen}
        onOpenChange={setIsCreateBrandOpen}
        onSuccess={handleBrandSuccess}
      />
    </div>
  );
}
