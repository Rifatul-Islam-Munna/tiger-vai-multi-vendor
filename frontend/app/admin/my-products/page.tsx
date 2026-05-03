// app/dashboard/products/page.tsx
"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit2, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ViewProductModal } from "@/components/ui/custom/admin/create-edit-product/ViewProductModal";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { Product, ProductApiResponse } from "@/@types/short-product";
import { CategoryResponse } from "@/@types/category-brand";
import { CreateCategoryModal } from "@/components/ui/custom/admin/category/CreateCategoryModal";
import { EditCategoryModal } from "@/components/ui/custom/admin/category/EditCategoryModal";
import { ArrowLeft, Package, Layers, Tag, ShoppingCart, Star, Zap, Heart, Gift, BookOpen, Music, Camera, Coffee, Home, Car, Smartphone } from "lucide-react";

const CATEGORY_ICONS = [Package, Layers, Tag, ShoppingCart, Star, Zap, Heart, Gift, BookOpen, Music, Camera, Coffee, Home, Car, Smartphone];

const getRandomIcon = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CATEGORY_ICONS.length;
  return CATEGORY_ICONS[index];
};

const ICON_COLORS = [
  "#ee4a23", "#342f2c", "#c43d1d", "#ff8566", "#86929c",
  "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b",
  "#10b981", "#3b82f6", "#ef4444", "#f97316", "#06b6d4",
];

const getIconColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ICON_COLORS[Math.abs(hash) % ICON_COLORS.length];
};

interface CategoryItem {
  _id: string;
  name: string;
  logoUrl?: string;
  sub: {
    SubMain: string;
    subCategory: string[];
  }[];
  isTop?: boolean;
}

type CategoryViewLevel = "main" | "subGroup" | "subCategory";

