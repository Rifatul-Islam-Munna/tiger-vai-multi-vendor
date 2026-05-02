"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MobileFilterSheet } from "./MobileFilterSheet";

interface SortBarProps {
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  totalProducts: number;
  mobileFilterProps?: ComponentProps<typeof MobileFilterSheet>;
  subCategoryBadges?: ReactNode;
}

export function SortBar({
  sortBy,
  sortOrder,
  onSortChange,
  totalProducts,
  mobileFilterProps,
  subCategoryBadges,
}: SortBarProps) {
  const currentValue = sortBy && sortOrder ? `${sortBy}-${sortOrder}` : null;

  return (
    <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between gap-4">
        <p className="hidden md:block text-sm text-gray-600 shrink-0">
          <span className="font-medium text-palette-text">{totalProducts}</span>{" "}
          products found
        </p>

        {subCategoryBadges && (
          <div className="hidden md:block min-w-0 flex-1">
            {subCategoryBadges}
          </div>
        )}

        <div className="flex items-center gap-3 shrink-0">
          <div className="block lg:hidden">
            {mobileFilterProps && <MobileFilterSheet {...mobileFilterProps} />}
          </div>

          <Select
            value={currentValue ?? undefined}
            onValueChange={(v) => {
              const [newSortBy, newSortOrder] = v.split("-");
              onSortChange(newSortBy, newSortOrder);
            }}
          >
            <SelectTrigger className="w-[160px] sm:w-[180px] border-gray-200">
              <SelectValue placeholder="Select a value" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
              <SelectItem value="stock-desc">Most Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {subCategoryBadges && (
        <div className="mt-3 md:hidden">{subCategoryBadges}</div>
      )}
    </div>
  );
}
