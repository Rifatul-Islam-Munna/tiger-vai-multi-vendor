"use client";
import {
  Zap,
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  ShoppingBag,
  Star,
  Truck,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoProducts } from "@/lib/demodata";
import { ProductCard } from "@/components/ui/custom/navbar/common/CommonCard";

const LandingPage = () => {
  const categories = [
    { name: "Electronics", icon: "📱" },
    { name: "Women's Fashion", icon: "👗" },
    { name: "Men's Fashion", icon: "👔" },
    { name: "Watches", icon: "⌚" },
    { name: "Mobiles", icon: "📲" },
    { name: "Home & Kitchen", icon: "🏠" },
    { name: "Beauty", icon: "💄" },
    { name: "Baby Care", icon: "👶" },
  ];

  const dealsProducts = [
    {
      id: 1,
      name: "Modern Laptop",
      price: 55990,
      originalPrice: 79990,
      discount: 30,
      image: "🖥️",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 2499,
      originalPrice: 4999,
      discount: 50,
      image: "⌚",
      rating: 4.6,
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 1499,
      originalPrice: 2999,
      discount: 50,
      image: "👟",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Wireless Headphones",
      price: 1199,
      originalPrice: 1999,
      discount: 40,
      image: "🎧",
      rating: 4.9,
    },
    {
      id: 5,
      name: "Latest Smartphone",
      price: 18500,
      originalPrice: 21999,
      discount: 16,
      image: "📱",
      rating: 4.8,
    },
  ];

  const featuredProducts = [
    { id: 1, name: "Designer Watch", price: 3500, image: "⌚", rating: 4.8 },
    {
      id: 2,
      name: "Vision Rice Cooker",
      price: 2800,
      image: "🍚",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Professional Cricket Bat",
      price: 2100,
      image: "🏏",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Genuine Leather Wallet",
      price: 950,
      image: "👜",
      rating: 4.9,
    },
    { id: 5, name: "Walton Air Cooler", price: 8750, image: "❄️", rating: 4.6 },
  ];

  const brands = [
    { name: "Samsung", logo: "SAMSUNG" },
    { name: "Walton", logo: "WALTON" },
    { name: "Apple", logo: "APPLE" },
    { name: "Apex", logo: "APEX" },
    { name: "Bata", logo: "BATA" },
    { name: "LG", logo: "LG" },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${
              i < Math.floor(rating)
                ? "fill-palette-btn text-palette-btn"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-palette-bg">
      {/* ============ HERO SECTION ============ */}
      <section className="bg-palette-text text-white py-20 md:py-28">
        <div className=" container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="w-fit bg-palette-btn text-white border-0">
                <Zap className="w-3 h-3 mr-1" />
                Limited Time Offer
              </Badge>

              <div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                  Mega Sale
                </h1>
                <p className="text-4xl font-semibold text-palette-btn">
                  Up to 70% Off
                </p>
              </div>

              <p className="text-lg text-gray-200 leading-relaxed">
                Explore the best deals from top vendors across Bangladesh. Shop
                electronics, fashion, home essentials and more!
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-palette-btn hover:bg-palette-btn/90 text-white font-semibold"
                >
                  Shop Now
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-palette-text hover:bg-white hover:text-palette-text font-semibold"
                >
                  Become a Vendor
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-palette-btn flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold">Fast Delivery</p>
                    <p className="text-gray-300 text-xs">Nationwide</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-palette-btn flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold">100% Safe</p>
                    <p className="text-gray-300 text-xs">Secure</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-palette-btn flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold">Trusted</p>
                    <p className="text-gray-300 text-xs">500K+ Users</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <div className="text-9xl">🛍️</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROMOTIONAL BANNERS ============ */}
      <section className=" container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md hover:shadow-lg transition">
            <CardContent className="p-8">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-palette-text mb-2">
                Big Discount Week
              </h3>
              <p className="text-palette-text/70 text-sm mb-6">
                Unbeatable prices on your favorite items
              </p>
              <Button
                size="sm"
                className="bg-palette-btn hover:bg-palette-btn/90 text-white"
              >
                Shop Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-palette-text text-white border-0 shadow-md hover:shadow-lg transition">
            <CardContent className="p-8">
              <Badge className="mb-3 bg-palette-btn/80 border-0 text-white">
                SPECIAL OFFER
              </Badge>
              <h3 className="text-xl font-bold mb-2">Up to 60% Off</h3>
              <p className="text-gray-200 text-sm mb-6">
                Electronics & gadgets sale
              </p>
              <Button
                size="sm"
                className="bg-palette-btn hover:bg-palette-btn/90 text-white"
              >
                Explore
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition">
            <CardContent className="p-8">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-palette-text mb-2">
                Exclusive Deals
              </h3>
              <p className="text-palette-text/70 text-sm mb-6">
                Special offers for you
              </p>
              <Button
                size="sm"
                className="bg-palette-btn hover:bg-palette-btn/90 text-white"
              >
                View
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className=" container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-palette-text mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="border border-palette-accent-3/20 hover:border-palette-btn/30 transition cursor-pointer shadow-none"
            >
              <CardContent className="p-6 flex flex-col items-center justify-center aspect-square shadow-none">
                <div className="text-4xl mb-2">{category.icon}</div>
                <p className="text-xs font-medium text-center text-palette-text">
                  {category.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ============ TODAY'S BEST DEALS ============ */}
      <section className="bg-gray-50 py-16">
        <div className=" container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-palette-text">
              Today's Best Deals
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-palette-text/70">Ends in:</span>
              <div className="flex gap-2">
                {["02", "18", "43"].map((time) => (
                  <Badge
                    key={time}
                    className="bg-palette-btn text-white border-0"
                  >
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoProducts.map((product, index) => (
              <ProductCard key={index} product={product} variant="default" />
            ))}
          </div>
        </div>
      </section>

      {/* ============ TOP BRANDS ============ */}
      <section className=" container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-palette-text mb-8">
          Top Brands
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {brands.map((brand, index) => (
            <Card
              key={index}
              className="border-2 border-gray-200 hover:border-palette-btn transition cursor-pointer"
            >
              <CardContent className="p-6 aspect-square flex items-center justify-center">
                <div className="text-sm font-bold text-center text-palette-text">
                  {brand.logo}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="bg-gray-50 py-16">
        <div className=" container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-palette-text mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="border-0 shadow-md hover:shadow-lg transition"
              >
                <div className="bg-gray-100 aspect-square flex items-center justify-center text-5xl">
                  {product.image}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-palette-text mb-2 text-xs line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-base font-bold text-palette-btn mt-3">
                    ৳{product.price.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VENDOR CTA SECTION ============ */}
      <section className="bg-palette-text text-white py-16">
        <div className=" container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">Become a Vendor</h2>
              <p className="text-gray-200 text-lg mb-6">
                Join thousands of sellers and grow your business online with us.
                Start selling today and reach millions of customers across
                Bangladesh.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-palette-btn rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Easy product management</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-palette-btn rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Secure payment processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-palette-btn rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>24/7 vendor support</span>
                </li>
              </ul>
              <Button
                size="lg"
                className="bg-palette-btn hover:bg-palette-btn/90 text-white font-semibold"
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
      <footer className="bg-palette-text text-gray-300 pt-16 pb-8">
        <div className=" container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-palette-btn rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">MarketHub</span>
              </div>
              <p className="text-sm mb-4">
                Bangladesh's most trusted multi-vendor e-commerce platform. Shop
                with confidence from thousands of verified sellers.
              </p>
              <div className="flex gap-3">
                <button className="w-9 h-9 bg-gray-700 hover:bg-palette-btn rounded-full flex items-center justify-center transition">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 bg-gray-700 hover:bg-palette-btn rounded-full flex items-center justify-center transition">
                  <Instagram className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 bg-gray-700 hover:bg-palette-btn rounded-full flex items-center justify-center transition">
                  <Twitter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="text-white font-semibold mb-4">Customer Care</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-palette-btn transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-palette-btn transition">
                    How to Buy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-palette-btn transition">
                    Track Your Order
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-palette-btn transition">
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-palette-btn transition">
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
                  <a href="#" className="hover:text-palette-btn transition">
                    About MarketHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-palette-btn transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-palette-btn transition">
                    Vendor Login
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-palette-btn transition">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-palette-btn transition">
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
                  <a href="#" className="hover:text-palette-btn transition">
                    Payment Methods
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-palette-btn transition">
                    Cash on Delivery
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-palette-btn transition">
                    Delivery Info
                  </a>
                </li>
              </ul>
              <div className="text-sm pt-4 border-t border-gray-700">
                <p className="text-white font-semibold mb-1">
                  Customer Service
                </p>
                <p className="text-palette-btn text-lg font-bold">
                  +880 1234-567890
                </p>
                <p className="text-xs text-gray-400">Available 24/7</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm">
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
