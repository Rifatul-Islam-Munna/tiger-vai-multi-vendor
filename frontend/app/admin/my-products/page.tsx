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
import { ArrowLeft, Edit2, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ViewProductModal } from "@/components/ui/custom/admin/create-edit-product/ViewProductModal";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { Product, ProductApiResponse } from "@/@types/short-product";
import { CategoryResponse } from "@/@types/category-brand";
import { CreateCategoryModal } from "@/components/ui/custom/admin/category/CreateCategoryModal";
import { EditCategoryModal } from "@/components/ui/custom/admin/category/EditCategoryModal";
import {
  inferProductType,
  isProductTypeId,
  PRODUCT_TYPES,
  type ProductTypeId,
} from "@/lib/productTypes";

const getCategoryDescription = (category: CategoryItem) => {
  const groups =
    category.sub?.map((item) => item.SubMain).filter(Boolean) || [];

  if (groups.length === 0) return "Products inside this category";

  const preview = groups.slice(0, 3).join(", ");
  return groups.length > 3 ? `${preview}, more` : preview;
};

const getCategoryItemCount = (category: CategoryItem) =>
  category.sub?.reduce(
    (total, group) => total + (group.subCategory?.length || 0),
    0,
  ) || 0;

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

function CategoryPreviewBox({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string;
}) {
  return (
    <div className=" aspect-video w-full overflow-hidden rounded-lg bg-gray-50">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-palette-btn/10 text-xl font-bold text-palette-btn">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

function CategorySelectionCard({
  name,
  logoUrl,
  description,
  meta,
  selected,
  onSelect,
  onEdit,
  editLabel,
}: {
  name: string;
  logoUrl?: string;
  description?: string;
  meta?: string;
  selected?: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  editLabel?: string;
}) {
  return (
    <div
      className={`group relative rounded-lg bg-white p-3 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        selected ? "bg-palette-btn/5 ring-1 ring-palette-btn/30" : ""
      }`}
    >
      <button onClick={onSelect} className="w-full">
        <CategoryPreviewBox name={name} logoUrl={logoUrl} />
        <p className="mt-3 truncate text-sm font-semibold text-gray-800 sm:text-base">
          {name}
        </p>
        {description && (
          <p
            className="mt-1 truncate text-xs"
            style={{ color: "var(--palette-btn)" }}
          >
            {description}
          </p>
        )}
        {meta && <p className="mt-1 text-xs text-gray-500">{meta}</p>}
      </button>

      {onEdit && (
        <button
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white opacity-100 transition hover:bg-black sm:opacity-0 sm:group-hover:opacity-100"
          title={editLabel}
          aria-label={editLabel}
        >
          <Edit2 size={17} />
        </button>
      )}
    </div>
  );
}

function AddCategoryCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-palette-btn/40 bg-white p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-palette-btn hover:bg-palette-btn/5 hover:shadow-md"
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-palette-btn/10 text-palette-btn transition group-hover:bg-palette-btn/20">
          <Plus size={24} />
        </div>
        <p className="text-sm font-semibold text-palette-btn">Add Categories</p>
      </div>
    </button>
  );
}

