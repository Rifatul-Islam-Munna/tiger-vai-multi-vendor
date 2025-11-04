"use client";

import { useState } from "react";
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

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // All Categories with detailed subcategories and brands
  const allCategories = [
    {
      name: "Electronics",
      icon: <Laptop className="w-5 h-5" />,
      image: "💻",
      subcategories: [
        {
          name: "Computers & Laptops",
          items: [
            "Gaming Laptops",
            "Business Laptops",
            "MacBooks",
            "Chromebooks",
            "Desktop PCs",
            "All-in-One PCs",
          ],
        },
        {
          name: "Computer Accessories",
          items: [
            "Keyboards",
            "Mouse",
            "Monitors",
            "Webcams",
            "USB Hubs",
            "Laptop Stands",
          ],
        },
        {
          name: "Storage & Memory",
          items: [
            "SSD",
            "Hard Drives",
            "RAM",
            "Memory Cards",
            "Flash Drives",
            "External Storage",
          ],
        },
        {
          name: "Networking",
          items: [
            "Routers",
            "WiFi Extenders",
            "Network Cards",
            "Ethernet Cables",
            "Switches",
            "Modems",
          ],
        },
      ],
      brands: [
        "Apple",
        "Dell",
        "HP",
        "Lenovo",
        "Asus",
        "Acer",
        "MSI",
        "Samsung",
        "LG",
        "Corsair",
        "Logitech",
        "Razer",
      ],
    },
    {
      name: "Mobiles & Tablets",
      icon: <Smartphone className="w-5 h-5" />,
      image: "📱",
      subcategories: [
        {
          name: "Smartphones",
          items: [
            "Android Phones",
            "iPhones",
            "Gaming Phones",
            "Budget Phones",
            "Flagship Phones",
            "5G Phones",
          ],
        },
        {
          name: "Tablets & iPads",
          items: [
            "Android Tablets",
            "iPads",
            "Windows Tablets",
            "Kids Tablets",
            "Drawing Tablets",
            "E-Readers",
          ],
        },
        {
          name: "Mobile Accessories",
          items: [
            "Phone Cases",
            "Screen Protectors",
            "Chargers",
            "Power Banks",
            "Phone Holders",
            "Selfie Sticks",
          ],
        },
        {
          name: "Wearables",
          items: [
            "Smart Watches",
            "Fitness Bands",
            "Smart Rings",
            "Smart Glasses",
            "VR Headsets",
            "Health Trackers",
          ],
        },
      ],
      brands: [
        "Apple",
        "Samsung",
        "Xiaomi",
        "Oppo",
        "Vivo",
        "Realme",
        "OnePlus",
        "Google",
        "Motorola",
        "Nokia",
        "Huawei",
        "Honor",
      ],
    },
    {
      name: "Fashion",
      icon: <Shirt className="w-5 h-5" />,
      image: "👕",
      subcategories: [
        {
          name: "Men's Clothing",
          items: [
            "T-Shirts",
            "Shirts",
            "Jeans",
            "Pants",
            "Jackets",
            "Suits",
            "Ethnic Wear",
            "Sportswear",
          ],
        },
        {
          name: "Women's Clothing",
          items: [
            "Dresses",
            "Tops",
            "Jeans",
            "Sarees",
            "Kurtis",
            "Leggings",
            "Jackets",
            "Sportswear",
          ],
        },
        {
          name: "Kids Fashion",
          items: [
            "Boys Clothing",
            "Girls Clothing",
            "Baby Clothing",
            "School Uniforms",
            "Party Wear",
            "Footwear",
          ],
        },
        {
          name: "Footwear",
          items: [
            "Men's Shoes",
            "Women's Shoes",
            "Kids Shoes",
            "Sports Shoes",
            "Sandals",
            "Boots",
          ],
        },
      ],
      brands: [
        "Nike",
        "Adidas",
        "Puma",
        "Zara",
        "H&M",
        "Levi's",
        "Tommy Hilfiger",
        "Calvin Klein",
        "Uniqlo",
        "Gap",
        "Forever 21",
        "Mango",
      ],
    },
    {
      name: "Home & Kitchen",
      icon: <HomeIcon className="w-5 h-5" />,
      image: "🏠",
      subcategories: [
        {
          name: "Kitchen Appliances",
          items: [
            "Refrigerators",
            "Microwaves",
            "Ovens",
            "Blenders",
            "Rice Cookers",
            "Air Fryers",
          ],
        },
        {
          name: "Home Appliances",
          items: [
            "Washing Machines",
            "Air Conditioners",
            "Fans",
            "Heaters",
            "Vacuum Cleaners",
            "Air Purifiers",
          ],
        },
        {
          name: "Furniture",
          items: [
            "Sofas",
            "Beds",
            "Dining Tables",
            "Chairs",
            "Wardrobes",
            "Shelves",
          ],
        },
        {
          name: "Home Decor",
          items: [
            "Lighting",
            "Curtains",
            "Carpets",
            "Wall Art",
            "Clocks",
            "Cushions",
          ],
        },
      ],
      brands: [
        "LG",
        "Samsung",
        "Whirlpool",
        "Bosch",
        "Philips",
        "Panasonic",
        "Sony",
        "Godrej",
        "Haier",
        "Voltas",
        "Blue Star",
        "Carrier",
      ],
    },
    {
      name: "Beauty & Health",
      icon: <Sparkles className="w-5 h-5" />,
      image: "💄",
      subcategories: [
        {
          name: "Makeup",
          items: [
            "Foundation",
            "Lipstick",
            "Eye Shadow",
            "Mascara",
            "Nail Polish",
            "Makeup Brushes",
          ],
        },
        {
          name: "Skincare",
          items: [
            "Face Wash",
            "Moisturizers",
            "Sunscreen",
            "Serums",
            "Face Masks",
            "Toners",
          ],
        },
        {
          name: "Haircare",
          items: [
            "Shampoo",
            "Conditioner",
            "Hair Oil",
            "Hair Masks",
            "Hair Dryers",
            "Straighteners",
          ],
        },
        {
          name: "Fragrances",
          items: [
            "Perfumes",
            "Deodorants",
            "Body Sprays",
            "Attars",
            "Gift Sets",
            "Travel Size",
          ],
        },
      ],
      brands: [
        "Lakme",
        "Maybelline",
        "L'Oreal",
        "MAC",
        "Nykaa",
        "Revlon",
        "Dove",
        "Nivea",
        "Garnier",
        "Neutrogena",
        "Clinique",
        "Estee Lauder",
      ],
    },
    {
      name: "Watches & Jewelry",
      icon: <Watch className="w-5 h-5" />,
      image: "⌚",
      subcategories: [
        {
          name: "Smart Watches",
          items: [
            "Apple Watch",
            "Samsung Galaxy Watch",
            "Fitbit",
            "Garmin",
            "Amazfit",
            "Noise",
          ],
        },
        {
          name: "Analog Watches",
          items: [
            "Men's Watches",
            "Women's Watches",
            "Couple Watches",
            "Luxury Watches",
            "Sports Watches",
            "Kids Watches",
          ],
        },
        {
          name: "Jewelry",
          items: [
            "Necklaces",
            "Earrings",
            "Rings",
            "Bracelets",
            "Bangles",
            "Pendants",
          ],
        },
        {
          name: "Fashion Accessories",
          items: [
            "Sunglasses",
            "Belts",
            "Wallets",
            "Handbags",
            "Scarves",
            "Hats",
          ],
        },
      ],
      brands: [
        "Apple",
        "Samsung",
        "Fossil",
        "Casio",
        "Titan",
        "Fastrack",
        "Timex",
        "Seiko",
        "Rolex",
        "Omega",
        "Tag Heuer",
        "Michael Kors",
      ],
    },
    {
      name: "Baby Products",
      icon: <Baby className="w-5 h-5" />,
      image: "👶",
      subcategories: [
        {
          name: "Baby Care",
          items: [
            "Diapers",
            "Baby Wipes",
            "Baby Bath",
            "Baby Oil",
            "Baby Powder",
            "Baby Lotion",
          ],
        },
        {
          name: "Baby Gear",
          items: [
            "Strollers",
            "Car Seats",
            "Baby Carriers",
            "Baby Walkers",
            "Play Mats",
            "Baby Monitors",
          ],
        },
        {
          name: "Baby Clothing",
          items: [
            "Rompers",
            "Onesies",
            "Baby Shoes",
            "Baby Hats",
            "Baby Socks",
            "Bibs",
          ],
        },
        {
          name: "Toys & Games",
          items: [
            "Soft Toys",
            "Educational Toys",
            "Baby Rattles",
            "Building Blocks",
            "Musical Toys",
            "Bath Toys",
          ],
        },
      ],
      brands: [
        "Pampers",
        "Huggies",
        "Johnson's",
        "Himalaya",
        "Chicco",
        "Fisher-Price",
        "Graco",
        "Mee Mee",
        "Pigeon",
        "Mothercare",
        "Baby Dove",
        "Mamaearth",
      ],
    },
    {
      name: "Sports & Outdoors",
      icon: <Package className="w-5 h-5" />,
      image: "⚽",
      subcategories: [
        {
          name: "Sports Equipment",
          items: [
            "Cricket",
            "Football",
            "Badminton",
            "Tennis",
            "Basketball",
            "Gym Equipment",
          ],
        },
        {
          name: "Fitness",
          items: [
            "Treadmills",
            "Dumbbells",
            "Yoga Mats",
            "Resistance Bands",
            "Exercise Bikes",
            "Protein Supplements",
          ],
        },
        {
          name: "Outdoor Activities",
          items: [
            "Camping Gear",
            "Hiking Equipment",
            "Bicycles",
            "Skateboards",
            "Fishing",
            "Binoculars",
          ],
        },
        {
          name: "Sports Wear",
          items: [
            "Running Shoes",
            "Sports Jerseys",
            "Gym Wear",
            "Swimming Costumes",
            "Track Pants",
            "Sports Bags",
          ],
        },
      ],
      brands: [
        "Nike",
        "Adidas",
        "Puma",
        "Reebok",
        "Under Armour",
        "Decathlon",
        "Yonex",
        "Wilson",
        "Head",
        "Nivia",
        "Cosco",
        "Kalenji",
      ],
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="text-gray-600">
              Welcome to Our Multi-Vendor Marketplace
            </div>
            <div className="hidden md:flex items-center gap-4 text-gray-600">
              <button className="hover:text-[#e23636] transition">Help</button>
              <button className="hover:text-[#e23636] transition">
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={"/"}>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#e23636] rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                MarketHub
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 h-11 rounded-full border-gray-300 focus:border-[#e23636] focus:ring-[#e23636]"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#e23636] rounded-full flex items-center justify-center hover:bg-red-700 transition">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Right Side Actions - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e23636] text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e23636] text-white text-xs rounded-full flex items-center justify-center">
                5
              </span>
            </Button>
            <Button className="bg-[#e23636] hover:bg-red-700 text-white">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 h-11 rounded-full"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#e23636] rounded-full flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Desktop Navigation with Categories */}
        <div className="border-t border-gray-200 py-3 hidden lg:flex items-center gap-4">
          {/* View All Categories Button with Sheet */}
          <Sheet open={categoryMenuOpen} onOpenChange={setCategoryMenuOpen}>
            <SheetTrigger asChild>
              <Button className="bg-[#e23636] hover:bg-red-700 text-white">
                <Menu className="w-4 h-4 mr-2" />
                View All Categories
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-[900px] p-0">
              <div className="flex h-full">
                {/* Left Sidebar - Categories List */}
                <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                  <SheetHeader className="p-4 border-b border-gray-200">
                    <SheetTitle>All Categories</SheetTitle>
                  </SheetHeader>
                  <div className="p-2">
                    {allCategories.map((category) => (
                      <div
                        key={category.name}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition",
                          hoveredCategory === category.name
                            ? "bg-white text-[#e23636] shadow-sm"
                            : "hover:bg-white hover:shadow-sm"
                        )}
                        onMouseEnter={() => setHoveredCategory(category.name)}
                      >
                        <div className="text-2xl">{category.image}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{category.name}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Content - Brands and Subcategories */}
                <div className="flex-1 overflow-y-auto">
                  {hoveredCategory ? (
                    <div className="p-6">
                      {/* Brands Section - First */}
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#e23636]">
                          Popular Brands
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {allCategories
                            .find((cat) => cat.name === hoveredCategory)
                            ?.brands.map((brand) => (
                              <a
                                key={brand}
                                href="#"
                                className="px-4 py-2 text-sm bg-white border border-gray-200 hover:border-[#e23636] hover:text-[#e23636] rounded-md transition font-medium shadow-sm hover:shadow"
                              >
                                {brand}
                              </a>
                            ))}
                        </div>
                      </div>

                      {/* Subcategories Section - Below Brands */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#e23636]">
                          Shop by Category
                        </h3>
                        <div className="space-y-6">
                          {allCategories
                            .find((cat) => cat.name === hoveredCategory)
                            ?.subcategories.map((subcategory, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-4"
                              >
                                <h4 className="text-sm font-bold text-gray-900 mb-3">
                                  {subcategory.name}
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                                  {subcategory.items.map((item) => (
                                    <a
                                      key={item}
                                      href="#"
                                      className="text-sm text-gray-600 hover:text-[#e23636] transition truncate"
                                    >
                                      • {item}
                                    </a>
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

          {/* Navigation Menu for Quick Categories */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-100">
                  <Laptop className="w-4 h-4 mr-2" />
                  Electronics
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {allCategories
                      .find((cat) => cat.name === "Electronics")
                      ?.subcategories[0]?.items.slice(0, 6)
                      .map((item) => (
                        <li key={item}>
                          <NavigationMenuLink asChild>
                            <a
                              href="#"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-[#e23636] focus:bg-gray-100"
                            >
                              <div className="text-sm font-medium leading-none">
                                {item}
                              </div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-100">
                  <Shirt className="w-4 h-4 mr-2" />
                  Fashion
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {allCategories
                      .find((cat) => cat.name === "Fashion")
                      ?.subcategories[0]?.items.slice(0, 6)
                      .map((item) => (
                        <li key={item}>
                          <NavigationMenuLink asChild>
                            <a
                              href="#"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-[#e23636] focus:bg-gray-100"
                            >
                              <div className="text-sm font-medium leading-none">
                                {item}
                              </div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-[#e23636] focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <Watch className="w-4 h-4 mr-2" />
                  Watches
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-[#e23636] focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-[#e23636] focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  More
                  <ChevronRight className="w-4 h-4 ml-1" />
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-full sm:max-w-[400px] p-0">
          <SheetHeader className="border-b border-gray-200 p-4">
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#e23636] rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span>MarketHub</span>
            </SheetTitle>
          </SheetHeader>

          <div className="overflow-y-auto h-[calc(100vh-80px)]">
            <div className="p-4 space-y-3">
              {/* User Actions */}
              <Button className="w-full bg-[#e23636] hover:bg-red-700 text-white">
                <User className="w-4 h-4 mr-2" />
                Login / Signup
              </Button>
              <Button variant="outline" className="w-full">
                <Heart className="w-4 h-4 mr-2" />
                Wishlist (3)
              </Button>
              <Button variant="outline" className="w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart (5)
              </Button>

              {/* View All Categories - Mobile */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="w-full bg-[#e23636] hover:bg-red-700 text-white justify-start">
                      <Menu className="w-4 h-4 mr-2" />
                      View All Categories
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full p-0">
                    <div className="flex h-full flex-col">
                      {/* Categories List */}
                      <div className="flex-1 overflow-y-auto">
                        <SheetHeader className="p-4 border-b border-gray-200">
                          <SheetTitle>All Categories</SheetTitle>
                        </SheetHeader>
                        <div className="p-2">
                          {allCategories.map((category) => (
                            <Sheet key={category.name}>
                              <SheetTrigger asChild>
                                <div className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                  <div className="text-2xl">
                                    {category.image}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">
                                      {category.name}
                                    </p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                              </SheetTrigger>
                              <SheetContent side="left" className="w-full p-0">
                                <SheetHeader className="p-4 border-b border-gray-200">
                                  <SheetTitle className="flex items-center gap-2">
                                    <span className="text-2xl">
                                      {category.image}
                                    </span>
                                    {category.name}
                                  </SheetTitle>
                                </SheetHeader>
                                <div className="overflow-y-auto h-[calc(100vh-80px)] p-4">
                                  {/* Brands First */}
                                  <div className="mb-6">
                                    <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b-2 border-[#e23636]">
                                      Popular Brands
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                      {category.brands.map((brand) => (
                                        <a
                                          key={brand}
                                          href="#"
                                          className="px-3 py-1.5 text-xs bg-white border border-gray-200 hover:border-[#e23636] hover:text-[#e23636] rounded-md transition font-medium"
                                        >
                                          {brand}
                                        </a>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Subcategories Below */}
                                  <div>
                                    <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b-2 border-[#e23636]">
                                      Shop by Category
                                    </h3>
                                    <div className="space-y-4">
                                      {category.subcategories.map(
                                        (subcategory, index) => (
                                          <div
                                            key={index}
                                            className="bg-gray-50 rounded-lg p-3"
                                          >
                                            <h4 className="text-sm font-bold text-gray-900 mb-2">
                                              {subcategory.name}
                                            </h4>
                                            <div className="space-y-1">
                                              {subcategory.items.map((item) => (
                                                <a
                                                  key={item}
                                                  href="#"
                                                  className="block text-xs text-gray-600 hover:text-[#e23636] transition py-1"
                                                >
                                                  • {item}
                                                </a>
                                              ))}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </SheetContent>
                            </Sheet>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Quick Links */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  QUICK LINKS
                </p>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-sm text-gray-700 hover:text-[#e23636] py-2"
                  >
                    Today's Deals
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-gray-700 hover:text-[#e23636] py-2"
                  >
                    Customer Service
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-gray-700 hover:text-[#e23636] py-2"
                  >
                    Gift Cards
                  </a>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
