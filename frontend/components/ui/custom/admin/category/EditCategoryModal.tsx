"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { updateCategory, uploadCategory } from "@/actions/brand-category";

interface Category {
  _id: string;
  name: string;
  logoUrl?: string;
  subCategory: string[];
}

interface EditCategoryModalProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditCategoryModal({
  category,
  open,
  onOpenChange,
  onSuccess,
}: EditCategoryModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    category.logoUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: category.name,
    subCategory: category.subCategory,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [subCategoryInput, setSubCategoryInput] = useState("");

  const { mutate: uploadImage, isPending: IsImageUploadPending } = useMutation({
    mutationKey: ["upload-brand-image"],
    mutationFn: (formData: FormData) => uploadCategory(formData),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message);
      }
      setImagePreview(data?.data?.url as string);
      console.log(data);
    },
    onError: (error) => {
      toast.error(error.message || "unknown error");
    },
  });
  const { mutate, isPending: isLoading } = useMutation({
    mutationKey: ["update-brand"],
    mutationFn: (payload: any) => updateCategory(category._id, payload),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message);
      }
      onSuccess?.();
      toast.success("Category updated successfully");
      console.log(data);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "unknown error");
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    uploadImage(formData);

    /*   if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } */
  };

  const addSubCategory = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && subCategoryInput.trim()) {
      e.preventDefault();
      const newSubCategory = subCategoryInput.trim();
      if (!formData.subCategory.includes(newSubCategory)) {
        setFormData({
          ...formData,
          subCategory: [...formData.subCategory, newSubCategory],
        });
      }
      setSubCategoryInput("");
    }
  };

  const removeSubCategory = (index: number) => {
    setFormData({
      ...formData,
      subCategory: formData.subCategory.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (formData.subCategory.length === 0) {
      toast.error("At least one subcategory is required");
      return;
    }
    mutate({
      name: formData.name,
      subCategory: formData.subCategory,
      logoUrl: imagePreview,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-palette-bg border-palette-accent-3">
        <DialogHeader>
          <DialogTitle className="text-palette-text">Edit Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-palette-text">Category Logo</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-palette-accent-3 rounded-lg p-6 text-center cursor-pointer hover:border-palette-btn transition"
            >
              {imagePreview ? (
                <div className="relative w-24 h-24 mx-auto">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : IsImageUploadPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <div className="text-palette-accent-3">
                  <p className="font-medium">Click to upload logo</p>
                  <p className="text-sm">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-palette-text">
              Category Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter category name"
              required
              className="bg-palette-bg border-palette-accent-3 text-palette-text placeholder:text-palette-accent-3"
            />
          </div>

          {/* Subcategories */}
          <div className="space-y-2">
            <Label htmlFor="subcategory" className="text-palette-text">
              Subcategories * (Press Enter or Comma)
            </Label>
            <Input
              id="subcategory"
              value={subCategoryInput}
              onChange={(e) => setSubCategoryInput(e.target.value)}
              onKeyDown={addSubCategory}
              placeholder="Type subcategory and press Enter"
              className="bg-palette-bg border-palette-accent-3 text-palette-text placeholder:text-palette-accent-3"
            />
            {formData.subCategory.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {formData.subCategory.map((sub, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-palette-accent-2/20 text-palette-text px-3 py-1.5 rounded-full text-sm"
                  >
                    {sub}
                    <button
                      type="button"
                      onClick={() => removeSubCategory(index)}
                      className="hover:opacity-70 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-palette-accent-3 text-palette-text hover:bg-palette-accent-3/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-palette-btn text-white hover:opacity-90"
            >
              {isLoading ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
