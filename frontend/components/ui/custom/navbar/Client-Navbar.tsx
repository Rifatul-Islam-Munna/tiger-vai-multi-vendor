"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  ShoppingBag,
  Laptop,
  Shirt,
  Watch,
  Smartphone,
  Home as HomeIcon,
  Sparkles,
  Baby,
  Package,
  ChevronRight,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BasicUser } from "@/@types/userType";
import { logOut } from "@/actions/auth";
import { UserProfileDropdown } from "./common/UserProfileDropdown";
import CartSheet from "./CartSheet";
import { SearchModal } from "./SearchModal";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { CartData } from "@/@types/wishlist";
import { useWishHook } from "@/zustan-hook/wishListhook";
import { Category, CategoryResponse } from "@/@types/category-brand";

const ClientNavbar = ({ user }: { user: BasicUser | null }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const pathName = usePathname();
  const router = useRouter();
  const { setWishList } = useWishHook((state) => state);

  const { data, isPending } = useQueryWrapper<CartData>(
    ["get-my-wish-list"],
    "/cart/get-cart-list",
    {
      enabled: !!user?.id,
      staleTime: 1000 * 60 * 5,
    }
  );

  useEffect(() => {
    if (!data) return;
    setWishList(data || []);
  }, [data, setWishList]);

  const { data: topCategories } = useQueryWrapper<Category[]>(
    ["get-mytop-category"],
    "/get-top-category",
    {},
    500
  );

  const { data: allCategory } = useQueryWrapper<CategoryResponse>(
    ["get-category"],
    "/category",
    {},
    500
  );

  // Icon mapping function
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, JSX.Element> = {
      Electronics: <Laptop className="w-5 h-5" />,
      "Mobiles & Tablets": <Smartphone className="w-5 h-5" />,
      Fashion: <Shirt className="w-5 h-5" />,
      "Home & Kitchen": <HomeIcon className="w-5 h-5" />,
      "Beauty & Health": <Sparkles className="w-5 h-5" />,
      "Watches & Jewelry": <Watch className="w-5 h-5" />,
      "Baby Products": <Baby className="w-5 h-5" />,
      "Sports & Outdoors": <Package className="w-5 h-5" />,
    };
    return iconMap[categoryName] ?? <Package className="w-5 h-5" />;
  };

  // Get all categories data
  const allCategories = allCategory?.data ?? [];

  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle logout
  const handleLogout = async () => {
    await logOut();
    setMobileMenuOpen(false);
  };

  // Navigate to dashboard
  const navigateToDashboard = () => {
    const dashboardPath =
      user?.role === "vendor"
        ? "/dashboard/vendor"
        : user?.role === "admin"
        ? "/admin"
        : "/user/profile";
    router.push(dashboardPath);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn("sticky top-0 z-50 border-b shadow-sm", {
        hidden: pathName.includes("user") || pathName.includes("admin"),
      })}
      style={{
        backgroundColor: "white",
        borderColor: "#e5e7eb",
      }}
    >
      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={"/"}>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--palette-btn)" }}
              >
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span
                className="text-2xl font-bold"
                style={{ color: "var(--palette-text)" }}
              >
                MarketHub
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <SearchModal />

          {/* Right Side Actions - Desktop */}
          <div className="hidden lg:flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Heart
                className="w-7 h-7"
                style={{ color: "var(--palette-text)" }}
              />
              <span
                className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center shadow-sm"
                style={{ backgroundColor: "var(--palette-btn)" }}
              >
                {data?.cartProducts?.length ?? 0}
              </span>
            </Button>
            <CartSheet />
            <UserProfileDropdown user={user} />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-3 rounded-lg active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              minWidth: "48px",
              minHeight: "48px",
              color: "var(--palette-text)",
            }}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop Navigation with Categories */}
        <div
          className="border-t py-3 hidden lg:flex items-center gap-4"
          style={{ borderColor: "#e5e7eb" }}
        >
          {/* View All Categories Button with Sheet */}
          <Sheet open={categoryMenuOpen} onOpenChange={setCategoryMenuOpen}>
            <SheetTrigger asChild>
              <Button
                className="text-white shadow-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--palette-btn)" }}
              >
                <Menu className="w-4 h-4 mr-2" />
                View All Categories
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-[900px] p-0">
              <div className="flex h-full">
                {/* Left Sidebar - Categories List */}
                <div
                  className="w-80 border-r overflow-y-auto"
                  style={{
                    backgroundColor: "#fafafa",
                    borderColor: "#e5e7eb",
                  }}
                >
                  <SheetHeader
                    className="p-4 border-b bg-white"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <SheetTitle style={{ color: "var(--palette-text)" }}>
                      All Categories
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-2">
                    {allCategories?.map((category) => (
                      <div
                        key={category._id}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all",
                          hoveredCategory === category.name &&
                            "bg-white shadow-sm"
                        )}
                        style={
                          hoveredCategory === category.name
                            ? { color: "var(--palette-btn)" }
                            : { color: "var(--palette-text)" }
                        }
                        onMouseEnter={() => setHoveredCategory(category.name)}
                      >
                        <div className="w-8 h-8 flex items-center justify-center">
                          {category.logoUrl ? (
                            <img
                              src={category.logoUrl}
                              alt={category.name}
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            getCategoryIcon(category.name)
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{category.name}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Content - Subcategories */}
                <div className="flex-1 overflow-y-auto bg-white">
                  {hoveredCategory ? (
                    <div className="p-6">
                      <div>
                        <h3
                          className="text-lg font-bold mb-4 pb-2 border-b"
                          style={{
                            color: "var(--palette-text)",
                            borderColor: "#e5e7eb",
                          }}
                        >
                          Shop by Category
                        </h3>
                        <div className="space-y-6">
                          {allCategories
                            .find((cat) => cat.name === hoveredCategory)
                            ?.sub?.map((subcategory, index) => (
                              <div key={index}>
                                <h4
                                  className="text-sm font-bold mb-3"
                                  style={{ color: "var(--palette-text)" }}
                                >
                                  {subcategory.SubMain}
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                                  {subcategory.subCategory?.map((item) => (
                                    <Link
                                      key={item}
                                      href={`/search-product?category=${item}`}
                                      className="text-sm text-gray-600 hover:text-[var(--palette-btn)] transition-colors truncate"
                                    >
                                      • {item}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">
                          Hover over a category to see details
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Navigation Menu for Top Categories */}
          <NavigationMenu>
            <NavigationMenuList>
              {topCategories?.slice(0, 6).map((category) => (
                <NavigationMenuItem key={category._id}>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-100">
                    <div className="flex items-center gap-2">
                      {category.logoUrl ? (
                        <img
                          src={category.logoUrl}
                          alt={category.name}
                          className="w-4 h-4 object-contain"
                        />
                      ) : (
                        getCategoryIcon(category.name)
                      )}
                      <span>{category.name}</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {category.sub
                        ?.slice(0, 1)
                        .flatMap((sub) => sub.subCategory?.slice(0, 6) ?? [])
                        .map((item) => (
                          <li key={item}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={`/search-product?category=${item}`}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-[var(--palette-btn)] focus:bg-gray-100"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {item}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* Mobile Menu Sheet - MINIMAL & CLEAN */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-full sm:max-w-[400px] p-0 bg-white"
        >
          {/* Clean Header - No gradient, just logo */}
          <SheetHeader
            className="border-b p-4"
            style={{ borderColor: "#e5e7eb" }}
          >
            <SheetTitle className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--palette-btn)" }}
              >
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span style={{ color: "var(--palette-text)" }}>MarketHub</span>
            </SheetTitle>
          </SheetHeader>

          <div className="overflow-y-auto h-[calc(100vh-80px)]">
            <div className="p-4">
              {/* User Profile Section - Minimal design */}
              {user ? (
                <div
                  className="mb-4 border rounded-xl p-4"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white text-base"
                      style={{ backgroundColor: "var(--palette-btn)" }}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm capitalize truncate"
                        style={{ color: "var(--palette-text)" }}
                      >
                        {user.name}
                      </p>
                      <p className="text-xs truncate text-gray-500">
                        {user.email}
                      </p>
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium mt-1"
                        style={{
                          backgroundColor: "#f3f4f6",
                          color: "var(--palette-text)",
                        }}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Simple Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={navigateToDashboard}
                      className="w-full text-white"
                      style={{
                        backgroundColor: "var(--palette-btn)",
                        minHeight: "48px",
                      }}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full"
                      style={{
                        minHeight: "48px",
                        borderColor: "#e5e7eb",
                        color: "var(--palette-text)",
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      className="w-full text-white"
                      style={{
                        backgroundColor: "var(--palette-btn)",
                        minHeight: "52px",
                      }}
                    >
                      <User className="w-5 h-5 mr-2" />
                      Login / Signup
                    </Button>
                  </Link>
                </div>
              )}

              {/* Wishlist & Cart - Clean design */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full relative"
                      style={{
                        minHeight: "52px",
                        borderColor: "#e5e7eb",
                      }}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                      {(data?.cartProducts?.length ?? 0) > 0 && (
                        <span
                          className="absolute -top-2 -right-2 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-semibold"
                          style={{ backgroundColor: "var(--palette-btn)" }}
                        >
                          {data?.cartProducts?.length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-full sm:max-w-[400px] bg-white"
                  >
                    <SheetHeader>
                      <SheetTitle
                        className="flex items-center gap-2"
                        style={{ color: "var(--palette-text)" }}
                      >
                        <Heart className="w-5 h-5" />
                        My Wishlist
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      {data?.cartProducts?.length ? (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">
                            You have {data.cartProducts.length} item(s) in your
                            wishlist
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <Heart className="w-16 h-16 mb-4 text-gray-300" />
                          <p className="text-gray-600 font-medium">
                            Your wishlist is empty
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            Add items you love to your wishlist
                          </p>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>

                <CartSheet isMobile />
              </div>

              {/* View All Categories - Clean */}
              <div
                className="border-t pt-4 mb-4"
                style={{ borderColor: "#e5e7eb" }}
              >
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      className="w-full text-white justify-start"
                      style={{
                        backgroundColor: "var(--palette-btn)",
                        minHeight: "52px",
                      }}
                    >
                      <Menu className="w-5 h-5 mr-3" />
                      View All Categories
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full p-0 bg-white">
                    <SheetHeader
                      className="p-4 border-b bg-white"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <SheetTitle style={{ color: "var(--palette-text)" }}>
                        All Categories
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-3">
                      {allCategories?.map((category) => (
                        <Sheet key={category._id}>
                          <SheetTrigger asChild>
                            <div
                              className="flex items-center gap-3 px-3 py-4 rounded-lg cursor-pointer transition-all active:scale-98 mb-2 border"
                              style={{
                                minHeight: "60px",
                                borderColor: "#e5e7eb",
                              }}
                            >
                              <div className="w-10 h-10 flex items-center justify-center">
                                {category.logoUrl ? (
                                  <img
                                    src={category.logoUrl}
                                    alt={category.name}
                                    className="w-6 h-6 object-contain"
                                  />
                                ) : (
                                  <div style={{ color: "var(--palette-text)" }}>
                                    {getCategoryIcon(category.name)}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p
                                  className="text-sm font-medium"
                                  style={{ color: "var(--palette-text)" }}
                                >
                                  {category.name}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </SheetTrigger>
                          <SheetContent
                            side="left"
                            className="w-full p-0 bg-white"
                          >
                            <SheetHeader
                              className="p-4 border-b bg-white"
                              style={{ borderColor: "#e5e7eb" }}
                            >
                              <SheetTitle
                                className="flex items-center gap-3"
                                style={{ color: "var(--palette-text)" }}
                              >
                                <div className="w-8 h-8 flex items-center justify-center">
                                  {category.logoUrl ? (
                                    <img
                                      src={category.logoUrl}
                                      alt={category.name}
                                      className="w-6 h-6 object-contain"
                                    />
                                  ) : (
                                    getCategoryIcon(category.name)
                                  )}
                                </div>
                                <span>{category.name}</span>
                              </SheetTitle>
                            </SheetHeader>
                            <div className="overflow-y-auto h-[calc(100vh-80px)] p-4">
                              <div className="space-y-4">
                                {category.sub?.map((subcategory, index) => (
                                  <div key={index}>
                                    <h4
                                      className="text-sm font-semibold mb-3 pb-2 border-b"
                                      style={{
                                        color: "var(--palette-text)",
                                        borderColor: "#e5e7eb",
                                      }}
                                    >
                                      {subcategory.SubMain}
                                    </h4>
                                    <div className="space-y-1">
                                      {subcategory.subCategory?.map((item) => (
                                        <Link
                                          key={item}
                                          href={`/search-product?category=${item}`}
                                          onClick={() =>
                                            setMobileMenuOpen(false)
                                          }
                                          className="block text-sm text-gray-600 hover:text-[var(--palette-btn)] py-2 px-2 rounded transition-colors"
                                          style={{ minHeight: "44px" }}
                                        >
                                          {item}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Quick Links - Minimal */}
              <div className="border-t pt-4" style={{ borderColor: "#e5e7eb" }}>
                <p className="text-xs font-semibold mb-3 uppercase tracking-wider text-gray-500 px-1">
                  Quick Links
                </p>
                <div className="space-y-2">
                  <Link
                    href="#"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 rounded-lg border transition-colors"
                    style={{
                      minHeight: "52px",
                      borderColor: "#e5e7eb",
                      color: "var(--palette-text)",
                    }}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">Today's Deals</span>
                  </Link>
                  <Link
                    href="#"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 rounded-lg border transition-colors"
                    style={{
                      minHeight: "52px",
                      borderColor: "#e5e7eb",
                      color: "var(--palette-text)",
                    }}
                  >
                    <Package className="w-5 h-5" />
                    <span className="font-medium">Track Order</span>
                  </Link>
                  <Link
                    href="#"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 rounded-lg border transition-colors"
                    style={{
                      minHeight: "52px",
                      borderColor: "#e5e7eb",
                      color: "var(--palette-text)",
                    }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="font-medium">Gift Cards</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default ClientNavbar;