export default function ProductManagementPage() {
  const searchParams = useSearchParams();
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedMain, setSelectedMain] = useState(
    searchParams.get("main") || ""
  );
  const [selectedSubMain, setSelectedSubMain] = useState(
    searchParams.get("subMain") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewLevel, setViewLevel] = useState<CategoryViewLevel>("main");
  const query = new URLSearchParams();
  query.set("page", page.toString());
  query.set("limit", limit.toString());
  query.set("sortBy", sortBy);
  query.set("sortOrder", sortOrder);
  if (selectedMain) query.set("main", selectedMain);
  if (selectedSubMain) query.set("subMain", selectedSubMain);
  if (selectedCategory) query.set("category", selectedCategory);

  const { data } = useQueryWrapper<ProductApiResponse>(
    [
      "products",
      page,
      limit,
      sortBy,
      sortOrder,
      selectedMain,
      selectedSubMain,
      selectedCategory,
    ],
    `/product/getProductVendorAdmin?${query.toString()}`,
    { enabled: !!selectedMain }
  );
  const { data: categoriesData, refetch: refetchCategories } =
    useQueryWrapper<CategoryResponse>(
    ["product-categories"],
    "/category?page=1&limit=100"
  );
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const selectedMainCategory = categoriesData?.data?.find(
    (category) => category.name === selectedMain
  );
  const selectedSubGroup = selectedMainCategory?.sub?.find(
    (item) => item.SubMain === selectedSubMain
  );
  const visibleCategories = selectedMainCategory
    ? [selectedMainCategory]
    : categoriesData?.data || [];
  const selectedLabel = [selectedMain, selectedSubMain, selectedCategory]
    .filter(Boolean)
    .join(" > ");
  const selectedQuery: Record<string, string> = {};
  if (selectedMain) selectedQuery.main = selectedMain;
  if (selectedSubMain) selectedQuery.subMain = selectedSubMain;
  if (selectedCategory) selectedQuery.category = selectedCategory;
  const selectedQueryString = new URLSearchParams(selectedQuery).toString();
  const categoryQuery = selectedQueryString ? `?${selectedQueryString}` : "";
  const addProductHref = selectedMain
    ? {
        pathname: "/admin/my-products/add-product",
        query: selectedQuery,
      }
    : "/admin/my-products/add-product";

  const clearCategorySelection = () => {
    setSelectedMain("");
    setSelectedSubMain("");
    setSelectedCategory("");
    setViewLevel("main");
    setPage(1);
  };

  const selectMainCategory = (value: string) => {
    setSelectedMain(value);
    setSelectedSubMain("");
    setSelectedCategory("");
    setViewLevel("subGroup");
    setPage(1);
  };

  const selectSubMain = (value: string) => {
    setSelectedSubMain(value);
    setSelectedCategory("");
    setViewLevel("subCategory");
    setPage(1);
  };

  const selectCategory = (value: string) => {
    setSelectedCategory(value);
    setViewLevel("subCategory");
    setPage(1);
  };

  const handleBack = () => {
    if (viewLevel === "subCategory") {
      setSelectedCategory("");
      setViewLevel("subGroup");
    } else if (viewLevel === "subGroup") {
      setSelectedSubMain("");
      setSelectedMain("");
      setViewLevel("main");
    }
    setPage(1);
  };

  const getBreadcrumbs = () => {
    const parts: string[] = [];
    if (selectedMain) parts.push(selectedMain);
    if (selectedSubMain) parts.push(selectedSubMain);
    if (selectedCategory) parts.push(selectedCategory);
    return parts.join(" > ");
  };

  const handleCategoryChangeSuccess = (
    category?: CategoryItem,
    action?: "update" | "delete"
  ) => {
    const previousName = editingCategory?.name;

    setEditingCategory(null);
    refetchCategories();

    if (action === "update" && category && selectedMain === previousName) {
      setSelectedMain(category.name);
      setPage(1);
    }

    if (action === "delete" && selectedMain === previousName) {
      clearCategorySelection();
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        color: "var(--palette-text)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-bold">Product & Category</h1>
          <Button
            onClick={() => setIsCreateCategoryOpen(true)}
            className="text-white"
            style={{ backgroundColor: "var(--palette-btn)" }}
          >
            Create Category
          </Button>
        </div>

        <div
          className="mb-6 rounded-lg border p-4"
          style={{
            backgroundColor: "var(--palette-bg)",
            borderColor: "var(--palette-accent-3)",
          }}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {viewLevel !== "main" && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm text-palette-btn hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}
              <h2 className="text-lg font-semibold">
                {viewLevel === "main" && "Categories"}
                {viewLevel === "subGroup" && `Sub Groups - ${selectedMain}`}
                {viewLevel === "subCategory" && `Categories - ${selectedSubMain}`}
              </h2>
            </div>
            {(viewLevel !== "main" || selectedMain) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCategorySelection}
              >
                Clear
              </Button>
            )}
          </div>

          {viewLevel === "main" && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {(categoriesData?.data || []).map((category) => (
                <div
                  key={category._id}
                  className="group relative flex flex-col items-center rounded-lg border border-gray-200 bg-white overflow-hidden hover:border-palette-btn hover:shadow-sm transition-all duration-200"
                >
                  <button
                    onClick={() => selectMainCategory(category.name)}
                    className="w-full flex flex-col items-center"
                  >
                    <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
                      {category.logoUrl ? (
                        <img
                          src={category.logoUrl}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-300">
                          {category.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="w-full px-1 py-1.5 text-center">
                      <p className="text-[10px] font-medium text-gray-700 truncate group-hover:text-palette-btn">
                        {category.name}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategory(category);
                    }}
                    className="absolute top-1 right-1 h-7 w-7 rounded-full bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                    title="Update Category"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {viewLevel === "subGroup" && selectedMainCategory && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {selectedMainCategory.sub.map((sub, index) => {
                const IconComponent = getRandomIcon(sub.SubMain);
                const iconColor = getIconColor(sub.SubMain);
                return (
                  <button
                    key={index}
                    onClick={() => selectSubMain(sub.SubMain)}
                    className={`group flex flex-col items-center rounded-lg border overflow-hidden hover:shadow-sm transition-all duration-200 h-20 ${
                      selectedSubMain === sub.SubMain
                        ? "border-palette-btn bg-palette-btn/5"
                        : "border-gray-200 bg-white hover:border-palette-btn"
                    }`}
                  >
                    <div className="w-full flex-1 flex items-center justify-center bg-gray-50">
                      <IconComponent size={20} style={{ color: iconColor }} />
                    </div>
                    <div className="w-full px-1 py-1 text-center">
                      <p className="text-[9px] font-medium text-gray-700 truncate group-hover:text-palette-btn">
                        {sub.SubMain}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {viewLevel === "subCategory" && selectedSubGroup && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {selectedSubGroup.subCategory.map((subCategory, index) => {
                const IconComponent = getRandomIcon(subCategory);
                const iconColor = getIconColor(subCategory);
                return (
                  <button
                    key={index}
                    onClick={() => selectCategory(subCategory)}
                    className={`group flex flex-col items-center rounded-lg border overflow-hidden hover:shadow-sm transition-all duration-200 h-20 ${
                      selectedCategory === subCategory
                        ? "border-palette-btn bg-palette-btn/5"
                        : "border-gray-200 bg-white hover:border-palette-btn"
                    }`}
                  >
                    <div className="w-full flex-1 flex items-center justify-center bg-gray-50">
                      <IconComponent size={20} style={{ color: iconColor }} />
                    </div>
                    <div className="w-full px-1 py-1 text-center">
                      <p className="text-[9px] font-medium text-gray-700 truncate group-hover:text-palette-btn">
                        {subCategory}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedMain ? (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold">
                {selectedLabel} Products
              </h2>
              <Link href={addProductHref}>
                <Button
                  className="flex items-center gap-2 text-white"
                  style={{ backgroundColor: "var(--palette-btn)" }}
                >
                  <Plus size={20} />
                  Add Product
                </Button>
              </Link>
            </div>

            <div className="flex gap-4 mb-6 items-center">
              <div className="flex-1">
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger
                    className="w-full"
                    style={{
                      borderColor: "var(--palette-accent-3)",
                      backgroundColor: "var(--palette-bg)",
                      color: "var(--palette-text)",
                    }}
                  >
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: "var(--palette-bg)",
                      color: "var(--palette-text)",
                    }}
                  >
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="name">Product Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="stock">Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  Order
                </label>
                <Select
                  value={sortOrder}
                  onValueChange={(value) =>
                    setSortOrder(value as "asc" | "desc")
                  }
                >
                  <SelectTrigger
                    className="w-full"
                    style={{
                      borderColor: "var(--palette-accent-3)",
                      backgroundColor: "var(--palette-bg)",
                      color: "var(--palette-text)",
                    }}
                  >
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: "var(--palette-bg)",
                      color: "var(--palette-text)",
                    }}
                  >
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  Per Page
                </label>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => setLimit(parseInt(value))}
                >
                  <SelectTrigger
                    className="w-full"
                    style={{
                      borderColor: "var(--palette-accent-3)",
                      backgroundColor: "var(--palette-bg)",
                      color: "var(--palette-text)",
                    }}
                  >
                    <SelectValue placeholder="Limit" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: "var(--palette-bg)",
                      color: "var(--palette-text)",
                    }}
                  >
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

        {/* Table */}
        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: "var(--palette-accent-3)" }}
        >
          <Table>
            <TableHeader style={{ backgroundColor: "var(--palette-btn)" }}>
              <TableRow>
                <TableHead className="text-white font-semibold">
                  Image
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Product Name
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Category
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Brand
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Price
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Stock
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((product) => (
                <TableRow
                  key={product._id}
                  style={{ borderColor: "var(--palette-accent-3)" }}
                  className="hover:bg-white/5 transition"
                >
                  <TableCell>
                    <img
                      src={product?.thumbnail}
                      alt={product?.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <span style={{ color: "var(--palette-accent-1)" }}>
                      {product?.main}
                    </span>{" "}
                    {" → "}
                    <span style={{ color: "var(--palette-accent-1)" }}>
                      {product?.subMain}
                    </span>
                    {" → "}
                    {product?.category}
                  </TableCell>
                  <TableCell>{product?.brandName}</TableCell>
                  <TableCell>
                    {product?.offerPrice ? (
                      <div className="flex flex-col">
                        <span
                          className="line-through text-sm"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          ৳{product?.price}
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: "var(--palette-btn)" }}
                        >
                          ৳{product?.offerPrice}
                        </span>
                      </div>
                    ) : (
                      <span>৳{product?.price}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={product.stock < 20 ? "text-red-400" : ""}>
                      {product?.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    {/*  <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span> */}
                    N/A
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="p-2 hover:bg-blue-500/20 rounded transition"
                        title="View Product"
                      >
                        <Eye
                          size={18}
                          style={{ color: "var(--palette-btn)" }}
                        />
                      </button>
                      <Link
                        href={`/admin/my-products/edit-product/${product.slug}${categoryQuery}`}
                      >
                        <button
                          className="p-2 hover:bg-yellow-500/20 rounded transition"
                          title="Edit Product"
                        >
                          <Edit2
                            size={18}
                            style={{ color: "var(--palette-accent-1)" }}
                          />
                        </button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div style={{ color: "var(--palette-accent-3)" }}>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)}{" "}
            of {total}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              variant="outline"
              style={{
                borderColor: "var(--palette-accent-3)",
                color:
                  page === 1
                    ? "var(--palette-accent-3)"
                    : "var(--palette-text)",
              }}
            >
              Previous
            </Button>
            <div
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: "var(--palette-btn)",
                color: "white",
              }}
            >
              Page {page} of {totalPages}
            </div>
            <Button
              onClick={() => setPage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              variant="outline"
              style={{
                borderColor: "var(--palette-accent-3)",
                color:
                  page === totalPages
                    ? "var(--palette-accent-3)"
                    : "var(--palette-text)",
              }}
            >
              Next
            </Button>
          </div>
        </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-palette-accent-3">
            Select a category to view and add products.
          </div>
        )}
      </div>

      {/* View Product Modal */}
      <ViewProductModal
        product={selectedProduct}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      <CreateCategoryModal
        open={isCreateCategoryOpen}
        onOpenChange={setIsCreateCategoryOpen}
        onSuccess={() => {
          setIsCreateCategoryOpen(false);
          refetchCategories();
        }}
      />

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={() => setEditingCategory(null)}
          onSuccess={handleCategoryChangeSuccess}
        />
      )}
    </div>
  );
}
