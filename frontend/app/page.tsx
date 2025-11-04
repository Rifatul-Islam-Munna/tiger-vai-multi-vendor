"use client";
import {
  Zap,
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LandingPage = () => {
  // Navigation categories for hero
  const categories = [
    { name: "Electronics", color: "bg-red-50" },
    { name: "Women's Fashion", color: "bg-pink-50" },
    { name: "Men's Fashion", color: "bg-blue-50" },
    { name: "Watches", color: "bg-green-50" },
    { name: "Mobiles", color: "bg-purple-50" },
    { name: "Home & Kitchen", color: "bg-orange-50" },
    { name: "Beauty", color: "bg-yellow-50" },
    { name: "Baby Care", color: "bg-cyan-50" },
  ];

  // Today's Best Deals
  const dealsProducts = [
    {
      id: 1,
      name: "Modern Laptop",
      price: 55990,
      originalPrice: 79990,
      discount: 30,
      image: "🖥️",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 2499,
      originalPrice: 4999,
      discount: 50,
      image: "⌚",
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 1499,
      originalPrice: 2999,
      discount: 50,
      image: "👟",
    },
    {
      id: 4,
      name: "Wireless Headphones",
      price: 1199,
      originalPrice: 1999,
      discount: 40,
      image: "🎧",
    },
    {
      id: 5,
      name: "Latest Smartphone",
      price: 18500,
      originalPrice: 21999,
      discount: 16,
      image: "📱",
    },
  ];

  // Featured Products
  const featuredProducts = [
    { id: 1, name: "Designer Watch", price: 3500, image: "⌚" },
    { id: 2, name: "Vision Rice Cooker", price: 2800, image: "🍚" },
    { id: 3, name: "Professional Cricket Bat", price: 2100, image: "🏏" },
    { id: 4, name: "Genuine Leather Wallet", price: 950, image: "👜" },
    { id: 5, name: "Walton Air Cooler", price: 8750, image: "❄️" },
  ];

  // Top Brands
  const brands = [
    { name: "Samsung", logo: "SAMSUNG" },
    { name: "Walton", logo: "WALTON" },
    { name: "Apple", logo: "APPLE" },
    { name: "Apex", logo: "APEX" },
    { name: "Bata", logo: "BATA" },
    { name: "LG", logo: "LG" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ============ HERO SECTION ============ */}
      <section className="bg-gradient-to-br from-[#1E3A3A] to-[#2D5555] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-[#e23636] hover:bg-red-700 border-0">
                <Zap className="w-3 h-3 mr-1" />
                Limited Time Offer
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Mega Sale
                <br />
                <span className="text-[#e23636]">Up to 70% Off</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Explore the best deals from top vendors across Bangladesh. Shop
                electronics, fashion, home essentials and more!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-[#e23636] hover:bg-red-700 text-white"
                >
                  Shop Now
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-[#1E3A3A]"
                >
                  Become a Vendor
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center items-center">
              <div className="relative">
                <div className="w-72 h-72 bg-[#e23636] rounded-full opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="relative text-9xl">🛍️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROMOTIONAL BANNERS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="text-4xl mb-2">🎁</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Big Discount Week
              </h3>
              <p className="text-white text-sm mb-4">
                Unbeatable prices on favorite gadgets
              </p>
              <Button
                size="sm"
                className="bg-white text-orange-600 hover:bg-gray-100"
              >
                Shop Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1E3A3A] to-[#2D5555] border-0 overflow-hidden">
            <CardContent className="p-6">
              <Badge className="mb-2 bg-[#e23636] border-0">
                SPECIAL ELECTRONICS
              </Badge>
              <h3 className="text-xl font-bold text-white mb-2">
                Up to 60% Off
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Update your tech with latest brands
              </p>
              <Button
                size="sm"
                className="bg-[#e23636] hover:bg-red-700 text-white"
              >
                Explore Deals
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-100 to-pink-200 border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                BD Exclusive Deals
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                Special offers you won't find elsewhere
              </p>
              <Button
                size="sm"
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                View Offers
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="hover:border-[#e23636] transition cursor-pointer group border-2 border-gray-200 rounded-lg"
            >
              <CardContent className="p-6 flex flex-col items-center justify-center aspect-square">
                <div
                  className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition text-2xl`}
                >
                  📦
                </div>
                <p className="text-xs font-medium text-center text-gray-900">
                  {category.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ============ TODAY'S BEST DEALS ============ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Today's Best Deals
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Ends in:</span>
              <div className="flex gap-2">
                <Badge variant="destructive" className="bg-[#e23636]">
                  02
                </Badge>
                <Badge variant="destructive" className="bg-[#e23636]">
                  18
                </Badge>
                <Badge variant="destructive" className="bg-[#e23636]">
                  43
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {dealsProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:border-[#e23636] transition group border-2 border-gray-200 rounded-lg flex flex-col"
              >
                <div className="relative aspect-square">
                  <Badge className="absolute top-2 left-2 bg-[#e23636] border-0 z-10">
                    {product.discount}% OFF
                  </Badge>
                  <div className="bg-gray-100 h-full flex items-center justify-center text-6xl">
                    {product.image}
                  </div>
                </div>
                <CardContent className="p-4 flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 mb-2 group-hover:text-[#e23636] transition line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-[#e23636]">
                      ৳{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full bg-[#e23636] hover:bg-red-700 text-white">
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TOP BRANDS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Top Brands</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {brands.map((brand, index) => (
            <Card
              key={index}
              className="hover:border-[#e23636] transition cursor-pointer border-2 border-gray-200 rounded-lg aspect-square flex items-center justify-center"
            >
              <CardContent className="p-4 text-center">
                <div className="text-sm font-bold text-gray-600">
                  {brand.logo}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:border-[#e23636] transition border-2 border-gray-200 rounded-lg flex flex-col"
              >
                <div className="bg-gray-100 aspect-square flex items-center justify-center text-5xl">
                  {product.image}
                </div>
                <CardContent className="p-4 flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 text-xs line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-base font-bold text-[#e23636]">
                    ৳{product.price.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VENDOR CTA SECTION ============ */}
      <section className="bg-gradient-to-r from-[#10B981] to-[#059669] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-4">Become a Vendor</h2>
              <p className="text-lg text-green-50 mb-6">
                Join thousands of sellers and grow your business online with us.
                Start selling today and reach millions of customers across
                Bangladesh.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#10B981] text-sm">✓</span>
                  </div>
                  <span>Easy product management</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#10B981] text-sm">✓</span>
                  </div>
                  <span>Secure payment processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#10B981] text-sm">✓</span>
                  </div>
                  <span>24/7 vendor support</span>
                </li>
              </ul>
              <Button
                size="lg"
                className="bg-white text-[#10B981] hover:bg-gray-100"
              >
                Register Here
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="text-9xl">📦</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#e23636] rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">MarketHub</span>
              </div>
              <p className="text-sm mb-4">
                Bangladesh's most trusted multi-vendor e-commerce platform. Shop
                with confidence from thousands of verified sellers.
              </p>
              <div className="flex gap-3">
                <button className="w-9 h-9 bg-gray-800 hover:bg-[#e23636] rounded-full flex items-center justify-center transition">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 bg-gray-800 hover:bg-[#e23636] rounded-full flex items-center justify-center transition">
                  <Instagram className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 bg-gray-800 hover:bg-[#e23636] rounded-full flex items-center justify-center transition">
                  <Twitter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="text-white font-semibold mb-4">Customer Care</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    How to Buy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    Track Your Order
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h3 className="text-white font-semibold mb-4">About Us</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    About MarketHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    Vendor Login
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Payment & Delivery */}
            <div>
              <h3 className="text-white font-semibold mb-4">
                Payment & Delivery
              </h3>
              <ul className="space-y-2 text-sm mb-4">
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    Payment Methods
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    Cash on Delivery
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#e23636] transition">
                    Delivery Information
                  </a>
                </li>
              </ul>
              <div className="text-sm">
                <p className="text-white font-semibold mb-2">
                  Customer Service
                </p>
                <p className="text-[#e23636] text-lg font-bold">
                  +880 1234-567890
                </p>
                <p className="text-xs">Available 24/7</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              © 2025 MarketHub. All Rights Reserved. | Built for Bangladesh with
              ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
