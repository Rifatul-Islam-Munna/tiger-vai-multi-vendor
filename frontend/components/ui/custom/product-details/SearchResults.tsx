"use client";

import {
  useQueryStates,
  parseAsString,
  parseAsInteger,
  parseAsBoolean,
} from "nuqs";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";
import { SortBar } from "./SortBar";
import { ProductCard } from "../navbar/common/CommonCard";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useMemo, useState } from "react";
import { Category } from "@/@types/category-brand";
import { ProductItem, ProductResponse } from "@/@types/seach-product-type";
import { Product as ShortProduct } from "@/@types/short-product";

interface SearchClientProps {
  data: ProductResponse;
  categories?: Category[];
}

export function SearchClient({ data, categories = [] }: SearchClientProps) {
  const [filters, setFilters] = useQueryStates(
    {
      q: parseAsString,
      category: parseAsString,
      subMain: parseAsString,
      brandName: parseAsString,
      main: parseAsString,
      hasOffer: parseAsBoolean,
      minPrice: parseAsInteger.withDefault(0),
      maxPrice: parseAsInteger.withDefault(100000),
      minRating: parseAsInteger.withDefault(0),
      maxRating: parseAsInteger.withDefault(5),
      sortBy: parseAsString,
      sortOrder: parseAsString,
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(20),
    },
    {
      history: "push",
      shallow: false,
    }
  );
  const [localChanges, setLocalChanges] = useState({
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minRating: filters.minRating,
    maxRating: filters.maxRating,
  });

  const handleReset = () => {
    setFilters({
      q: null,
      category: null,
      subMain: null,
      brandName: null,
      main: null,
      hasOffer: null,
      minPrice: 0,
      maxPrice: 100000,
      minRating: 0,
      maxRating: 5,
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
    });
  };

  const debouncedUpdateFilters = useDebouncedCallback(() => {
    setFilters({
      minPrice: localChanges.minPrice,
      maxPrice: localChanges.maxPrice,
      minRating: localChanges.minRating,
      maxRating: localChanges.maxRating,
      page: 1,
    });
  }, 600);
  useEffect(() => {
    debouncedUpdateFilters();
  }, [localChanges, debouncedUpdateFilters]);

  const activeCategoryGroup = useMemo(() => {
    if (!categories.length) return null;

    return (
      categories.find((category) => category.name === filters.main) ||
      categories.find((category) =>
        category.sub?.some(
          (sub) =>
            sub.SubMain === filters.subMain ||
            sub.subCategory?.includes(filters.category || "")
        )
      ) ||
      null
    );
  }, [categories, filters.category, filters.main, filters.subMain]);

  const categoryFacetCounts = data.facets?.category;
  const relatedSubcategories = useMemo(() => {
    if (!activeCategoryGroup) return [];

    const seen = new Set<string>();
    return activeCategoryGroup.sub.flatMap((sub) =>
      sub.subCategory
        .filter((category) => {
          if (seen.has(category)) return false;
          seen.add(category);
          return true;
        })
        .map((category) => ({
          name: category,
          subMain: sub.SubMain,
          count: categoryFacetCounts?.[category],
        }))
    );
  }, [activeCategoryGroup, categoryFacetCounts]);

  const subCategoryBadges =
    activeCategoryGroup && relatedSubcategories.length > 0 ? (
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          type="button"
          onClick={() =>
            setFilters({
              main: activeCategoryGroup.name,
              subMain: null,
              category: null,
              page: 1,
            })
          }
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            !filters.category
              ? "border-palette-btn bg-palette-btn text-white"
              : "border-gray-200 bg-white text-palette-text hover:border-palette-btn"
          }`}
        >
          All {activeCategoryGroup.name}
        </button>
        {relatedSubcategories.map((item) => {
          const isActive = filters.category === item.name;

          return (
            <button
              key={item.name}
              type="button"
              aria-pressed={isActive}
              onClick={() =>
                setFilters({
                  main: activeCategoryGroup.name,
                  subMain: item.subMain,
                  category: item.name,
                  page: 1,
                })
              }
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "border-palette-btn bg-palette-btn text-white"
                  : "border-gray-200 bg-white text-palette-text hover:border-palette-btn"
              }`}
            >
              {item.name}
              {typeof item.count === "number" && item.count > 0 && (
                <span className="ml-1 opacity-80">({item.count})</span>
              )}
            </button>
          );
        })}
      </div>
    ) : null;

  const filterProps = {
    facets: data.facets,
    selectedBrand: filters.brandName,
    selectedCategory: filters.category,
    selectedMain: filters.main,
    hasOffer: filters.hasOffer,
    priceRange: [localChanges.minPrice, localChanges.maxPrice] as [
      number,
      number
    ],
    ratingRange: [localChanges.minRating, localChanges.maxRating] as [
      number,
      number
    ],
    onBrandChange: (brandName: string | null) =>
      setFilters({ brandName, page: 1 }),
    onCategoryChange: (category: string | null) =>
      setFilters({ category, page: 1 }),
    onMainChange: (main: string | null) => setFilters({ main, page: 1 }),
    onHasOfferChange: (hasOffer: boolean | null) =>
      setFilters({ hasOffer, page: 1 }),
    onPriceRangeChange: ([minPrice, maxPrice]: [number, number]) =>
      setLocalChanges({
        minPrice,
        maxPrice,
        minRating: filters.minRating,
        maxRating: filters.maxRating,
      }),

    onRatingRangeChange: ([minRating, maxRating]: [number, number]) =>
      setLocalChanges({
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating,
        maxRating,
      }),
    onReset: handleReset,
  };

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-4 bg-white rounded-lg p-6 border border-gray-200">
          <FilterSidebar {...filterProps} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <SortBar
          sortBy={filters.sortBy || "createdAt"}
          sortOrder={filters.sortOrder || "desc"}
          onSortChange={(sortBy, sortOrder) => {
            setFilters({ sortBy, sortOrder });
          }}
          totalProducts={data.total}
          mobileFilterProps={filterProps}
          subCategoryBadges={subCategoryBadges}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          {data.items.map((product: ProductItem) => (
            <ProductCard
              key={product.id}
              product={{
                _id: product.id,
                name: product.name,
                thumbnail: product.thumbnail,
                main: product.main,
                category: product.category,
                subMain: product.subMain,
                price: product.price,
                offerPrice: product.offerPrice,
                hasOffer: product.hasOffer,
                isDigital: product.isDigital,
                brandId: product.brandId,
                brandName: product.brandName,
                slug: product.slug,
                isAdminCreated: product.isAdminCreated,
                stock: product.stock,
                hotDeals: false,
                hotOffer: false,
                productOfTheDay: false,
                vendorId: "",
                variants: [],
                createdAt: product.createdAt,
                updatedAt: product.createdAt,
                __v: 0,
                // ✅ Add price range fields
                minPrice: product.minPrice ?? product.offerPrice ?? product.price ?? 0,
                maxPrice: product.maxPrice ?? product.offerPrice ?? product.price ?? 0,
                minOriginalPrice: product.minOriginalPrice ?? product.price ?? 0,
                maxOriginalPrice: product.maxOriginalPrice ?? product.price ?? 0,
              } satisfies ShortProduct}
            />
          ))}
        </div>

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ page: filters.page - 1 })}
              disabled={!data.pagination.hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from(
              { length: data.pagination.totalPages },
              (_, i) => i + 1
            ).map((p) => (
              <Button
                key={p}
                variant={p === filters.page ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters({ page: p })}
                className={p === filters.page ? "bg-palette-btn" : ""}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ page: filters.page + 1 })}
              disabled={!data.pagination.hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
