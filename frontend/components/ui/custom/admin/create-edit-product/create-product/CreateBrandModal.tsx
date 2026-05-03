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
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { useUploadSingleImage } from "@/lib/useHandelImageUpload";
import { toast } from "sonner";
import { postBrand } from "@/actions/brand-category";

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
  const [name, setName] = useState("");
  const [isTop, setIsTop] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadImage, isPending: isUploading } =
    useUploadSingleImage();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    uploadImage(formData, {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error.message);
        } else {
          setImagePreview(data?.data?.url as string);
        }
      },
    });
  };

  const { mutate: createBrand, isPending: isLoading } = useMutation({
    mutationFn: (data: Record<string, unknown>) => postBrand(data),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message);
      } else {
        toast.success("Brand created successfully");
        onOpenChange(false);
        onSuccess?.();
        setName("");
        setIsTop(false);
        setImagePreview(null);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create brand");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    createBrand({
      name: name.trim(),
      logoUrl: imagePreview,
      isTop,
      categories: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-palette-bg border-palette-accent-3">
        <DialogHeader>
          <DialogTitle className="text-palette-text">Create Brand</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-palette-text">Brand Logo</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-palette-accent-3 rounded-lg p-6 text-center cursor-pointer hover:border-palette-btn transition"
            >
              {imagePreview ? (
                <div className="relative w-20 h-20 mx-auto">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : isUploading ? (
                <Loader2 className="animate-spin mx-auto" />
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
            <Label htmlFor="brand-name" className="text-palette-text">
              Brand Name *
            </Label>
            <Input
              id="brand-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter brand name"
              required
              className="bg-palette-bg border-palette-accent-3 text-palette-text placeholder:text-palette-accent-3"
            />
          </div>

          {/* Is Top Brand */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isTop"
              checked={isTop}
              onCheckedChange={(checked) => setIsTop(checked as boolean)}
              className="border-palette-accent-3"
            />
            <Label htmlFor="isTop" className="text-palette-text cursor-pointer">
              Mark as top brand
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-palette-accent-3 text-palette-text"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="bg-palette-btn text-white"
            >
              {isLoading ? "Creating..." : "Create Brand"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
