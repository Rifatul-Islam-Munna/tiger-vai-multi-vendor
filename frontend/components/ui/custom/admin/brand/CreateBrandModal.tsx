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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateBrandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateBrandModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateBrandModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    categories: [] as string[],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [openCombobox, setOpenCombobox] = useState(false);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-select"],
    queryFn: async () => {
      const res = await fetch("/api/category-brand/categories?limit=100");
      return res.json();
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Brand name is required");
      return;
    }

    setIsLoading(true);

    try {
      let logoUrl = "";

      if (imageFile) {
        const formDataWithImage = new FormData();
        formDataWithImage.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formDataWithImage,
        });
        const uploadData = await uploadRes.json();
        logoUrl = uploadData.url;
      }

      const response = await fetch("/api/category-brand/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          logoUrl,
          categories:
            formData.categories.length > 0 ? formData.categories : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create brand");
      }

      onOpenChange(false);
      setFormData({ name: "", categories: [] });
      setImagePreview(null);
      setImageFile(null);
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-palette-bg border-palette-accent-3">
        <DialogHeader>
          <DialogTitle className="text-palette-text">Create Brand</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-palette-text">Brand Logo</Label>
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

          {/* Brand Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-palette-text">
              Brand Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter brand name"
              required
              className="bg-palette-bg border-palette-accent-3 text-palette-text placeholder:text-palette-accent-3"
            />
          </div>

          {/* Categories Combobox */}
          <div className="space-y-2">
            <Label className="text-palette-text">Categories (Optional)</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between bg-palette-bg border-palette-accent-3 text-palette-text hover:bg-palette-bg hover:text-palette-text"
                >
                  {formData.categories.length > 0
                    ? `${formData.categories.length} selected`
                    : "Select categories..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-palette-bg border-palette-accent-3">
                <Command className="bg-palette-bg">
                  <CommandInput
                    placeholder="Search categories..."
                    className="text-palette-text placeholder:text-palette-accent-3"
                  />
                  <CommandEmpty className="text-palette-accent-3">
                    No categories found.
                  </CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {categoriesData?.data?.map((category: any) => (
                        <CommandItem
                          key={category._id}
                          value={category._id}
                          onSelect={() => handleCategoryToggle(category._id)}
                          className="text-palette-text hover:bg-palette-btn/20"
                        >
                          <Checkbox
                            checked={formData.categories.includes(category._id)}
                            className="mr-2 border-palette-accent-3"
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected Categories Tags */}
            {formData.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.categories.map((catId) => {
                  const category = categoriesData?.data?.find(
                    (c: any) => c._id === catId
                  );
                  return (
                    <div
                      key={catId}
                      className="flex items-center gap-1 bg-palette-btn/20 text-palette-btn px-3 py-1 rounded-full text-sm"
                    >
                      {category?.name}
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(catId)}
                        className="hover:opacity-70"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
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
              {isLoading ? "Creating..." : "Create Brand"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