export default function ProductManagementPage() {
  const searchParams = useSearchParams();
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedProductType, setSelectedProductType] = useState<
    ProductTypeId | ""
  >(() => {
    const queryProductType = searchParams.get("productType");
    if (isProductTypeId(queryProductType)) return queryProductType;

    const main = searchParams.get("main") || "";
    const subMain = searchParams.get("subMain") || "";
    const category = searchParams.get("category") || "";

    if (main || subMain || category) {
      return inferProductType(main, subMain, category);
    }

    return "";
  });
  const [selectedMain, setSelectedMain] = useState(
    searchParams.get("main") || "",
  );
  const [selectedSubMain, setSelectedSubMain] = useState(
    searchParams.get("subMain") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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
      selectedProductType,
      selectedMain,
      selectedSubMain,
      selectedCategory,
    ],
    `/product/getProductVendorAdmin?${query.toString()}`,
    { enabled: !!selectedProductType },
  );
  const { data: categoriesData, refetch: refetchCategories } =
    useQueryWrapper<CategoryResponse>(
      ["product-categories"],
      "/category?page=1&limit=100",
    );
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const selectedMainCategory = categoriesData?.data?.find(
    (category) => category.name === selectedMain,
  );
  const selectedSubGroup = selectedMainCategory?.sub?.find(
    (item) => item.SubMain === selectedSubMain,
  );
  const selectedLabel = [selectedMain, selectedSubMain, selectedCategory]
    .filter(Boolean)
    .join(" > ");
  const selectedQuery: Record<string, string> = {};
  if (selectedProductType) selectedQuery.productType = selectedProductType;
  if (selectedMain) selectedQuery.main = selectedMain;
  if (selectedSubMain) selectedQuery.subMain = selectedSubMain;
  if (selectedCategory) selectedQuery.category = selectedCategory;
  const selectedQueryString = new URLSearchParams(selectedQuery).toString();
  const categoryQuery = selectedQueryString ? `?${selectedQueryString}` : "";
  const addProductHref = {
    pathname: "/admin/my-products/add-product",
    query: selectedQuery,
  };

  const selectedProductTypeConfig = PRODUCT_TYPES.find(
    (type) => type.id === selectedProductType,
  );
  const SelectedProductTypeIcon = selectedProductTypeConfig?.icon;
  const productHeading = selectedLabel
    ? `${selectedLabel} Products`
    : `${selectedProductTypeConfig?.name || "All"} Products`;

  const selectProductType = (value: ProductTypeId) => {
    setSelectedProductType(value);
    setSelectedMain("");
    setSelectedSubMain("");
    setSelectedCategory("");
    setPage(1);
  };

  const clearProductTypeSelection = () => {
    setSelectedProductType("");
    setSelectedMain("");
    setSelectedSubMain("");
    setSelectedCategory("");
    setPage(1);
  };

  const clearCategorySelection = () => {
    setSelectedMain("");
    setSelectedSubMain("");
    setSelectedCategory("");
    setPage(1);
  };

  const selectMainCategory = (value: string) => {
    setSelectedMain(value);
    setSelectedSubMain("");
    setSelectedCategory("");
    setPage(1);
  };

  const selectSubMain = (value: string) => {
    setSelectedSubMain(value);
    setSelectedCategory("");
    setPage(1);
  };

  const selectCategory = (value: string) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const handleCategoryChangeSuccess = (
    category?: CategoryItem,
    action?: "update" | "delete",
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
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Add new category & products
          </h1>
          <Button
            onClick={() => setIsCreateCategoryOpen(true)}
            className="hidden gap-2 text-white sm:flex sm:w-auto"
            style={{ backgroundColor: "var(--palette-btn)" }}
          >
            <Plus size={18} />
            Add Category
          </Button>
        </div>

        {!selectedProductType ? (
          <div className="mx-auto max-w-5xl">
            <div className="mb-6">
              <p
                className="mt-3 text-lg"
                style={{ color: "var(--palette-btn)" }}
              >
                What type of product are you managing?
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCT_TYPES.map((type) => {
                const TypeIcon = type.icon;

                return (
                  <button
                    key={type.id}
                    onClick={() => selectProductType(type.id)}
                    className="group flex items-center gap-4 rounded-lg border-2 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                    style={{ borderColor: "var(--palette-btn)" }}
                  >
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg sm:h-16 sm:w-16"
                      style={{ backgroundColor: type.iconBg }}
                    >
                      <TypeIcon className="h-7 w-7 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold leading-tight text-palette-text">
                        {type.name}
                      </h3>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--palette-btn)" }}
                      >
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setIsCreateCategoryOpen(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 text-white sm:hidden"
              style={{ backgroundColor: "var(--palette-btn)" }}
            >
              <Plus size={18} />
              Add Category
            </Button>
          </div>
        ) : (
          <>
            {selectedProductTypeConfig && SelectedProductTypeIcon && (
              <div
                className="mb-6 rounded-lg border-2 bg-white p-4 sm:p-5"
                style={{
                  borderColor: selectedProductTypeConfig.iconBg,
                  backgroundColor: selectedProductTypeConfig.bgColor,
                }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg sm:h-16 sm:w-16"
                      style={{
                        backgroundColor: selectedProductTypeConfig.iconBg,
                      }}
                    >
                      <SelectedProductTypeIcon className="h-7 w-7 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold leading-tight text-palette-text sm:text-xl">
                        {selectedProductTypeConfig.name}
                      </h3>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--palette-btn)" }}
                      >
                        {selectedProductTypeConfig.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearProductTypeSelection}
                    className="flex w-fit items-center gap-1 text-sm text-palette-btn hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Product Types
                  </button>
                </div>
              </div>
            )}

            <div className="mb-6 space-y-5">
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">
                    {!selectedMain && "Main Categories"}
                    {selectedMain &&
                      !selectedSubMain &&
                      `Sub Groups - ${selectedMain}`}
                    {selectedSubMain &&
                      !selectedCategory &&
                      `Categories - ${selectedSubMain}`}
                    {selectedCategory && `Products - ${selectedCategory}`}
                  </h2>
                  <div className="flex items-center gap-2">
                    {(selectedMain || selectedSubMain || selectedCategory) && (
                      <>
                        {selectedCategory && (
                          <button
                            onClick={() => {
                              setSelectedCategory("");
                              setPage(1);
                            }}
                            className="flex items-center gap-1 text-sm text-palette-btn hover:underline"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Categories
                          </button>
                        )}
                        {selectedSubMain && !selectedCategory && (
                          <button
                            onClick={() => {
                              setSelectedSubMain("");
                              setSelectedCategory("");
                              setPage(1);
                            }}
                            className="flex items-center gap-1 text-sm text-palette-btn hover:underline"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Sub Groups
                          </button>
                        )}
                        {selectedMain && !selectedSubMain && (
                          <button
                            onClick={() => {
                              setSelectedMain("");
                              setSelectedSubMain("");
                              setSelectedCategory("");
                              setPage(1);
                            }}
                            className="flex items-center gap-1 text-sm text-palette-btn hover:underline"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Main Categories
                          </button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearCategorySelection}
                        >
                          Clear Filters
                        </Button>
                      </>
                    )}
                    {selectedMainCategory && !selectedSubMain && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCategory(selectedMainCategory)}
                      >
                        Add Category
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {!selectedMain &&
                    (categoriesData?.data || []).map((category) => {
                      const itemCount = getCategoryItemCount(category);

                      return (
                        <CategorySelectionCard
                          key={category._id}
                          name={category.name}
                          logoUrl={category.logoUrl}
                          description={getCategoryDescription(category)}
                          meta={`${category.sub?.length || 0} sub group${
                            (category.sub?.length || 0) !== 1 ? "s" : ""
                          } - ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
                          selected={selectedMain === category.name}
                          onSelect={() => selectMainCategory(category.name)}
                          onEdit={() => setEditingCategory(category)}
                          editLabel={`Update ${category.name}`}
                        />
                      );
                    })}
                  {!selectedMain && (
                    <AddCategoryCard onClick={() => setIsCreateCategoryOpen(true)} />
                  )}
                  {selectedMain &&
                    !selectedSubMain &&
                    selectedMainCategory?.sub.map((sub, index) => (
                      <CategorySelectionCard
                        key={index}
                        name={sub.SubMain}
                        meta={`${sub.subCategory?.length || 0} item${
                          (sub.subCategory?.length || 0) !== 1 ? "s" : ""
                        }`}
                        selected={selectedSubMain === sub.SubMain}
                        onSelect={() => selectSubMain(sub.SubMain)}
                      />
                    ))}
                  {selectedMain && !selectedSubMain && selectedMainCategory && (
                    <AddCategoryCard onClick={() => setIsCreateCategoryOpen(true)} />
                  )}
                  {selectedSubMain &&
                    selectedSubGroup &&
                    selectedSubGroup.subCategory.map((subCategory, index) => (
                      <CategorySelectionCard
                        key={index}
                        name={subCategory}
                        selected={selectedCategory === subCategory}
                        onSelect={() => selectCategory(subCategory)}
                      />
                    ))}
                  {selectedSubMain && selectedSubGroup && (
                    <AddCategoryCard onClick={() => setIsCreateCategoryOpen(true)} />
                  )}
                </div>
                {categoriesData?.data?.length === 0 && !selectedMain && (
                  <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-palette-accent-3">
                    No categories found.
                  </div>
                )}
                {selectedMain &&
                  !selectedSubMain &&
                  selectedMainCategory?.sub?.length === 0 && (
                    <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-palette-accent-3">
                      No sub groups found.
                    </div>
                  )}
                {selectedSubMain &&
                  selectedSubGroup?.subCategory?.length === 0 && (
                    <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-palette-accent-3">
                      No categories found.
                    </div>
                  )}
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold">{productHeading}</h2>
              <Link href={addProductHref} className="hidden sm:block">
                <Button
                  className="flex items-center justify-center gap-2 text-white"
                  style={{ backgroundColor: "var(--palette-btn)" }}
                >
                  <Plus size={20} />
                  Add Product
                </Button>
              </Link>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="w-full sm:flex-1">
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

              <div className="w-full sm:flex-1">
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

              <div className="w-full sm:flex-1">
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
            <div className="block sm:hidden mb-4">
              <Link href={addProductHref}>
                <Button
                  className="flex w-full items-center justify-center gap-2 text-white"
                  style={{ backgroundColor: "var(--palette-btn)" }}
                >
                  <Plus size={20} />
                  Add Product
                </Button>
              </Link>
            </div>
            {/* Table */}
            <div
              className="overflow-x-auto rounded-lg border"
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
                      className="hover:bg-white/5 transition py-2"
                    >
                      <TableCell>
                        <img
                          src={product?.thumbnail}
                          alt={product?.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium py-8">
                        {product.name}
                      </TableCell>
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
                        <span
                          className={product.stock < 20 ? "text-red-400" : ""}
                        >
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
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div style={{ color: "var(--palette-accent-3)" }}>
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total}
              </div>
              <div className="flex flex-wrap gap-2">
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
